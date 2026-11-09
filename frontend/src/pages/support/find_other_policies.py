with open(r'C:\dev\buybright\frontend\src\pages\support\ReturnPolicyPage.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for i, l in enumerate(lines):
    if any(k in l.lower() for k in ['presto', 'dental']):
        print(f"Return Line {i+1}: {l.strip()[:100]}")

with open(r'C:\dev\buybright\frontend\src\pages\support\PrivacyPolicyPage.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for i, l in enumerate(lines):
    if any(k in l.lower() for k in ['presto', 'dental']):
        print(f"Privacy Line {i+1}: {l.strip()[:100]}")

