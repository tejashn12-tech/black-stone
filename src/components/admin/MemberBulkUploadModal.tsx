import React, { useState, useRef } from 'react';
import { useGym } from '../../context/GymContext';
import { Member, MembershipPackage, PaymentRecord } from '../../types';
import { getEffectiveMemberStatus } from '../../utils/memberStatus';
import {
  Upload,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  X,
  FileText,
  Trash2,
  Database,
  ArrowRight,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface MemberBulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ParsedRow {
  id: string;
  fullName: string;
  phone: string;
  whatsapp: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  packageId: string;
  packageName: string;
  startDate: string;
  expiryDate: string;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  assignedTrainerId?: string;
  assignedTrainerName?: string;
  emergencyContact?: string;
  bloodGroup?: string;
  address?: string;
  notes?: string;
  status: Member['status'];
  isValid: boolean;
  validationError?: string;
}

export const MemberBulkUploadModal: React.FC<MemberBulkUploadModalProps> = ({ isOpen, onClose }) => {
  const { members, packages, trainers, addMember, recordPayment } = useGym();

  const [dragActive, setDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importSummary, setImportSummary] = useState<{ imported: number; total: number } | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // 1. Download Sample CSV Template
  const handleDownloadTemplate = () => {
    const defaultPkg = packages[0]?.name || 'Annual Elite Pro';
    const defaultTrainer = trainers[0]?.name || 'Vikram Rao';
    
    const headers = [
      'FullName',
      'Phone',
      'Email',
      'WhatsApp',
      'Gender',
      'DOB',
      'PackageName',
      'StartDate',
      'ExpiryDate',
      'TotalAmount',
      'PaidAmount',
      'AssignedTrainer',
      'EmergencyContact',
      'BloodGroup',
      'Address',
      'Notes'
    ].join(',');

    const sampleRow1 = [
      'Rohan Nambiar',
      '9845012345',
      'rohan.n@gmail.com',
      '9845012345',
      'Male',
      '1996-08-14',
      `"${defaultPkg}"`,
      '2026-03-01',
      '2027-03-01',
      '15999',
      '15999',
      `"${defaultTrainer}"`,
      '9880199999',
      'O+',
      '"Gokulam 3rd Stage, Mysuru"',
      '"Strength training focus"'
    ].join(',');

    const sampleRow2 = [
      'Pooja Hegde',
      '9900112233',
      'pooja.h@yahoo.com',
      '9900112233',
      'Female',
      '1999-11-20',
      '"Half Yearly"',
      '2026-03-05',
      '2026-09-05',
      '9499',
      '5000',
      '""',
      '9741000000',
      'B+',
      '"Jayalakshmipuram, Mysuru"',
      '"Weight loss and functional fitness"'
    ].join(',');

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, sampleRow1, sampleRow2].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'blackstone_fitness_member_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Robust CSV Parser supporting quotes, commas, and newlines
  const parseCSVText = (text: string): string[][] => {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentCell = '';
    let insideQuote = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (char === '"') {
        if (insideQuote && nextChar === '"') {
          currentCell += '"';
          i++; // Skip escaped quote
        } else {
          insideQuote = !insideQuote;
        }
      } else if ((char === ',' || char === '\t' || char === ';') && !insideQuote) {
        currentRow.push(currentCell.trim());
        currentCell = '';
      } else if ((char === '\r' || char === '\n') && !insideQuote) {
        if (char === '\r' && nextChar === '\n') {
          i++; // Skip \r\n
        }
        currentRow.push(currentCell.trim());
        if (currentRow.some(c => c.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentCell = '';
      } else {
        currentCell += char;
      }
    }

    if (currentCell.length > 0 || currentRow.length > 0) {
      currentRow.push(currentCell.trim());
      if (currentRow.some(c => c.length > 0)) {
        rows.push(currentRow);
      }
    }

    return rows;
  };

  // Process uploaded file
  const handleFileProcess = async (file: File) => {
    setParseError(null);
    setSelectedFileName(file.name);
    setImportSummary(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        if (!content || !content.trim()) {
          setParseError('The uploaded file is empty.');
          return;
        }

        // Check if JSON
        if (file.name.endsWith('.json')) {
          const jsonArr = JSON.parse(content);
          if (!Array.isArray(jsonArr)) {
            setParseError('JSON file must contain an array of member objects.');
            return;
          }
          mapRawObjectsToRows(jsonArr);
          return;
        }

        // CSV or Text parser
        const rawRows = parseCSVText(content);
        if (rawRows.length < 2) {
          setParseError('File must have a header row and at least one member row.');
          return;
        }

        const headers = rawRows[0].map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
        const dataRows = rawRows.slice(1);

        const mapped: any[] = [];
        dataRows.forEach(row => {
          const obj: Record<string, any> = {};
          headers.forEach((h, idx) => {
            obj[h] = row[idx] || '';
          });
          mapped.push(obj);
        });

        mapRawObjectsToRows(mapped);
      } catch (err: any) {
        setParseError(`Failed to parse file: ${err.message || 'Check CSV structure'}`);
      }
    };

    reader.onerror = () => {
      setParseError('Could not read the selected file.');
    };

    reader.readAsText(file);
  };

  // Map arbitrary JSON / CSV field keys to Member Entity
  const mapRawObjectsToRows = (rawList: Record<string, any>[]) => {
    const todayStr = new Date().toISOString().split('T')[0];

    const results: ParsedRow[] = rawList.map((raw, index) => {
      // Find key matching helpers
      const findVal = (...keys: string[]) => {
        for (const k of keys) {
          const cleanK = k.toLowerCase().replace(/[^a-z0-9]/g, '');
          for (const rawKey of Object.keys(raw)) {
            if (rawKey.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanK) {
              if (raw[rawKey] !== undefined && raw[rawKey] !== null) {
                return String(raw[rawKey]).trim();
              }
            }
          }
        }
        return '';
      };

      const fullName = findVal('fullname', 'name', 'membername', 'firstlastname', 'athlete');
      const phoneRaw = findVal('phone', 'mobile', 'contact', 'phonenumber', 'cell', 'tel');
      const cleanPhone = phoneRaw.replace(/\D/g, '').slice(-10) || phoneRaw;
      const whatsapp = findVal('whatsapp', 'wanumber', 'waphone') || cleanPhone;
      const email = findVal('email', 'mail', 'emailaddress') || `${fullName.toLowerCase().replace(/\s+/g, '.') || 'athlete' + index}@gmail.com`;
      
      const genderRaw = findVal('gender', 'sex').toLowerCase();
      const gender: 'Male' | 'Female' | 'Other' = genderRaw.startsWith('f') ? 'Female' : (genderRaw.startsWith('o') ? 'Other' : 'Male');
      const dob = findVal('dob', 'dateofbirth', 'birthdate') || '1998-01-01';

      // Match Package
      const pkgNameInput = findVal('packagename', 'package', 'plan', 'membership', 'planname');
      let matchedPkg: MembershipPackage | undefined = packages.find(p => 
        p.name.toLowerCase() === pkgNameInput.toLowerCase() ||
        p.id.toLowerCase() === pkgNameInput.toLowerCase()
      );
      if (!matchedPkg) {
        matchedPkg = packages.find(p => pkgNameInput.toLowerCase().includes(p.name.toLowerCase())) || packages[0];
      }

      // Dates
      const startDate = findVal('startdate', 'joiningdate', 'doj') || todayStr;
      let expiryDate = findVal('expirydate', 'enddate', 'validuntil');
      if (!expiryDate) {
        const start = new Date(startDate);
        const exp = new Date(start);
        exp.setMonth(exp.getMonth() + (matchedPkg?.durationMonths || 12));
        expiryDate = exp.toISOString().split('T')[0];
      }

      // Pricing
      const totalAmountRaw = parseFloat(findVal('totalamount', 'price', 'fee', 'packageamount', 'total'));
      const totalAmount = !isNaN(totalAmountRaw) && totalAmountRaw > 0 ? totalAmountRaw : (matchedPkg?.price || 15999);

      const paidAmountRaw = parseFloat(findVal('paidamount', 'paid', 'amountpaid', 'received', 'advance'));
      const paidAmount = !isNaN(paidAmountRaw) && paidAmountRaw >= 0 ? paidAmountRaw : totalAmount;

      const pendingAmount = Math.max(0, totalAmount - paidAmount);
      const status: Member['status'] = getEffectiveMemberStatus({
        status: 'active',
        expiryDate,
        pendingAmount
      });

      // Trainer match
      const trainerInput = findVal('assignedtrainer', 'trainer', 'coach', 'trainername');
      const matchedTrainer = trainers.find(t => 
        t.name.toLowerCase().includes(trainerInput.toLowerCase()) || 
        t.id === trainerInput
      );

      const emergencyContact = findVal('emergencycontact', 'emergency', 'guardianphone');
      const bloodGroup = findVal('bloodgroup', 'blood');
      const address = findVal('address', 'location', 'city') || 'Mysuru, Karnataka';
      const notes = findVal('notes', 'remark', 'goal', 'medical');

      // Validation
      let isValid = true;
      let validationError = '';
      if (!fullName) {
        isValid = false;
        validationError = 'Missing Full Name';
      } else if (!cleanPhone || cleanPhone.length < 8) {
        isValid = false;
        validationError = 'Invalid Phone Number';
      }

      return {
        id: `row-${index}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        fullName,
        phone: cleanPhone,
        whatsapp,
        email,
        gender,
        dob,
        packageId: matchedPkg?.id || packages[0]?.id || 'pkg-annual',
        packageName: matchedPkg?.name || packages[0]?.name || 'Annual Elite Pro',
        startDate,
        expiryDate,
        totalAmount,
        paidAmount,
        pendingAmount,
        assignedTrainerId: matchedTrainer?.id,
        assignedTrainerName: matchedTrainer?.name,
        emergencyContact,
        bloodGroup,
        address,
        notes,
        status,
        isValid,
        validationError
      };
    });

    setParsedRows(results);
  };

  // Remove individual row from staging preview
  const handleRemoveRow = (rowId: string) => {
    setParsedRows(prev => prev.filter(r => r.id !== rowId));
  };

  // Drag & drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  // Final Ingestion into Member Directory & Firebase
  const handleCommitImport = async () => {
    const validRows = parsedRows.filter(r => r.isValid);
    if (validRows.length === 0) return;

    setIsProcessing(true);

    try {
      let importedCount = 0;

      for (const row of validRows) {
        // 1. Add member (auto generates BSF-2026-XXX, ID, and writes to Firebase)
        const newMember = addMember({
          fullName: row.fullName,
          phone: row.phone,
          whatsapp: row.whatsapp || row.phone,
          email: row.email,
          gender: row.gender,
          dob: row.dob,
          photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          packageId: row.packageId,
          packageName: row.packageName,
          startDate: row.startDate,
          expiryDate: row.expiryDate,
          status: row.status,
          totalAmount: row.totalAmount,
          paidAmount: row.paidAmount,
          pendingAmount: row.pendingAmount,
          assignedTrainerId: row.assignedTrainerId,
          assignedTrainerName: row.assignedTrainerName,
          emergencyContact: row.emergencyContact,
          bloodGroup: row.bloodGroup,
          address: row.address,
          notes: row.notes || 'Imported via bulk CSV/File ingest'
        }, { skipWhatsApp: true });

        // 2. Record initial payment receipt if paidAmount > 0
        if (row.paidAmount > 0) {
          recordPayment({
            memberId: newMember.id,
            memberName: newMember.fullName,
            memberPhone: newMember.whatsapp,
            packageId: row.packageId,
            packageName: row.packageName,
            amountPaid: row.paidAmount,
            totalPackageAmount: row.totalAmount,
            pendingAmount: row.pendingAmount,
            discount: 0,
            paymentDate: row.startDate,
            paymentMethod: 'UPI',
            status: row.pendingAmount === 0 ? 'PAID' : 'PARTIALLY PAID',
            notes: `Bulk File Import Payment for ${row.packageName}`,
            whatsappStatus: 'Pending',
            expiryDate: row.expiryDate
          }, { skipAutoReceipt: true });
        }

        importedCount++;
      }

      setImportSummary({
        imported: importedCount,
        total: parsedRows.length
      });
      setIsProcessing(false);

    } catch (err: any) {
      setParseError(`Error during member import: ${err.message || 'Check database sync'}`);
      setIsProcessing(false);
    }
  };

  const validCount = parsedRows.filter(r => r.isValid).length;
  const invalidCount = parsedRows.length - validCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-400/10 border border-orange-400/30 flex items-center justify-center text-orange-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white font-display tracking-wide flex items-center gap-2">
                BULK MEMBER IMPORT & FILE UPLOAD
              </h3>
              <p className="text-xs text-zinc-400 font-sans-body">
                Upload CSV, Excel, or JSON spreadsheet files to instantly populate the Member Directory and cloud database.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">

          {/* Success Summary View */}
          {importSummary ? (
            <div className="p-8 text-center space-y-4 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white font-display">
                  {importSummary.imported} Members Successfully Enrolled!
                </h4>
                <p className="text-zinc-300 mt-1 max-w-md mx-auto">
                  All member details, plan assignments, contact info, and payment records have been synchronized into the Member Directory and Firebase Firestore database.
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-orange-400 hover:bg-orange-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-orange-400/20"
                >
                  View Member Directory ({members.length})
                </button>
                <button
                  onClick={() => {
                    setImportSummary(null);
                    setParsedRows([]);
                    setSelectedFileName(null);
                  }}
                  className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs rounded-xl transition"
                >
                  Upload Another File
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Top Help & Download Sample CSV Template */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-sky-400 shrink-0" />
                  <div>
                    <p className="font-bold text-white">Need the correct column structure?</p>
                    <p className="text-zinc-400 text-[11px]">Download our pre-formatted template with standard Black Stone Fitness headers.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="px-3.5 py-2 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 font-bold rounded-xl transition flex items-center gap-2 shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Sample CSV Template</span>
                </button>
              </div>

              {/* Drag & Drop Upload Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
                  dragActive
                    ? 'border-orange-400 bg-orange-400/10 scale-[0.99]'
                    : 'border-zinc-700 hover:border-zinc-500 bg-zinc-950/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls,.json,.txt"
                  className="hidden"
                  onChange={handleFileInputChange}
                />

                <div className="w-14 h-14 rounded-2xl bg-orange-400/10 border border-orange-400/30 flex items-center justify-center text-orange-400 shadow-inner">
                  <Upload className="w-7 h-7" />
                </div>

                <div>
                  <p className="text-sm font-bold text-white">
                    {selectedFileName ? (
                      <span className="text-orange-400 font-mono">{selectedFileName}</span>
                    ) : (
                      'Drag & Drop your spreadsheet here or click to browse'
                    )}
                  </p>
                  <p className="text-zinc-400 text-[11px] mt-1 font-mono">
                    Supports .CSV, .XLSX, .XLS, .JSON, and .TXT spreadsheets
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-[10px] font-bold uppercase tracking-wider">
                  Auto-Column Detection & Type Mapping Active
                </span>
              </div>

              {/* Error Message */}
              {parseError && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-2xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="font-semibold">{parseError}</p>
                </div>
              )}

              {/* Staging Data Preview Table */}
              {parsedRows.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white uppercase tracking-wider">
                        File Records Preview ({parsedRows.length} Detected)
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[10px]">
                        {validCount} Ready
                      </span>
                      {invalidCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold text-[10px]">
                          {invalidCount} Incomplete
                        </span>
                      )}
                    </div>

                    <p className="text-zinc-400 text-[11px]">
                      Review athletes before importing to directory
                    </p>
                  </div>

                  <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950/60 max-h-60 overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-zinc-900/90 text-zinc-400 font-bold text-[11px] sticky top-0 border-b border-zinc-800">
                        <tr>
                          <th className="p-3">Status</th>
                          <th className="p-3">Full Name</th>
                          <th className="p-3">Phone</th>
                          <th className="p-3">Package</th>
                          <th className="p-3">Start / Expiry</th>
                          <th className="p-3">Fee Paid</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60 font-sans-body">
                        {parsedRows.map((row) => (
                          <tr key={row.id} className="hover:bg-zinc-900/50 transition">
                            <td className="p-3">
                              {row.isValid ? (
                                <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[10px]">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Valid
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-rose-400 font-bold text-[10px]" title={row.validationError}>
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  {row.validationError}
                                </span>
                              )}
                            </td>
                            <td className="p-3">
                              <p className="font-bold text-white">{row.fullName || '—'}</p>
                              <p className="text-zinc-500 text-[10px]">{row.email}</p>
                            </td>
                            <td className="p-3 font-mono text-zinc-300">
                              {row.phone || '—'}
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-200 font-semibold text-[10px]">
                                {row.packageName}
                              </span>
                            </td>
                            <td className="p-3 font-mono text-zinc-400 text-[11px]">
                              {row.startDate} → <span className="text-orange-400 font-bold">{row.expiryDate}</span>
                            </td>
                            <td className="p-3 font-mono">
                              <span className="text-emerald-400 font-bold">₹{row.paidAmount.toLocaleString('en-IN')}</span>
                              {row.pendingAmount > 0 && (
                                <span className="text-rose-400 text-[10px] block">Due: ₹{row.pendingAmount}</span>
                              )}
                            </td>
                            <td className="p-3 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveRow(row.id)}
                                className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition"
                                title="Exclude row"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* Modal Footer */}
        {!importSummary && (
          <div className="p-5 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-400 text-xs">
              <Database className="w-4 h-4 text-orange-400" />
              <span>Direct ingestion into Firebase Firestore database</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-zinc-400 hover:text-white font-bold text-xs rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={validCount === 0 || isProcessing}
                onClick={handleCommitImport}
                className="px-6 py-2.5 bg-orange-400 hover:bg-orange-300 disabled:opacity-50 disabled:cursor-not-allowed text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-orange-400/20 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isProcessing ? 'Importing & Syncing...' : `Import ${validCount} Members`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
