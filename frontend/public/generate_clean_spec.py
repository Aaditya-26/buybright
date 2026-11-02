import re
import os
import json

base_dir = r"C:\Microlan\Microlan-Prestodental\presto_admin"
web_routes_path = os.path.join(base_dir, "routes", "web.php")
api_routes_path = os.path.join(base_dir, "routes", "api.php")
controllers_dir = os.path.join(base_dir, "app", "Http", "Controllers")

controllers_cache = {}
for fname in os.listdir(controllers_dir):
    if fname.endswith(".php"):
        fpath = os.path.join(controllers_dir, fname)
        try:
            with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
                controllers_cache[fname[:-4]] = f.read()
        except Exception:
            pass

def extract_method_params(controller_name, action_name):
    content = controllers_cache.get(controller_name, "")
    if not content:
        return {}
    
    m = re.search(r"public\s+function\s+" + re.escape(action_name) + r"\s*\(([^)]*)\)\s*\{", content)
    if not m:
        return {}
    
    start_pos = m.end()
    next_m = re.search(r"public\s+function\s+[a-zA-Z0-9_]+\s*\(", content[start_pos:])
    end_pos = start_pos + next_m.start() if next_m else len(content)
    body = content[start_pos:end_pos]
    
    params = {}
    validation_matches = re.findall(r"['\"]([a-zA-Z0-9_]+)['\"]\s*=>\s*['\"]([^'\"]+)['\"]", body)
    for k, v in validation_matches:
        params[k] = {"type": "string", "rules": v, "required": "required" in v}
        
    for p_match in re.finditer(r"\$request->(?:get|input|has)\s*\(\s*['\"]([a-zA-Z0-9_]+)['\"](?:\s*,\s*([^)]+))?", body):
        pname = p_match.group(1)
        default = p_match.group(2)
        if pname not in params:
            params[pname] = {"type": "string", "rules": f"optional (default: {default})" if default else "optional", "required": False}

    for p_match in re.finditer(r"\$request->file\s*\(\s*['\"]([a-zA-Z0-9_]+)['\"]", body):
        pname = p_match.group(1)
        params[pname] = {"type": "file (binary)", "rules": "file upload", "required": False}
        
    for p_match in re.finditer(r"\$request->([a-zA-Z0-9_]+)\b", body):
        pname = p_match.group(1)
        if pname not in ("get", "input", "has", "file", "all", "validate", "user", "header", "ip", "session", "root", "fullUrl", "ajax") and not pname.startswith("_"):
            if pname not in params:
                params[pname] = {"type": "string", "rules": "query or body", "required": False}

    for p_match in re.finditer(r"\$_(?:POST|GET)\s*\[\s*['\"]([a-zA-Z0-9_]+)['\"]", body):
        pname = p_match.group(1)
        if pname not in params:
            params[pname] = {"type": "string", "rules": "form-data/query", "required": False}

    return params

with open(api_routes_path, "r", encoding="utf-8", errors="ignore") as f:
    api_routes_content = f.read()

pattern_api = re.compile(r"Route::(get|post|match)\((?:\[([^\]]+)\],\s*)?['\"]([^'\"]+)['\"]\s*,\s*\[ApiController::class,\s*['\"]([^'\"]+)['\"]\]")

storefront_routes = []
for match in pattern_api.finditer(api_routes_content):
    rtype, methods, path, action = match.groups()
    if rtype == "match":
        http_methods = [m.strip().replace("'", "").replace('"', '').upper() for m in methods.split(",")]
    else:
        http_methods = [rtype.upper()]
    clean_path = path if path.startswith("/") else "/" + path
    if not clean_path.startswith("/api/"):
        clean_path = "/api" + clean_path
    storefront_routes.append({
        "section": "Storefront",
        "methods": http_methods,
        "path": clean_path,
        "controller": "ApiController",
        "action": action
    })

with open(web_routes_path, "r", encoding="utf-8", errors="ignore") as f:
    web_routes_content = f.read()

