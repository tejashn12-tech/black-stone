import json
import re
from datetime import datetime, timedelta

def add_months(sourcedate, months):
    import calendar
    month = sourcedate.month - 1 + months
    year = sourcedate.year + month // 12
    month = month % 12 + 1
    day = min(sourcedate.day, calendar.monthrange(year, month)[1])
    return datetime(year, month, day)

with open('src/data/importedMembers.ts', 'r') as f:
    text = f.read()

m_match = re.search(r'export const PARSED_IMPORTED_MEMBERS: Member\[\] = (\[.*?\]);', text, re.DOTALL)
if not m_match:
    print('Could not find members JSON array!')
    exit(1)

members = json.loads(m_match.group(1))
print(f'Processing {len(members)} members...')

# Define packages
PACKAGES = {
    'pkg-1': {
        'id': 'pkg-1',
        'name': '1 Month Power Starter',
        'durationMonths': 1,
        'price': 1499,
        'days': 30
    },
    'pkg-3': {
        'id': 'pkg-3',
        'name': '3 Months Power Builder',
        'durationMonths': 3,
        'price': 3499,
        'days': 90
    },
    'pkg-6': {
        'id': 'pkg-6',
        'name': '6 Months Shred & Bulk',
        'durationMonths': 6,
        'price': 5999,
        'days': 180
    },
    'pkg-12': {
        'id': 'pkg-12',
        'name': '12 Months Annual VIP Pro',
        'durationMonths': 12,
        'price': 9999,
        'days': 365
    }
}

# Special known members or rules:
# Voshin: 1 Year (start 2026-08-17 -> exp 2027-08-17)
# Bhargav, Adi U P, Sumanth, Arun Surya, Akshay D S: 3 Months (start Aug 2026 -> exp Nov 2026)
# Sharath S N, Jeevitha, Aditi, Raviprasad: 1 Month (exp 30 days after start)

updated_members = []
updated_payments = []

ref_date = datetime(2026, 9, 1)

for idx, m in enumerate(members):
    start_str = m.get('startDate', '2026-01-01')
    try:
        start_dt = datetime.strptime(start_str, '%Y-%m-%d')
    except:
        start_dt = datetime(2026, 1, 1)
        start_str = '2026-01-01'

    name_lower = m.get('fullName', '').lower()
    
    # Determine plan duration
    if 'voshin' in name_lower or idx % 11 == 0:
        pkg_key = 'pkg-12'
    elif any(k in name_lower for k in ['sharath s n', 'jeevitha', 'aditi', 'raviprasad']) or idx % 5 == 0:
        pkg_key = 'pkg-1'
    elif idx % 7 == 0:
        pkg_key = 'pkg-6'
    else:
        pkg_key = 'pkg-3'

    pkg_info = PACKAGES[pkg_key]
    
    # Compute expiry date
    if 'voshin' in name_lower:
        exp_dt = datetime(2027, 8, 17)
    elif 'bhargav' in name_lower:
        exp_dt = datetime(2026, 11, 10)
    elif 'adi u p' in name_lower:
        exp_dt = datetime(2026, 11, 4)
    elif 'sumanth' in name_lower:
        exp_dt = datetime(2026, 11, 4)
    elif 'arun surya' in name_lower:
        exp_dt = datetime(2026, 11, 4)
    elif 'akshay d s' in name_lower:
        exp_dt = datetime(2026, 11, 4)
    elif 'sharath s n' in name_lower:
        exp_dt = datetime(2026, 9, 4)
    elif 'jeevitha' in name_lower:
        exp_dt = datetime(2026, 8, 28)
    elif 'aditi' in name_lower:
        exp_dt = datetime(2026, 8, 10)
    elif 'raviprasad' in name_lower:
        exp_dt = datetime(2026, 8, 21)
    else:
        if pkg_info['durationMonths'] == 1:
            exp_dt = start_dt + timedelta(days=30)
        elif pkg_info['durationMonths'] == 3:
            exp_dt = start_dt + timedelta(days=90)
        elif pkg_info['durationMonths'] == 6:
            exp_dt = start_dt + timedelta(days=180)
        else:
            exp_dt = start_dt + timedelta(days=365)

    exp_str = exp_dt.strftime('%Y-%m-%d')
    
    # Calculate status relative to ref_date (2026-09-01)
    days_left = (exp_dt - ref_date).days
    if days_left < 0:
        status = 'expired'
    elif days_left <= 7:
        status = 'expiring_soon'
    else:
        status = 'active'

    price = pkg_info['price']
    paid = price
    pending = 0

    # Ensure dob is well-formed
    dob_str = m.get('dob', '2000-01-01')
    if not re.match(r'^\d{4}-\d{2}-\d{2}$', dob_str):
        dob_str = '2000-01-01'

    # Member object
    updated_m = {
        "id": m["id"],
        "memberCode": m["memberCode"],
        "fullName": m["fullName"],
        "email": m.get("email", f"{m['fullName'].lower().replace(' ', '')}@bsfmembers.in"),
        "phone": m["phone"],
        "whatsapp": m.get("whatsapp", m["phone"]),
        "gender": m.get("gender", "Male"),
        "dob": dob_str,
        "photoUrl": m.get("photoUrl", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"),
        "packageId": pkg_info["id"],
        "packageName": pkg_info["name"],
        "startDate": start_str,
        "expiryDate": exp_str,
        "status": status,
        "totalAmount": price,
        "paidAmount": paid,
        "pendingAmount": pending,
        "emergencyContact": m.get("emergencyContact", "+91 98803 97294"),
        "address": m.get("address", "Mysuru, Karnataka 570023"),
        "joinedDate": start_str,
        "notes": m.get("notes", f"Member code {m.get('memberCode')}. Enrolled at Black Stone Fitness.")
    }
    updated_members.append(updated_m)

    # Payment record
    payment_methods = ['UPI', 'Cash', 'Card', 'UPI', 'UPI']
    pay_method = payment_methods[idx % len(payment_methods)]
    rec_no = f"BSF-REC-2026{idx+1:03d}"
    
    updated_p = {
        "id": f"pay-{m['id']}",
        "receiptNo": rec_no,
        "memberId": m["id"],
        "memberName": m["fullName"],
        "memberPhone": m["phone"],
        "packageId": pkg_info["id"],
        "packageName": pkg_info["name"],
        "amountPaid": paid,
        "totalPackageAmount": price,
        "pendingAmount": 0,
        "discount": 0,
        "paymentDate": start_str,
        "paymentMethod": pay_method,
        "status": "PAID",
        "whatsappStatus": "Delivered",
        "whatsappSentAt": f"{start_str} 10:30",
        "expiryDate": exp_str,
        "notes": f"Membership enrollment collection for {m['fullName']}. Receipt #{rec_no}"
    }
    updated_payments.append(updated_p)

# Write updated members
with open('src/data/importedMembers.ts', 'w') as f:
    f.write("import { Member } from '../types';\n\n")
    f.write("export const PARSED_IMPORTED_MEMBERS: Member[] = ")
    f.write(json.dumps(updated_members, indent=2))
    f.write(";\n")

# Write updated payments
with open('src/data/importedPayments.ts', 'w') as f:
    f.write("import { PaymentRecord } from '../types';\n\n")
    f.write("export const PARSED_IMPORTED_PAYMENTS: PaymentRecord[] = ")
    f.write(json.dumps(updated_payments, indent=2))
    f.write(";\n")

print('Successfully generated src/data/importedMembers.ts and src/data/importedPayments.ts!')
