with open(r'C:\dev\buybright\frontend\src\components\layout\Header.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for i, l in enumerate(lines):
    if any(k in l.lower() for k in ['presto', 'dental']):
        print(f"Header Line {i+1}: {l.strip()[:100]}")