pattern_web = re.compile(r"Route::(get|post|put|delete|match)\((?:\[([^\]]+)\],\s*)?['\"]([^'\"]+)['\"]\s*,\s*\[([a-zA-Z0-9_]+)::class,\s*['\"]([^'\"]+)['\"]\]")

admin_routes = []
for match in pattern_web.finditer(web_routes_content):
    rtype, methods, path, controller, action = match.groups()
    if rtype == "match":
        http_methods = [m.strip().replace("'", "").replace('"', '').upper() for m in methods.split(",")]
    else:
        http_methods = [rtype.upper()]
    clean_path = path if path.startswith("/") else "/" + path
    admin_routes.append({
        "section": "Admin",
        "methods": http_methods,
        "path": clean_path,
        "controller": controller,
        "action": action
    })

# Clean tag names without brackets
def get_storefront_tag(path, action):
    p = (path + " " + action).lower()
    if any(k in p for k in ["login", "register", "apple", "user", "profile", "password", "address", "customer"]):
        return "Storefront - Authentication & Profile"
    if any(k in p for k in ["cart", "draft", "variation"]):
        return "Storefront - Cart & Procurement Draft"
    if any(k in p for k in ["order", "checkout", "razorpay", "invoice", "track", "cancel", "return"]):
        return "Storefront - Orders & Razorpay Checkout"
    if any(k in p for k in ["product", "brand", "category", "search", "filter", "sort"]):
        return "Storefront - Catalog & Products"
    if any(k in p for k in ["offer", "flash_sale", "banner", "screen", "homepage", "point"]):
        return "Storefront - Marketing & Flash Deals"
    if any(k in p for k in ["rating", "review"]):
        return "Storefront - Ratings & Reviews"
    return "Storefront - Company & Policies"

def get_admin_tag(path, controller, action):
    p = (path + " " + controller + " " + action).lower()
    if "product" in p or "item" in p:
        return "Admin - Products & Catalog"
    if "sub-category" in p or "subcategory" in p:
        return "Admin - Subcategories"
    if "category" in p:
        return "Admin - Categories"
    if "brand" in p:
        return "Admin - Brands & Manufacturers"
    if "order" in p or "invoice" in p:
        return "Admin - Orders & Fulfillment"
    if "flash" in p:
        return "Admin - Flash Sales & Daily Deals"
    if "banner" in p:
        return "Admin - Banners & Ads"
    if "offer" in p or "coupon" in p:
        return "Admin - Offers & Coupons"
    if "customer" in p or "user" in p or "role" in p:
        return "Admin - Users & Roles"
    if "wallet" in p or "referral" in p:
        return "Admin - Wallets & Loyalty"
    if "report" in p or "revenue" in p:
        return "Admin - Reports & Analytics"
    if "company" in p or "setting" in p:
        return "Admin - Settings & Config"
    return "Admin - Core Operations"

paths_openapi = {}
postman_storefront = {}
postman_admin = {}

