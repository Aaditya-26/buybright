import os

ctx_dir = r'C:\dev\buybright\frontend\src\context'
for f in os.listdir(ctx_dir):
    if f.endswith('.tsx'):
        p = os.path.join(ctx_dir, f)
        with open(p, 'r', encoding='utf-8') as fp:
            c = fp.read()
            for kw in ['prestodental', 'presto', 'dental']:
                if kw in c.lower():
                    print(f"{f} -> {kw}")

