import re

# 1. Terms of Use
terms_path = r'C:\dev\buybright\frontend\src\pages\support\TermsOfUsePage.tsx'
with open(terms_path, 'r', encoding='utf-8') as f:
    terms = f.read()

terms = terms.replace('Prestodental.store', 'BuyBright Marketplace')
terms = terms.replace('prestodental.store', 'buybright.com')
terms = terms.replace('Prestodental', 'BuyBright')
terms = terms.replace('support@Prestodental.store', 'support@buybright.com')
terms = terms.replace('support@prestodental.store', 'support@buybright.com')
terms = terms.replace('support@prestodental.in', 'support@buybright.com')
terms = terms.replace('dental purchases', 'marketplace purchases')
terms = terms.replace('dental clinician or someone who is certified', 'customer or authorized buyer who is eligible')
terms = terms.replace('https://dentalkart-application-media.s3.ap-south-1.amazonaws.com/india-medical-devices-rules-2017.pdf', 'https://consumeraffairs.nic.in')
terms = terms.replace('Medical Device Rules Compliance', 'Consumer Protection (E-Commerce) Compliance')
terms = terms.replace('Medical Device Rules (MDR) Mandate', 'Consumer Protection & Fair Trading Mandate')
terms = terms.replace('Mandatory Dental & Medical Council Verification', 'Verified Multi-Seller Marketplace Terms')
terms = terms.replace('Mandatory Dental Council / Drug License Requirement:', 'Marketplace Buyer & Seller Eligibility:')
terms = terms.replace('According to new medical device rules (MDR) it is mandatory to buy from registered suppliers like BuyBright and sell to dental/medical council registered doctors.', 'In accordance with the Consumer Protection (E-Commerce) Rules, BuyBright connects verified third-party sellers with consumers across India with transparent pricing and warranty.')
terms = terms.replace('So it is mandatory to provide the council registration number or drug licence number before placing the order and BuyBright will assume that the provided details are correct and will not be responsible for any false information provided by the customer.', 'Buyers and sellers are required to provide accurate contact, billing, and tax information when completing transactions on the platform.')

with open(terms_path, 'w', encoding='utf-8') as f:
    f.write(terms)
print("Updated TermsOfUsePage.tsx successfully!")

# 2. Return Policy
return_path = r'C:\dev\buybright\frontend\src\pages\support\ReturnPolicyPage.tsx'
with open(return_path, 'r', encoding='utf-8') as f:
    ret = f.read()

ret = ret.replace('responsible@Prestodental.store', 'support@buybright.com')
ret = ret.replace('support@Prestodental.store', 'support@buybright.com')
ret = ret.replace('Prestodental.store', 'BuyBright Marketplace')
ret = ret.replace('prestodental.store', 'buybright.com')
ret = ret.replace('Prestodental', 'BuyBright')
ret = ret.replace('Dental chairs, Dental compressors, UV chambers, autoclaves, X-ray units, RVG sensor machine, Model trimmers, apex locators and endo motors, etc.', 'Customized items, personal intimate apparel, opened software, and installed heavy appliances once verified upon delivery.')

with open(return_path, 'w', encoding='utf-8') as f:
    f.write(ret)
print("Updated ReturnPolicyPage.tsx successfully!")

# 3. Privacy Policy
privacy_path = r'C:\dev\buybright\frontend\src\pages\support\PrivacyPolicyPage.tsx'
with open(privacy_path, 'r', encoding='utf-8') as f:
    priv = f.read()

priv = priv.replace('prestodental.store', 'buybright.com')
priv = priv.replace('Prestodental.store', 'BuyBright Marketplace')
priv = priv.replace('Prestodental', 'BuyBright')
priv = priv.replace('support@prestodental.in', 'support@buybright.com')
priv = priv.replace('dental professionals', 'our valued customers and sellers')

with open(privacy_path, 'w', encoding='utf-8') as f:
    f.write(priv)
print("Updated PrivacyPolicyPage.tsx successfully!")

