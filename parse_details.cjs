const fs = require('fs');

const content = fs.readFileSync('invoices_raw.csv', 'utf8').trim();
const lines = content.split('\n');

let invoiceRows = [];
let totalRow = null;
let mode = 'invoices';
let monthly = [];
let yearly = [];
let overall = {};

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  if (line.includes('Monthly Total Collection')) {
    mode = 'monthly';
    continue;
  }
  if (line.includes('Yearly Total Collection')) {
    mode = 'yearly';
    continue;
  }
  if (line.includes('Overall Totals')) {
    mode = 'overall';
    continue;
  }
  if (mode === 'invoices') {
    if (line.includes('Total,1167839')) {
      totalRow = line;
    } else {
      invoiceRows.push(line);
    }
  } else if (mode === 'monthly') {
    if (line.startsWith('Month,')) continue;
    const [m, amt] = line.split(',');
    if (m && amt) monthly.push({ month: m.trim(), amount: parseFloat(amt) });
  } else if (mode === 'yearly') {
    if (line.startsWith('Year,')) continue;
    const [y, amt] = line.split(',');
    if (y && amt) yearly.push({ year: y.trim(), amount: parseFloat(amt) });
  } else if (mode === 'overall') {
    const [k, v] = line.split(',');
    if (k && v) overall[k.trim()] = parseFloat(v);
  }
}

console.log("Invoice transactions count:", invoiceRows.length);
console.log("Total row:", totalRow);
console.log("Monthly count:", monthly.length);
console.log("Monthly sum:", monthly.reduce((a, b) => a + b.amount, 0));
console.log("Yearly count:", yearly.length);
console.log("Yearly sum:", yearly.reduce((a, b) => a + b.amount, 0));
console.log("Overall:", overall);
