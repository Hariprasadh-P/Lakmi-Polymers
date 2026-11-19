import React, { useState } from 'react';
import type {
  InvoiceData,
  LineItem,
  SavedParty,
} from '../types/invoice';
import {
  Plus,
  Trash2,
  Building,
  FileSpreadsheet,
  Truck,
  Percent,
  CheckCircle2,
  CreditCard,
  UserCheck,
} from 'lucide-react';
import { formatIndianCurrency } from '../utils/numberToWords';

interface InvoiceFormProps {
  invoice: InvoiceData;
  onChange: (updated: InvoiceData) => void;
  savedParties: SavedParty[];
  onSelectParty: (party: SavedParty) => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoice,
  onChange,
  savedParties,
  onSelectParty,
}) => {
  const [showPartyDropdown, setShowPartyDropdown] = useState(false);

  // Common quick items for plastic industry
  const commonParticulars = [
    'Waste Plastic Scrap',
    'HDPE Plastic Scrap',
    'PP Plastic Scrap',
    'LDPE Plastic Scrap',
    'PET Bottle Scrap',
    'Plastic Granules / Dana',
    'PVC Regrind Scrap',
  ];

  const handleFieldChange = (field: keyof InvoiceData, value: unknown) => {
    onChange({
      ...invoice,
      [field]: value,
    });
  };

  const handleItemChange = (index: number, field: keyof LineItem, value: unknown) => {
    const newItems = [...invoice.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    onChange({
      ...invoice,
      items: newItems,
    });
  };

  const handleClearItem = (index: number) => {
    const newItems = [...invoice.items];
    newItems[index] = {
      id: `item-${index + 1}-${Date.now()}`,
      sNo: index + 1,
      particulars: '',
      sacHsn: '',
      qty: '',
      rate: '',
      taxableValue: 0,
      cgstRate: invoice.taxType === 'intra' ? invoice.defaultGstRate / 2 : 0,
      cgstAmount: 0,
      sgstRate: invoice.taxType === 'intra' ? invoice.defaultGstRate / 2 : 0,
      sgstAmount: 0,
      igstRate: invoice.taxType === 'inter' ? invoice.defaultGstRate : 0,
      igstAmount: 0,
      total: 0,
    };
    onChange({
      ...invoice,
      items: newItems,
    });
  };

  const handleAddRow = () => {
    // Find the first empty item
    const firstEmptyIndex = invoice.items.findIndex(
      (item) => !item.particulars && !item.qty && !item.rate
    );
    if (firstEmptyIndex !== -1) {
      handleItemChange(firstEmptyIndex, 'particulars', 'Waste Plastic Scrap');
    }
  };

  // Find active items (items that have data or first item)
  const activeCount = Math.max(
    1,
    invoice.items.filter((item) => item.particulars.trim() !== '' || item.qty || item.rate).length
  );

  return (
    <div className="space-y-4 pb-24 md:pb-6">
      
      {/* SECTION 1: INVOICE & BUYER DETAILS */}
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-xs border border-gray-200">
        <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-gray-100">
          <FileSpreadsheet className="w-4 h-4 text-red-700" />
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            1. Invoice & Buyer Information
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-4">
          {/* Invoice No */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Invoice No <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={invoice.invoiceNo}
              onChange={(e) => handleFieldChange('invoiceNo', e.target.value)}
              placeholder="e.g. 002/2026-27"
              className="w-full text-xs font-medium px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-white"
            />
          </div>

          {/* Invoice Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Invoice Date <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={invoice.invoiceDate}
              onChange={(e) => handleFieldChange('invoiceDate', e.target.value)}
              placeholder="DD/MM/YYYY (e.g. 28/10/2026)"
              className="w-full text-xs font-medium px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-white"
            />
          </div>

          {/* Copy Type */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Receipt Copy Type
            </label>
            <select
              value={invoice.copyType}
              onChange={(e) => handleFieldChange('copyType', e.target.value)}
              className="w-full text-xs font-medium px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-white"
            >
              <option value="Original for Receipent">Original for Receipent</option>
              <option value="Duplicate for Transporter">Duplicate for Transporter</option>
              <option value="Triplicate for Supplier">Triplicate for Supplier</option>
              <option value="Extra Copy">Extra Copy</option>
            </select>
          </div>
        </div>

        {/* BUYER / PARTY SECTION */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-800 flex items-center space-x-1.5">
              <Building className="w-3.5 h-3.5 text-gray-500" />
              <span>Buyer (Billed To)</span>
            </span>

            {/* Quick Pick from Saved Parties */}
            {savedParties.length > 0 && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPartyDropdown(!showPartyDropdown)}
                  className="text-[11px] font-semibold text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded flex items-center space-x-1"
                >
                  <UserCheck className="w-3 h-3" />
                  <span>Choose Saved Buyer</span>
                </button>

                {showPartyDropdown && (
                  <div className="absolute right-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                    <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                      Recent Parties
                    </div>
                    {savedParties.map((party) => (
                      <button
                        key={party.id}
                        type="button"
                        onClick={() => {
                          onSelectParty(party);
                          setShowPartyDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 text-xs transition-colors border-b border-gray-50 last:border-none"
                      >
                        <div className="font-bold text-gray-900">{party.name}</div>
                        <div className="text-[10px] text-gray-500 truncate">{party.address}</div>
                        <div className="text-[10px] text-gray-400 font-mono">GST: {party.gstin}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Party / Buyer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={invoice.partyName}
                onChange={(e) => handleFieldChange('partyName', e.target.value)}
                placeholder="e.g. Sri Sakthi Traders"
                className="w-full text-xs font-medium px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Buyer GSTIN
              </label>
              <input
                type="text"
                value={invoice.partyGstin}
                onChange={(e) => handleFieldChange('partyGstin', e.target.value.toUpperCase())}
                placeholder="e.g. 33QWZPS7297J1ZU"
                className="w-full text-xs font-mono font-medium px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-white uppercase"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Buyer Address
              </label>
              <textarea
                rows={2}
                value={invoice.partyAddress}
                onChange={(e) => handleFieldChange('partyAddress', e.target.value)}
                placeholder="e.g. No.9/189, MANALMEDU, Near NSN COLLEGE, Karur, Karur, Tamil Nadu, 639003"
                className="w-full text-xs font-medium px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Party Code
              </label>
              <input
                type="text"
                value={invoice.partyCode}
                onChange={(e) => handleFieldChange('partyCode', e.target.value)}
                placeholder="PARTY"
                className="w-full text-xs font-medium px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Vehicle No.
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={invoice.vehicleNo}
                  onChange={(e) => handleFieldChange('vehicleNo', e.target.value.toUpperCase())}
                  placeholder="e.g. TN02BF3595"
                  className="w-full text-xs font-mono font-medium px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-white uppercase"
                />
                <Truck className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-2.5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: TAX RATE CONFIGURATION */}
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-xs border border-gray-200">
        <div className="flex items-center space-x-2 pb-2 mb-3 border-b border-gray-100">
          <Percent className="w-4 h-4 text-red-700" />
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            2. GST Tax Settings
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Tax Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleFieldChange('taxType', 'intra')}
                className={`py-2 px-3 text-xs font-bold rounded-lg border flex items-center justify-center space-x-1.5 transition-all ${
                  invoice.taxType === 'intra'
                    ? 'bg-red-50 border-red-600 text-red-800'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {invoice.taxType === 'intra' && <CheckCircle2 className="w-3.5 h-3.5 text-red-700" />}
                <span>Intra-State (CGST + SGST)</span>
              </button>

              <button
                type="button"
                onClick={() => handleFieldChange('taxType', 'inter')}
                className={`py-2 px-3 text-xs font-bold rounded-lg border flex items-center justify-center space-x-1.5 transition-all ${
                  invoice.taxType === 'inter'
                    ? 'bg-red-50 border-red-600 text-red-800'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {invoice.taxType === 'inter' && <CheckCircle2 className="w-3.5 h-3.5 text-red-700" />}
                <span>Inter-State (IGST)</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              GST Rate Preset
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[18, 12, 5, 28, 0].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => handleFieldChange('defaultGstRate', rate)}
                  className={`py-1.5 px-3 text-xs font-bold rounded-lg border transition-all ${
                    invoice.defaultGstRate === rate
                      ? 'bg-red-700 border-red-700 text-white shadow-xs'
                      : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {rate}% {rate === 18 ? '(9% + 9%)' : ''}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-500 mt-1">
              Current: {invoice.taxType === 'intra' ? `CGST: ${invoice.defaultGstRate / 2}% | SGST: ${invoice.defaultGstRate / 2}%` : `IGST: ${invoice.defaultGstRate}%`}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: LINE ITEMS (MOBILE FRIENDLY CARDS) */}
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-xs border border-gray-200">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <span className="w-5 h-5 rounded-full bg-red-100 text-red-800 text-xs font-black flex items-center justify-center">
              3
            </span>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
              Line Items ({activeCount}/10 Rows)
            </h2>
          </div>
          <span className="text-[11px] text-gray-500 font-medium hidden sm:inline">
            Matches the 10 rows on the Leo Plastics receipt
          </span>
        </div>

        {/* Items List */}
        <div className="space-y-3.5">
          {invoice.items.slice(0, Math.min(10, Math.max(activeCount + 1, 3))).map((item, index) => {
            const hasData = item.particulars || item.qty || item.rate;

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  hasData
                    ? 'bg-gray-50/70 border-gray-200'
                    : 'bg-white border-dashed border-gray-300'
                }`}
              >
                {/* Item Card Header */}
                <div className="flex items-center justify-between mb-2.5">
                  <span className="inline-flex items-center space-x-1.5">
                    <span className="w-5 h-5 rounded-md bg-gray-200 text-gray-700 text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold text-gray-800">
                      Row #{index + 1}
                    </span>
                  </span>

                  {hasData && (
                    <button
                      type="button"
                      onClick={() => handleClearItem(index)}
                      className="text-gray-400 hover:text-red-600 p-1 text-xs transition-colors flex items-center space-x-1"
                      title="Clear this row"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Clear</span>
                    </button>
                  )}
                </div>

                {/* Input Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  {/* Particulars (Description) */}
                  <div className="sm:col-span-5">
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Particulars (Item Description)
                    </label>
                    <input
                      type="text"
                      value={item.particulars}
                      onChange={(e) => handleItemChange(index, 'particulars', e.target.value)}
                      placeholder="e.g. Waste Plastic Scrap"
                      className="w-full text-xs font-medium px-2.5 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 bg-white"
                      list={`particulars-suggestions-${index}`}
                    />
                    <datalist id={`particulars-suggestions-${index}`}>
                      {commonParticulars.map((desc) => (
                        <option key={desc} value={desc} />
                      ))}
                    </datalist>
                  </div>

                  {/* SAC/HSN */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      SAC/HSN
                    </label>
                    <input
                      type="text"
                      value={item.sacHsn}
                      onChange={(e) => handleItemChange(index, 'sacHsn', e.target.value)}
                      placeholder="e.g. 3915"
                      className="w-full text-xs font-mono font-medium px-2.5 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 bg-white"
                    />
                  </div>

                  {/* Qty */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Qty
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={item.qty}
                      onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                      placeholder="e.g. 9000"
                      className="w-full text-xs font-bold px-2.5 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 bg-white"
                    />
                  </div>

                  {/* Rate/Nos */}
                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Rate/Nos (₹)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={item.rate}
                      onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                      placeholder="e.g. 15.00"
                      className="w-full text-xs font-bold px-2.5 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 bg-white"
                    />
                  </div>
                </div>

                {/* Calculation Sub-bar on Card */}
                {hasData && (
                  <div className="mt-2.5 pt-2 border-t border-gray-200/80 flex flex-wrap items-center justify-between text-[11px] text-gray-600 bg-white px-2 py-1 rounded-md">
                    <span>
                      Taxable Value: <strong className="text-gray-900 font-bold">₹{formatIndianCurrency(item.taxableValue)}</strong>
                    </span>
                    {invoice.taxType === 'intra' ? (
                      <span>
                        CGST ({item.cgstRate}%): <strong className="text-gray-900">₹{formatIndianCurrency(item.cgstAmount)}</strong> | SGST ({item.sgstRate}%): <strong className="text-gray-900">₹{formatIndianCurrency(item.sgstAmount)}</strong>
                      </span>
                    ) : (
                      <span>
                        IGST ({item.igstRate}%): <strong className="text-gray-900">₹{formatIndianCurrency(item.igstAmount)}</strong>
                      </span>
                    )}
                    <span className="font-bold text-red-700">
                      Row Total: ₹{formatIndianCurrency(item.total)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Row Button */}
        {activeCount < 10 && (
          <button
            type="button"
            onClick={handleAddRow}
            className="mt-3.5 w-full py-2 border-2 border-dashed border-gray-300 hover:border-red-600 text-gray-600 hover:text-red-700 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all bg-gray-50/50 hover:bg-red-50/30"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item (Row #{activeCount + 1})</span>
          </button>
        )}
      </div>

      {/* SECTION 4: BANK DETAILS (OPTIONAL) */}
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-xs border border-gray-200">
        <div className="flex items-center space-x-2 pb-2 mb-3 border-b border-gray-100">
          <CreditCard className="w-4 h-4 text-red-700" />
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            4. Bank Account Details (Lower Left Box)
          </h2>
        </div>

        <p className="text-[11px] text-gray-500 mb-3">
          These details appear in the bank details table at the bottom-left of the invoice (optional).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Bank Name
            </label>
            <input
              type="text"
              value={invoice.company.bankName || ''}
              onChange={(e) =>
                handleFieldChange('company', {
                  ...invoice.company,
                  bankName: e.target.value,
                })
              }
              placeholder="e.g. State Bank of India / HDFC"
              className="w-full text-xs font-medium px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Account Number
            </label>
            <input
              type="text"
              value={invoice.company.accountNo || ''}
              onChange={(e) =>
                handleFieldChange('company', {
                  ...invoice.company,
                  accountNo: e.target.value,
                })
              }
              placeholder="e.g. 123456789012"
              className="w-full text-xs font-mono font-medium px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              IFSC Code
            </label>
            <input
              type="text"
              value={invoice.company.ifscCode || ''}
              onChange={(e) =>
                handleFieldChange('company', {
                  ...invoice.company,
                  ifscCode: e.target.value.toUpperCase(),
                })
              }
              placeholder="e.g. SBIN0001234"
              className="w-full text-xs font-mono font-medium px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 bg-white uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Branch
            </label>
            <input
              type="text"
              value={invoice.company.branch || ''}
              onChange={(e) =>
                handleFieldChange('company', {
                  ...invoice.company,
                  branch: e.target.value,
                })
              }
              placeholder="e.g. Thirumudivakkam, Chennai"
              className="w-full text-xs font-medium px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 bg-white"
            />
          </div>
        </div>
      </div>

      {/* SECTION 5: LIVE TOTAL SUMMARY CARD */}
      <div className="bg-gradient-to-br from-red-800 to-red-950 text-white rounded-xl p-4 sm:p-5 shadow-md">
        <h3 className="text-xs font-bold uppercase tracking-wider text-red-200 mb-3">
          Accounting Summary
        </h3>

        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between py-1 border-b border-red-700/60">
            <span className="text-red-100">Total Amount before Tax:</span>
            <span className="font-bold text-sm">₹{formatIndianCurrency(invoice.totalBeforeTax)}</span>
          </div>

          {invoice.taxType === 'intra' ? (
            <>
              <div className="flex justify-between py-0.5">
                <span className="text-red-200">Add: CGST ({invoice.defaultGstRate / 2}%):</span>
                <span className="font-semibold">₹{formatIndianCurrency(invoice.totalCgst)}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-red-700/60 pb-1.5">
                <span className="text-red-200">Add: SGST ({invoice.defaultGstRate / 2}%):</span>
                <span className="font-semibold">₹{formatIndianCurrency(invoice.totalSgst)}</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between py-1 border-b border-red-700/60">
              <span className="text-red-200">IGST ({invoice.defaultGstRate}%):</span>
              <span className="font-semibold">₹{formatIndianCurrency(invoice.totalIgst)}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-2 text-base font-black">
            <span>Total Amount after Tax:</span>
            <span className="text-xl text-amber-300 font-serif">
              ₹{formatIndianCurrency(invoice.totalAfterTax)}
            </span>
          </div>

          {/* Amount In Words Display */}
          <div className="mt-2.5 pt-2 border-t border-red-700/50">
            <span className="text-[10px] text-red-300 uppercase block font-semibold">
              Amount In Words (Indian Rupees):
            </span>
            <span className="text-xs font-bold text-white tracking-wide leading-snug">
              {invoice.amountInWords}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
