import json
import re
from datetime import datetime, timedelta

def parse_date_dmy(d_str):
    if not d_str or d_str == 'None' or not d_str.strip():
        return None
    d_str = d_str.strip()
    # Handle possible weird prefixes like "p 28-08-25", "ken 21-10-24"
    match = re.search(r'(\d{1,2})-(\d{1,2})-(\d{2,4})', d_str)
    if match:
        d, m, y = match.group(1), match.group(2), match.group(3)
        if len(y) == 2:
            yy = int(y)
            y = str(2000 + yy if yy < 50 else 1900 + yy)
        return f"{y.zfill(4)}-{m.zfill(2)}-{d.zfill(2)}"
    return None

def normalize_phone(phone_str):
    if not phone_str:
        return ""
    p = re.sub(r'[^\d+]', '', str(phone_str))
    if not p:
        return ""
    if p.startswith('+91'):
        digits = p[3:]
    elif p.startswith('91') and len(p) == 12:
        digits = p[2:]
    else:
        digits = p
    digits = digits[-10:]
    if len(digits) == 10:
        return f"+91 {digits[:5]} {digits[5:]}"
    elif len(digits) > 0:
        return f"+91 {digits}"
    return ""

def format_name(name):
    if not name:
        return ""
    name = re.sub(r'YDL-\d+', '', name)
    name = name.strip()
    words = [w.capitalize() for w in name.split()]
    return " ".join(words)

def map_plan_to_package(plan_str, amount=0):
    p = (plan_str or '').lower()
    if '1 year' in p or 'annual' in p or '12 month' in p or amount >= 5000:
        return {
            'id': 'pkg-12',
            'name': '12 Months Annual VIP Pro',
            'durationMonths': 12,
            'price': 9999
        }
    elif '6 month' in p:
        return {
            'id': 'pkg-6',
            'name': '6 Months Shred & Bulk',
            'durationMonths': 6,
            'price': 5999
        }
    elif '3 month' in p:
        return {
            'id': 'pkg-3',
            'name': '3 Months Power Builder',
            'durationMonths': 3,
            'price': 3499
        }
    elif 'demo' in p or 'pt' in p:
        return {
            'id': 'pkg-pt',
            'name': 'Personal Training Pro',
            'durationMonths': 1,
            'price': 6000
        }
    else:
        return {
            'id': 'pkg-1',
            'name': '1 Month Power Starter',
            'durationMonths': 1,
            'price': 1499
        }

print("Compiler helper functions ready.")
