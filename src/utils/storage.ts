import type { InvoiceData, CompanyInfo, LineItem, SavedParty } from '../types/invoice';
import { numberToIndianWords } from './numberToWords';

export const DEFAULT_COMPANY: CompanyInfo = {
  name: 'LEO PLASTICS',
  address: 'NO.555/6, KARPAGAM NAGAR, THIRUMUDVIAKKAM, Chennai, Kancheepuram, Tamil Nadu, 600132',
  gstn: '33SDUPS3805N2ZD',
  phone: '9629284489',
  bankName: '',
  accountNo: '',
  ifscCode: '',
  branch: '',
};

export const createEmptyItem = (sNo: number): LineItem => ({
  id: `item-${sNo}-${Date.now()}`,
  sNo,
  particulars: '',
  sacHsn: '',
  qty: '',
  rate: '',
  taxableValue: 0,
  cgstRate: 9,
  cgstAmount: 0,
  sgstRate: 9,
  sgstAmount: 0,
  igstRate: 0,
  igstAmount: 0,
  total: 0,
});

export const getInitial10Items = (): LineItem[] => {
  return Array.from({ length: 10 }, (_, i) => createEmptyItem(i + 1));
};

export const SAMPLE_INVOICE: InvoiceData = {
  id: 'sample-002-2026',
  company: { ...DEFAULT_COMPANY },
  copyType: 'Original for Receipent',
  invoiceNo: '002/2026-27',
  invoiceDate: '28/10/2026',
  partyName: 'Sri Sakthi Traders',
  partyAddress: 'No.9/189, MANALMEDU, Near NSN COLLEGE, Karur, Karur, Tamil Nadu, 639003',
  partyCode: 'PARTY',
  partyGstin: '33QWZPS7297J1ZU',
  vehicleNo: 'TN02BF3595',
  taxType: 'intra',
  defaultGstRate: 18,
  items: [
    {
      id: 'item-1-sample',
      sNo: 1,
      particulars: 'Waste Plastic Scrap',
      sacHsn: '',
      qty: 9000,
      rate: '15.00',
      taxableValue: 135000,
      cgstRate: 9,
      cgstAmount: 12150,
      sgstRate: 9,
      sgstAmount: 12150,
      igstRate: 0,
      igstAmount: 0,
      total: 159300,
    },
    ...Array.from({ length: 9 }, (_, i) => createEmptyItem(i + 2)),
  ],
  totalBeforeTax: 135000,
  totalCgst: 12150,
  totalSgst: 12150,
  totalIgst: 0,
  totalAfterTax: 159300,
  amountInWords: 'ONE LAKH FIFTY NINE THOUSAND THREE HUNDRED RUPEES ONLY',
  certificationText: 'Ceritified that the particulars given above are true and correct',
  signatoryCompany: 'For LEO PLASTICS',
  signatoryTitle: 'Authorised Signatory',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const createNewBlankInvoice = (): InvoiceData => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  const dateStr = `${day}/${month}/${year}`;

  return {
    id: `inv-${Date.now()}`,
    company: getSavedCompany(),
    copyType: 'Original for Receipent',
    invoiceNo: '',
    invoiceDate: dateStr,
    partyName: '',
    partyAddress: '',
    partyCode: 'PARTY',
    partyGstin: '',
    vehicleNo: '',
    taxType: 'intra',
    defaultGstRate: 18,
    items: getInitial10Items(),
    totalBeforeTax: 0,
    totalCgst: 0,
    totalSgst: 0,
    totalIgst: 0,
    totalAfterTax: 0,
    amountInWords: 'ZERO RUPEES ONLY',
    certificationText: 'Ceritified that the particulars given above are true and correct',
    signatoryCompany: 'For LEO PLASTICS',
    signatoryTitle: 'Authorised Signatory',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// STORAGE KEYS
const STORAGE_KEYS = {
  CURRENT_DRAFT: 'leo_plastics_current_draft',
  INVOICE_HISTORY: 'leo_plastics_invoice_history',
  COMPANY_INFO: 'leo_plastics_company_info',
  SAVED_PARTIES: 'leo_plastics_saved_parties',
};

// Company Info
export function getSavedCompany(): CompanyInfo {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPANY_INFO);
    if (raw) return { ...DEFAULT_COMPANY, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Error reading company info:', e);
  }
  return { ...DEFAULT_COMPANY };
}

export function saveCompanyInfo(company: CompanyInfo): void {
  try {
    localStorage.setItem(STORAGE_KEYS.COMPANY_INFO, JSON.stringify(company));
  } catch (e) {
    console.error('Error saving company info:', e);
  }
}

// Current Draft
export function getSavedDraft(): InvoiceData {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_DRAFT);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure at least 10 items
      if (parsed.items && parsed.items.length < 10) {
        while (parsed.items.length < 10) {
          parsed.items.push(createEmptyItem(parsed.items.length + 1));
        }
      }
      return parsed;
    }
  } catch (e) {
    console.error('Error reading draft:', e);
  }
  return SAMPLE_INVOICE;
}

export function saveDraft(invoice: InvoiceData): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_DRAFT, JSON.stringify(invoice));
  } catch (e) {
    console.error('Error saving draft:', e);
  }
}

