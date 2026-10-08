import { jsPDF } from 'jspdf';

export interface ReceiptPdfData {
  gymSettings: {
    gymName: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    email: string;
    gstNumber?: string;
    receiptTerms?: string;
    receiptCollectorName?: string;
  };
  member: {
    fullName: string;
    phone: string;
    whatsapp?: string;
    memberCode: string;
  };
  payment: {
    id: string; // transactionNumber
    receiptNo: string;
    paymentDate: string; // YYYY-MM-DD
    paymentTime?: string; // HH:mm
    paymentMethod: string;
    status: string; // 'PAID', etc.
    totalPackageAmount: number;
    amountPaid: number;
    pendingAmount: number;
    discount?: number;
    notes?: string;
    staffName?: string;
    packageName?: string;
  };
  renewal: {
    packageName: string;
    startDate: string;
    expiryDate: string;
    durationMonths?: number;
  };
}

/**
 * Dynamically converts Indian Rupee numbers to words following the Indian numbering system:
 * Crores, Lakhs, Thousands, Hundreds, Units.
 * e.g. 2499 -> "Rupees Two Thousand, Four Hundred And Ninety-Nine Only"
 */
export function numberToWordsIndian(num: number): string {
  if (isNaN(num) || num === 0) return 'Rupees Zero Only';

  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convertLess1000 = (n: number): string => {
    let s = '';
    if (n >= 100) {
      s += a[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
      if (n > 0) s += 'And ';
    }
    if (n >= 20) {
      s += b[Math.floor(n / 10)];
      if (n % 10 > 0) s += '-' + a[n % 10];
      s += ' ';
    } else if (n > 0) {
      s += a[n] + ' ';
    }
    return s.trim();
  };

  const integerPart = Math.floor(Math.abs(num));
  let n = integerPart;
  const parts: string[] = [];

  const crore = Math.floor(n / 10000000);
  n %= 10000000;
  const lakh = Math.floor(n / 100000);
  n %= 100000;
  const thousand = Math.floor(n / 1000);
  n %= 1000;
  const rem = n;

  if (crore > 0) parts.push(convertLess1000(crore) + ' Crore');
  if (lakh > 0) parts.push(convertLess1000(lakh) + ' Lakh');
  if (thousand > 0) parts.push(convertLess1000(thousand) + ' Thousand');
  if (rem > 0) parts.push(convertLess1000(rem));

  if (parts.length === 0) return 'Rupees Zero Only';

  return 'Rupees ' + parts.join(', ') + ' Only';
}

/**
 * Generates an official, printable A4 PDF receipt matching the BSF Reference invoice layout.
 * Runs seamlessly in both browser and Node.js environments.
 */
export function generateReceiptPdfDoc(data: ReceiptPdfData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const { gymSettings, member, payment, renewal } = data;

  // Palette: Dark blue/blue-gray typography with clean white backdrop
  const primaryDarkBlue = [16, 42, 77]; // #102a4d
  const secondarySlate = [71, 85, 105]; // #475569
  const textDark = [15, 23, 42]; // #0f172a
  const borderColor = [203, 213, 225]; // #cbd5e1
  const bgLight = [248, 250, 252]; // #f8fafc
  const headerBg = [241, 245, 249]; // #f1f5f9
  const accentGold = [249, 115, 22]; // #f97316

  // ==========================================
  // 1. HEADER SECTION
  // ==========================================

  // BSF Logo on Left (Vector monogram badge)
  doc.setFillColor(18, 20, 24);
  doc.roundedRect(14, 12, 22, 22, 3, 3, 'F');
  doc.setDrawColor(accentGold[0], accentGold[1], accentGold[2]);
  doc.setLineWidth(0.6);
  doc.roundedRect(14, 12, 22, 22, 3, 3, 'S');

  doc.setTextColor(accentGold[0], accentGold[1], accentGold[2]);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('BSF', 25, 25.5, { align: 'center' });

  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('EST. 2024', 25, 30.5, { align: 'center' });

  // Center Gym Info
  const gymName = gymSettings.gymName || 'BLACK STONE FITNESS';
  const addressLine = gymSettings.address || '#42, 2nd Stage, Vijayanagar / Dattagalli Ring Road';
  const cityState = `${gymSettings.city || 'Mysuru'} - ${gymSettings.pincode || '570022'}, ${gymSettings.state || 'Karnataka'}, India`;
  const contactLine = `Phone: ${gymSettings.phone || '+91 98803 97294'}  |  Email: ${gymSettings.email || 'blackstonefitness@gmail.com'}`;

  doc.setTextColor(primaryDarkBlue[0], primaryDarkBlue[1], primaryDarkBlue[2]);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(gymName.toUpperCase(), 114, 17, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(secondarySlate[0], secondarySlate[1], secondarySlate[2]);
  doc.text(addressLine, 114, 23, { align: 'center' });
  doc.text(cityState, 114, 28, { align: 'center' });
  doc.text(contactLine, 114, 33, { align: 'center' });

  // Horizontal divider line
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.setLineWidth(0.5);
  doc.line(14, 38, 196, 38);

  // ==========================================
  // 2. MEMBER & RECEIPT INFORMATION SECTION
  // ==========================================
  const infoBoxY = 42;
  const infoBoxH = 34;
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.setLineWidth(0.4);
  doc.roundedRect(14, infoBoxY, 182, infoBoxH, 2, 2, 'FD');

  // Vertical separator
  doc.line(105, infoBoxY, 105, infoBoxY + infoBoxH);

  // LEFT COLUMN: Member Details
  doc.setTextColor(primaryDarkBlue[0], primaryDarkBlue[1], primaryDarkBlue[2]);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(member.fullName || 'Member Name', 18, infoBoxY + 8);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(secondarySlate[0], secondarySlate[1], secondarySlate[2]);
  doc.text('Phone:', 18, infoBoxY + 17);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.setFont('helvetica', 'bold');
  doc.text(member.whatsapp || member.phone || 'N/A', 42, infoBoxY + 17);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(secondarySlate[0], secondarySlate[1], secondarySlate[2]);
  doc.text('Member Code:', 18, infoBoxY + 26);
  doc.setTextColor(accentGold[0], accentGold[1], accentGold[2]);
  doc.setFont('helvetica', 'bold');
  doc.text(member.memberCode || 'BSF-MEMBER', 42, infoBoxY + 26);

  // RIGHT COLUMN: Receipt Metadata
  const rightColX = 110;
  const rightValX = 152;
  const timeStr = payment.paymentTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(secondarySlate[0], secondarySlate[1], secondarySlate[2]);

  doc.text('Receipt Number:', rightColX, infoBoxY + 7);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.setFont('helvetica', 'bold');
  doc.text(payment.receiptNo || 'N/A', rightValX, infoBoxY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(secondarySlate[0], secondarySlate[1], secondarySlate[2]);
  doc.text('Transaction No.:', rightColX, infoBoxY + 13);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.setFont('helvetica', 'bold');
  doc.text(payment.id || 'N/A', rightValX, infoBoxY + 13);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(secondarySlate[0], secondarySlate[1], secondarySlate[2]);
  doc.text('Receipt Date:', rightColX, infoBoxY + 19);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(payment.paymentDate || new Date().toISOString().split('T')[0], rightValX, infoBoxY + 19);

  doc.setTextColor(secondarySlate[0], secondarySlate[1], secondarySlate[2]);
  doc.text('Receipt Time:', rightColX, infoBoxY + 25);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(timeStr, rightValX, infoBoxY + 25);

  doc.setTextColor(secondarySlate[0], secondarySlate[1], secondarySlate[2]);
  doc.text('Payment Status:', rightColX, infoBoxY + 31);
  const isPaid = (payment.status || '').toUpperCase() === 'PAID';
  doc.setTextColor(isPaid ? 16 : 220, isPaid ? 150 : 38, isPaid ? 70 : 38);
  doc.setFont('helvetica', 'bold');
  doc.text(isPaid ? 'Paid' : (payment.status || 'Pending'), rightValX, infoBoxY + 31);

  // ==========================================
  // 3. MEMBERSHIP SUMMARY TABLE
  // ==========================================
  const tableY = 82;
  const colX = {
    qty: 14,
    membership: 26,
    startDate: 76,
    endDate: 104,
    mrp: 130,
    netPrice: 152,
    discount: 172,
    amount: 196
  };

  // Header row
  doc.setFillColor(headerBg[0], headerBg[1], headerBg[2]);
  doc.rect(14, tableY, 182, 8, 'F');
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.rect(14, tableY, 182, 8, 'S');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryDarkBlue[0], primaryDarkBlue[1], primaryDarkBlue[2]);
  doc.text('Qty', 20, tableY + 5.5, { align: 'center' });
  doc.text('Membership', 28, tableY + 5.5, { align: 'left' });
  doc.text('Start Date', 90, tableY + 5.5, { align: 'center' });
  doc.text('End Date', 116, tableY + 5.5, { align: 'center' });
  doc.text('MRP', colX.mrp, tableY + 5.5, { align: 'right' });
  doc.text('Net Price', colX.netPrice, tableY + 5.5, { align: 'right' });
  doc.text('Discount', colX.discount, tableY + 5.5, { align: 'right' });
  doc.text('Amount', colX.amount, tableY + 5.5, { align: 'right' });

  // Data row
  const rowY = tableY + 8;
  const rowH = 10;
  doc.rect(14, rowY, 182, rowH, 'S');

  const mrp = Number(payment.totalPackageAmount || 0);
  const paid = Number(payment.amountPaid || 0);
  const discountVal = Number(payment.discount !== undefined ? payment.discount : Math.max(0, mrp - paid));
  const netPrice = Number(paid);
  const finalAmount = Number(paid);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);

  doc.text('1', 20, rowY + 6.5, { align: 'center' });
  doc.text(renewal.packageName || payment.packageName || 'BSF Membership', 28, rowY + 6.5, { align: 'left' });
  doc.text(renewal.startDate || payment.paymentDate || 'N/A', 90, rowY + 6.5, { align: 'center' });
  doc.text(renewal.expiryDate || 'N/A', 116, rowY + 6.5, { align: 'center' });

  doc.text(`INR ${mrp.toFixed(2)}`, colX.mrp, rowY + 6.5, { align: 'right' });
  doc.text(`INR ${netPrice.toFixed(2)}`, colX.netPrice, rowY + 6.5, { align: 'right' });
  doc.text(`INR ${discountVal.toFixed(2)}`, colX.discount, rowY + 6.5, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.text(`INR ${finalAmount.toFixed(2)}`, colX.amount, rowY + 6.5, { align: 'right' });

  // ==========================================
  // 4. PAYMENT DETAILS SECTION & SUMMARY BOX
  // ==========================================
  const paySectionY = 108;
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryDarkBlue[0], primaryDarkBlue[1], primaryDarkBlue[2]);
  doc.text('Payment Details', 14, paySectionY);

  const payTableY = paySectionY + 4;
  const payTableW = 120;
  const payTableH = 44;

  // Payment Details Outer Container
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.setFillColor(255, 255, 255);
  doc.rect(14, payTableY, payTableW, payTableH, 'S');

  // Sub-table Header
  doc.setFillColor(headerBg[0], headerBg[1], headerBg[2]);
  doc.rect(14, payTableY, payTableW, 7, 'F');
  doc.line(14, payTableY + 7, 14 + payTableW, payTableY + 7);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryDarkBlue[0], primaryDarkBlue[1], primaryDarkBlue[2]);
  doc.text('Payment Date', 16, payTableY + 4.8);
  doc.text('Receipt No.', 37, payTableY + 4.8);
  doc.text('Membership', 60, payTableY + 4.8);
  doc.text('Mode Of Payment', 87, payTableY + 4.8);
  doc.text('Net Amount', 113, payTableY + 4.8);
  doc.text('Total', 131, payTableY + 4.8, { align: 'right' });

  // Sub-table Row 1
  const payRowY = payTableY + 7;
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(payment.paymentDate || 'N/A', 16, payRowY + 5.5);
  doc.text(payment.receiptNo || 'N/A', 37, payRowY + 5.5);

  const planTruncated = (renewal.packageName || payment.packageName || 'Membership').substring(0, 14);
  doc.text(planTruncated, 60, payRowY + 5.5);
  doc.text(payment.paymentMethod || 'UPI', 87, payRowY + 5.5);
  doc.text(`INR ${paid.toFixed(2)}`, 113, payRowY + 5.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`INR ${paid.toFixed(2)}`, 131, payRowY + 5.5, { align: 'right' });

  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.line(14, payRowY + 8, 14 + payTableW, payRowY + 8);

  // Note Section in Payment Details
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(secondarySlate[0], secondarySlate[1], secondarySlate[2]);
  doc.text('Note:', 18, payTableY + 22);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  const noteText = payment.notes || `Membership Renewal for ${renewal.packageName || 'Blackstone Fitness'}`;
  doc.text(noteText, 18, payTableY + 28, { maxWidth: payTableW - 8 });

  // RIGHT SIDE: Total / Paid / Balance Box
  const summaryBoxX = 138;
  const summaryBoxW = 58;
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(summaryBoxX, payTableY, summaryBoxW, payTableH, 2, 2, 'FD');

  // Total Row
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(secondarySlate[0], secondarySlate[1], secondarySlate[2]);
  doc.text('Total', summaryBoxX + 6, payTableY + 11);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(`INR ${mrp.toFixed(2)}`, summaryBoxX + summaryBoxW - 6, payTableY + 11, { align: 'right' });

  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.setLineWidth(0.3);
  doc.line(summaryBoxX + 4, payTableY + 16, summaryBoxX + summaryBoxW - 4, payTableY + 16);

  // Paid Row
  doc.setTextColor(primaryDarkBlue[0], primaryDarkBlue[1], primaryDarkBlue[2]);
  doc.text('Paid', summaryBoxX + 6, payTableY + 26);
  doc.setTextColor(16, 185, 129); // green
  doc.text(`INR ${paid.toFixed(2)}`, summaryBoxX + summaryBoxW - 6, payTableY + 26, { align: 'right' });

  doc.line(summaryBoxX + 4, payTableY + 31, summaryBoxX + summaryBoxW - 4, payTableY + 31);

  // Balance Row
  const balance = Number(payment.pendingAmount !== undefined ? payment.pendingAmount : Math.max(0, mrp - paid));
  doc.setTextColor(secondarySlate[0], secondarySlate[1], secondarySlate[2]);
  doc.text('Balance', summaryBoxX + 6, payTableY + 39);
  doc.setTextColor(balance > 0 ? 220 : textDark[0], balance > 0 ? 38 : textDark[1], balance > 0 ? 38 : textDark[2]);
  doc.text(`INR ${balance.toFixed(2)}`, summaryBoxX + summaryBoxW - 6, payTableY + 39, { align: 'right' });

  // ==========================================
  // 5. TOTAL AMOUNT IN WORDS
  // ==========================================
  const wordsY = payTableY + payTableH + 10;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryDarkBlue[0], primaryDarkBlue[1], primaryDarkBlue[2]);
  doc.text('Total Amount In Words:', 14, wordsY);

  const amountInWords = numberToWordsIndian(paid);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(amountInWords, 55, wordsY, { maxWidth: 140 });

  // ==========================================
  // 6. COLLECTED BY & SIGNATURE SECTION
  // ==========================================
  const sigY = wordsY + 26;
  const sigLineX1 = 138;
  const sigLineX2 = 196;

  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.setLineWidth(0.4);
  doc.line(sigLineX1, sigY, sigLineX2, sigY);

  const staffName = payment.staffName || gymSettings.receiptCollectorName || 'Front Desk Administrator';
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryDarkBlue[0], primaryDarkBlue[1], primaryDarkBlue[2]);
  doc.text('Collected by & Signature', (sigLineX1 + sigLineX2) / 2, sigY + 5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(secondarySlate[0], secondarySlate[1], secondarySlate[2]);
  doc.text(staffName, (sigLineX1 + sigLineX2) / 2, sigY + 10, { align: 'center' });

  // ==========================================
  // 7. TERMS & CONDITIONS SECTION
  // ==========================================
  const termsY = sigY + 18;
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.roundedRect(14, termsY, 182, 28, 2, 2, 'FD');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryDarkBlue[0], primaryDarkBlue[1], primaryDarkBlue[2]);
  doc.text('Terms & Conditions:', 18, termsY + 6);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(secondarySlate[0], secondarySlate[1], secondarySlate[2]);

  const rawTerms = gymSettings.receiptTerms || '1. Membership rates can be revised by the management.\n2. No membership is refundable.';
  const termLines = rawTerms.split('\n').filter(Boolean);

  let curTermY = termsY + 12;
  termLines.forEach(line => {
    doc.text(line.trim(), 18, curTermY);
    curTermY += 5;
  });

  // Footer bar
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184); // #94a3b8
  doc.text('Official System Generated Receipt • Blackstone Fitness Mysuru', 105, 287, { align: 'center' });

  return doc;
}

/**
 * Returns a Node.js Buffer representation of the generated PDF receipt.
 */
export function generateReceiptPdfBuffer(data: ReceiptPdfData): Buffer {
  const doc = generateReceiptPdfDoc(data);
  return Buffer.from(doc.output('arraybuffer'));
}
