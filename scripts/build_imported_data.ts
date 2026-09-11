import fs from 'fs';
import path from 'path';

function titleCase(raw: string): string {
  if (!raw) return '';
  const clean = raw.trim().replace(/\./g, ' ').replace(/\s+/g, ' ');
  return clean
    .split(' ')
    .map(w => {
      if (!w) return '';
      if (w.length === 1) return w.toUpperCase();
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(' ')
    .trim();
}

function formatPhone(raw: string): string {
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    const local = digits.slice(2);
    return `+91 ${local.slice(0, 5)} ${local.slice(5)}`;
  } else if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return raw.trim();
}

function parseDate(dStr: string): string {
  if (!dStr) return '';
  const parts = dStr.trim().split('-');
  if (parts.length === 3) {
    const [d, m, y] = parts;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  return dStr.trim();
}

const csvPath = path.join(process.cwd(), 'raw_members.csv');
const content = fs.readFileSync(csvPath, 'utf8').trim();
const lines = content.split('\n');
const rows = lines.slice(1).map(l => l.split(','));

const emailCounts = new Map<string, number>();

const members = rows.map((r, idx) => {
  const [nameRaw, dobRaw, phoneRaw, genderRaw, statusRaw, dojRaw, doeRaw, feesRaw, planRaw] = r;
  const fullName = titleCase(nameRaw);
  const id = `mem-${1001 + idx}`;
  const memberCode = `BSF-${1001 + idx}`;

  // Unique email
  const baseEmailName = fullName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const eCount = (emailCounts.get(baseEmailName) || 0) + 1;
  emailCounts.set(baseEmailName, eCount);
  const email = eCount === 1 
    ? `${baseEmailName}@blackstonefitness.in`
    : `${baseEmailName}${eCount}@blackstonefitness.in`;

  const phone = formatPhone(phoneRaw);
  const whatsapp = phone;
  const gender = (genderRaw.trim().toLowerCase() === 'female' ? 'Female' : 'Male') as 'Male' | 'Female';
  const dob = parseDate(dobRaw);
  const startDate = parseDate(dojRaw);

  const planClean = (planRaw || '').trim();
  let expiryDate = parseDate(doeRaw);
  if (!expiryDate && startDate) {
    const d = new Date(startDate);
    if (/demo/i.test(planClean)) {
      d.setMonth(d.getMonth() + 3);
    } else {
      d.setMonth(d.getMonth() + 1);
    }
    expiryDate = d.toISOString().split('T')[0];
  }

  const status = statusRaw.trim().toLowerCase() === 'active' ? 'active' : 'expired';
  const fees = parseInt((feesRaw || '').trim(), 10) || 0;

  // Plan matching to the 4 official packages
  let packageId = 'pkg-1';
  let packageName = '1 Month Power Starter';

  if (/1\s*year/i.test(planClean) || fees >= 5000) {
    packageId = 'pkg-12';
    packageName = '12 Months Annual VIP Pro';
  } else if (/6\s*month/i.test(planClean) || fees >= 3500) {
    packageId = 'pkg-6';
    packageName = "6 Months Shred & Bulk";
  } else if (/3\s*month/i.test(planClean) || fees >= 1500) {
    packageId = 'pkg-3';
    packageName = "3 Months Power Builder";
  } else {
    packageId = 'pkg-1';
    packageName = '1 Month Power Starter';
  }

  return {
    id,
    memberCode,
    fullName,
    email,
    phone,
    whatsapp,
    gender,
    dob,
    packageId,
    packageName,
    startDate,
    expiryDate,
    status,
    totalAmount: fees,
    paidAmount: fees,
    pendingAmount: 0,
    joinedDate: startDate,
    notes: `Plan: ${planClean || 'General Membership'}. Code: ${memberCode}.`,
    emergencyContact: phone,
    address: 'Basaveshwaranagar, Sharadadevi Nagar, Mysuru, Karnataka 570023'
  };
});

// Generate payments for members with fees > 0
let payCounter = 1;
const payments = members
  .filter(m => m.paidAmount > 0)
  .map(m => {
    const pId = `pay-${2000 + payCounter}`;
    const rNo = `BSF-REC-${100 + payCounter}`;
    payCounter++;
    return {
      id: pId,
      receiptNo: rNo,
      memberId: m.id,
      memberName: m.fullName,
      memberPhone: m.phone,
      packageId: m.packageId,
      packageName: m.packageName,
      amountPaid: m.paidAmount,
      totalPackageAmount: m.totalAmount,
      pendingAmount: 0,
      discount: 0,
      paymentDate: m.startDate,
      paymentMethod: 'UPI' as const,
      status: 'PAID' as const,
      whatsappStatus: 'Delivered' as const,
      notes: `Receipt #${rNo} | Plan: ${m.packageName}`,
      expiryDate: m.expiryDate
    };
  });

// Write to src/data/importedMembers.ts
const membersTsContent = `import { Member } from '../types';

export const PARSED_IMPORTED_MEMBERS: Member[] = ${JSON.stringify(members, null, 2)};
`;
fs.writeFileSync(path.join(process.cwd(), 'src/data/importedMembers.ts'), membersTsContent, 'utf8');
console.log(`Successfully generated src/data/importedMembers.ts with ${members.length} members.`);

// Write to src/data/importedPayments.ts
const paymentsTsContent = `import { PaymentRecord } from '../types';

export const PARSED_IMPORTED_PAYMENTS: PaymentRecord[] = ${JSON.stringify(payments, null, 2)};
`;
fs.writeFileSync(path.join(process.cwd(), 'src/data/importedPayments.ts'), paymentsTsContent, 'utf8');
console.log(`Successfully generated src/data/importedPayments.ts with ${payments.length} payments.`);
