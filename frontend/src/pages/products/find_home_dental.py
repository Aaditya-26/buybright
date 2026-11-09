with open(r'C:\dev\buybright\frontend\src\pages\HomePage.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for i, l in enumerate(lines):
    if 'dental' in l.lower():
        print(f"Line {i+1}: {l.strip()[:120]}")
