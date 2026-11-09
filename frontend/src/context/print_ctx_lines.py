import os

ctx_dir = r'C:\dev\buybright\frontend\src\context'
for f in os.listdir(ctx_dir):
    if f.endswith('.tsx'):
        p = os.path.join(ctx_dir, f)
        with open(p, 'r', encoding='utf-8') as fp:
            lines = fp.readlines()
            for i, l in enumerate(lines):
                if any(k in l.lower() for k in ['prestodental', 'presto', 'dental']):
                    print(f"{f}:{i+1} -> {l.strip()[:100]}")