all_routes = storefront_routes + admin_routes
for r in all_routes:
    section = r["section"]
    controller = r["controller"]
    action = r["action"]
    path_key = r["path"]
    
    if section == "Storefront":
        tag = get_storefront_tag(path_key, action)
    else:
        tag = get_admin_tag(path_key, controller, action)
        
    params = extract_method_params(controller, action)
    summary = action.replace("_", " ").title()
    if section == "Admin":
        summary = f"[{controller}] " + summary
        
    if path_key not in paths_openapi:
        paths_openapi[path_key] = {}
        
    for method in r["methods"]:
        m_lower = method.lower()
        op = {
            "tags": [tag],
            "summary": summary,
            "operationId": f"{section}_{controller}_{action}_{m_lower}_{abs(hash(path_key))%10000}",
            "responses": {
                "200": {
                    "description": "Successful operation",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "status": {"type": "boolean"},
                                    "message": {"type": "string"},
                                    "data": {"type": "object"}
                                }
                            }
                        }
                    }
                }
            }
        }
        
        query_params = []
        body_properties = {}
        required_body = []
        has_file = False
        
        path_param_matches = re.findall(r"\{([a-zA-Z0-9_]+)\}", path_key)
        for pp in path_param_matches:
            query_params.append({
                "name": pp,
                "in": "path",
                "required": True,
                "schema": {"type": "string"},
                "description": f"URL Path parameter {pp}"
            })
            
        for pname, pinfo in params.items():
            if pinfo["type"] == "file (binary)":
                has_file = True
                body_properties[pname] = {"type": "string", "format": "binary"}
            elif m_lower == "get":
                if pname not in path_param_matches:
                    query_params.append({
                        "name": pname,
                        "in": "query",
                        "required": pinfo["required"],
                        "schema": {"type": "string"},
                        "description": pinfo["rules"]
                    })
            else:
                if pname not in path_param_matches:
                    body_properties[pname] = {"type": "string", "description": pinfo["rules"]}
                    if pinfo["required"]:
                        required_body.append(pname)
                    
        if query_params:
            op["parameters"] = query_params
            
        if body_properties:
            content_type = "multipart/form-data" if has_file else "application/json"
            op["requestBody"] = {
                "required": len(required_body) > 0,
                "content": {
                    content_type: {
                        "schema": {
                            "type": "object",
                            "properties": body_properties,
                            **({"required": required_body} if required_body else {})
                        }
                    }
                }
            }
            
        paths_openapi[path_key][m_lower] = op

    target_dict = postman_storefront if section == "Storefront" else postman_admin
    if tag not in target_dict:
        target_dict[tag] = []
        
    first_method = r["methods"][0]
    p_params = []
    for pname, pinfo in params.items():
        p_params.append({"key": pname, "value": "", "description": pinfo["rules"]})
        
    postman_req = {
        "name": summary,
        "request": {
            "method": first_method,
            "header": [{"key": "Accept", "value": "application/json"}],
            "url": {
                "raw": "{{baseUrl}}" + path_key,
                "host": ["{{baseUrl}}"],
                "path": path_key.strip("/").split("/"),
                **({"query": p_params} if first_method == "GET" and p_params else {})
            },
            **({
                "body": {
                    "mode": "urlencoded",
                    "urlencoded": [{"key": p["key"], "value": "", "description": p["description"]} for p in p_params]
                }
            } if first_method in ("POST", "PUT", "PATCH") and p_params else {})
        }
    }
    target_dict[tag].append(postman_req)

openapi_spec = {
    "openapi": "3.0.3",
    "info": {
        "title": "PrestoDental Platform APIs (Storefront & Admin)",
        "description": "Complete interactive API specification for PrestoDental, cleanly bifurcated into Storefront APIs and Admin Panel Operations.",
        "version": "1.0.0"
    },
    "servers": [
        {"url": "/", "description": "Current Running Host (Auto-detected - Zero CORS)"}
    ],
    "paths": paths_openapi
}

output_dir = r"C:\Microlan\Microlan-Prestodental-Python\presto_new_website_python\public"
os.makedirs(output_dir, exist_ok=True)

with open(os.path.join(output_dir, "openapi.json"), "w", encoding="utf-8") as f:
    json.dump(openapi_spec, f, indent=2)

postman_collection = {
    "info": {
        "name": "PrestoDental Platform (Storefront & Admin APIs)",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
        "description": "Complete PrestoDental API collection bifurcated into Customer Storefront APIs and Admin Panel APIs."
    },
    "variable": [
        {"key": "baseUrl", "value": "http://127.0.0.1:8000", "type": "string"}
    ],
    "item": [
        {
            "name": f"🛍️ Storefront APIs ({len(storefront_routes)} Endpoints)",
            "item": [{"name": k.replace("Storefront - ", ""), "item": v} for k, v in postman_storefront.items()]
        },
        {
            "name": f"🛡️ Admin Panel APIs ({len(admin_routes)} Endpoints)",
            "item": [{"name": k.replace("Admin - ", ""), "item": v} for k, v in postman_admin.items()]
        }
    ]
}

with open(os.path.join(output_dir, "prestodental_postman_collection.json"), "w", encoding="utf-8") as f:
    json.dump(postman_collection, f, indent=2)

print("Updated openapi.json and postman collection with clean tag names!")