// History
export function getInvoiceHistory(): InvoiceData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INVOICE_HISTORY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading invoice history:', e);
  }
  return [];
}

export function saveInvoiceToHistory(invoice: InvoiceData): void {
  try {
    const history = getInvoiceHistory();
    const existingIndex = history.findIndex((item) => item.id === invoice.id || (item.invoiceNo && item.invoiceNo === invoice.invoiceNo));
    if (existingIndex >= 0) {
      history[existingIndex] = { ...invoice, updatedAt: new Date().toISOString() };
    } else {
      history.unshift({ ...invoice, updatedAt: new Date().toISOString() });
    }
    // Limit to 100 recent invoices
    const trimmed = history.slice(0, 100);
    localStorage.setItem(STORAGE_KEYS.INVOICE_HISTORY, JSON.stringify(trimmed));

    // Also auto-save party to address book
    if (invoice.partyName.trim()) {
      savePartyFromInvoice(invoice);
    }
  } catch (e) {
    console.error('Error saving invoice to history:', e);
  }
}

export function deleteInvoiceFromHistory(id: string): void {
  try {
    const history = getInvoiceHistory();
    const updated = history.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.INVOICE_HISTORY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error deleting invoice from history:', e);
  }
}

// Saved Parties
export function getSavedParties(): SavedParty[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_PARTIES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading saved parties:', e);
  }
  return [
    {
      id: 'party-sri-sakthi',
      name: 'Sri Sakthi Traders',
      address: 'No.9/189, MANALMEDU, Near NSN COLLEGE, Karur, Karur, Tamil Nadu, 639003',
      gstin: '33QWZPS7297J1ZU',
      code: 'PARTY',
    },
  ];
}

export function savePartyFromInvoice(invoice: InvoiceData): void {
  try {
    if (!invoice.partyName.trim()) return;
    const parties = getSavedParties();
    const existingIndex = parties.findIndex(
      (p) => p.name.trim().toLowerCase() === invoice.partyName.trim().toLowerCase()
    );
    const updatedParty: SavedParty = {
      id: existingIndex >= 0 ? parties[existingIndex].id : `party-${Date.now()}`,
      name: invoice.partyName.trim(),
      address: invoice.partyAddress.trim(),
      gstin: invoice.partyGstin.trim(),
      code: invoice.partyCode.trim() || 'PARTY',
    };

    if (existingIndex >= 0) {
      parties[existingIndex] = updatedParty;
    } else {
      parties.unshift(updatedParty);
    }
    localStorage.setItem(STORAGE_KEYS.SAVED_PARTIES, JSON.stringify(parties.slice(0, 50)));
  } catch (e) {
    console.error('Error saving party:', e);
  }
}

/**
 * Recalculate all totals in an invoice
 */
export function recalculateInvoice(invoice: InvoiceData): InvoiceData {
  let totalBeforeTax = 0;
  let totalCgst = 0;
  let totalSgst = 0;
  let totalIgst = 0;

  const updatedItems = invoice.items.map((item, idx) => {
    const qty = typeof item.qty === 'string' ? parseFloat(item.qty) || 0 : item.qty;
    const rate = typeof item.rate === 'string' ? parseFloat(item.rate) || 0 : item.rate;

    const hasValue = item.particulars.trim() !== '' || qty > 0 || rate > 0;
    if (!hasValue) {
      return {
        ...item,
        sNo: idx + 1,
        taxableValue: 0,
        cgstAmount: 0,
        sgstAmount: 0,
        igstAmount: 0,
        total: 0,
      };
    }

    const taxableValue = Math.round((qty * rate + Number.EPSILON) * 100) / 100;
    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;

    if (invoice.taxType === 'intra') {
      const halfRate = invoice.defaultGstRate / 2;
      cgstAmount = Math.round(((taxableValue * halfRate) / 100 + Number.EPSILON) * 100) / 100;
      sgstAmount = Math.round(((taxableValue * halfRate) / 100 + Number.EPSILON) * 100) / 100;
    } else {
      igstAmount = Math.round(((taxableValue * invoice.defaultGstRate) / 100 + Number.EPSILON) * 100) / 100;
    }

    const total = taxableValue + cgstAmount + sgstAmount + igstAmount;

    totalBeforeTax += taxableValue;
    totalCgst += cgstAmount;
    totalSgst += sgstAmount;
    totalIgst += igstAmount;

    return {
      ...item,
      sNo: idx + 1,
      taxableValue,
      cgstRate: invoice.taxType === 'intra' ? invoice.defaultGstRate / 2 : 0,
      cgstAmount,
      sgstRate: invoice.taxType === 'intra' ? invoice.defaultGstRate / 2 : 0,
      sgstAmount,
      igstRate: invoice.taxType === 'inter' ? invoice.defaultGstRate : 0,
      igstAmount,
      total,
    };
  });

  const totalAfterTax = totalBeforeTax + totalCgst + totalSgst + totalIgst;
  const words = numberToIndianWords(totalAfterTax);

  return {
    ...invoice,
    items: updatedItems,
    totalBeforeTax,
    totalCgst,
    totalSgst,
    totalIgst,
    totalAfterTax,
    amountInWords: words,
    updatedAt: new Date().toISOString(),
  };
}
