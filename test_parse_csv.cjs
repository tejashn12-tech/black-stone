const fs = require('fs');

const content = fs.readFileSync('invoices_raw.csv', 'utf8').trim();
const lines = content.split('\n');

let totalNet = 0;
let totalPending = 0;
let totalReceived = 0;
let totalCash = 0;
let totalOnline = 0;
let validRows = 0;

const rows = [];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  // check for corrupted line like "None,p 28-08-25,arvathamm b,a 1 Year membership,5999,0,0,5999.0,0.0,5999.0,5999.0,0.0,0.0,0.0"
  // or "None,ken 21-10-24,dagannaswa nk,1 myMonth gym membership,999,0,0,999.0,0.0,999.0,999.0,0.0,0.0,0.0"
  // or "None,02-09-24,sudarshan k,1 Year membership,5999,0,0,5999.0 NT: welcome to black stone fitness,0.0,5999.0,5999.0,0.0,0.0,0.0"
  
  // Let's parse comma separated carefully
  const parts = line.split(',');
  // if line has weird notes or extra tokens:
  rows.push({ raw: line, parts });
}

console.log("Total parsed rows:", rows.length);
