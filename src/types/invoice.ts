export interface LineItem {
  id: string;
  sNo: number;
  particulars: string;
  sacHsn: string;
  qty: string | number;
  rate: string | number;
  taxableValue: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  total: number;
}

export interface CompanyInfo {
  name: string;
  address: string;
  gstn: string;
  phone: string;
  bankName?: string;
  accountNo?: string;
  ifscCode?: string;
  branch?: string;
}

export interface InvoiceData {
  id: string;
  company: CompanyInfo;
  copyType: string;
  invoiceNo: string;
  invoiceDate: string; // format: DD/MM/YYYY or YYYY-MM-DD
  
  // Buyer Details
  partyName: string;
  partyAddress: string;
  partyCode: string;
  partyGstin: string;
  vehicleNo: string;

  // Tax Setting
  taxType: 'intra' | 'inter'; // intra = CGST+SGST, inter = IGST
  defaultGstRate: number; // e.g. 18 (means 9% CGST + 9% SGST or 18% IGST)

  // Items (10 rows in receipt template)
  items: LineItem[];

  // Totals
  totalBeforeTax: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  totalAfterTax: number;
  amountInWords: string;

  // Signatory
  certificationText: string;
  signatoryCompany: string;
  signatoryTitle: string;

  createdAt: string;
  updatedAt: string;
}

export interface SavedParty {
  id: string;
  name: string;
  address: string;
  gstin: string;
  code: string;
}
