import os

src_dir = r"d:\Python-Project\Prestodental_Website\frontend"
target_dir = os.path.join(src_dir, "src")
extensions = ('.scss', '.css', '.tsx', '.ts', '.html')

count = 0
for root, _, files in os.walk(target_dir):
    for f in files:
        if f.endswith(extensions):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as fp:
                content = fp.read()
            
            new_content = content.replace("'Manrope'", "'Poppins'").replace('"Manrope"', '"Poppins"')
            
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as fp:
                    fp.write(new_content)
                count += 1
                print(f"Updated: {f}")

print(f"Done! Total files updated to Poppins: {count}")
