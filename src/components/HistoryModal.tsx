import React, { useState } from 'react';
import type { InvoiceData, SavedParty } from '../types/invoice';
import {
  History,
  Search,
  Download,
  Trash2,
  ExternalLink,
  Users,
  Calendar,
  FileDown,
  Upload,
} from 'lucide-react';
import { formatIndianCurrency } from '../utils/numberToWords';

interface HistoryModalProps {
  history: InvoiceData[];
  savedParties: SavedParty[];
  onLoadInvoice: (invoice: InvoiceData) => void;
  onDeleteInvoice: (id: string) => void;
  onSelectParty: (party: SavedParty) => void;
  onDownloadInvoicePdf: (invoice: InvoiceData) => void;
  onImportData: (data: { history?: InvoiceData[]; parties?: SavedParty[] }) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  history,
  savedParties,
  onLoadInvoice,
  onDeleteInvoice,
  onSelectParty,
  onDownloadInvoicePdf,
  onImportData,
}) => {
  const [subTab, setSubTab] = useState<'invoices' | 'parties'>('invoices');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = history.filter((inv) => {
    const q = searchQuery.toLowerCase();
    return (
      (inv.invoiceNo && inv.invoiceNo.toLowerCase().includes(q)) ||
      (inv.partyName && inv.partyName.toLowerCase().includes(q)) ||
      (inv.vehicleNo && inv.vehicleNo.toLowerCase().includes(q))
    );
  });

  const filteredParties = savedParties.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.gstin.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q)
    );
  });

  const handleExportBackup = () => {
    const backup = {
      history,
      savedParties,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leo_plastics_invoices_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        onImportData(parsed);
        alert('Data backup imported successfully!');
      } catch (err) {
        alert('Failed to parse backup JSON file: ' + err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 sm:p-6 pb-24 md:pb-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-gray-200 gap-3">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center space-x-2">
            <History className="w-5 h-5 text-red-700" />
            <span>Local Storage & Saved Receipts</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Your receipts and customers are securely stored locally on this phone/browser.
          </p>
        </div>

        {/* Export / Import Backup */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleExportBackup}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center space-x-1"
          >
            <FileDown className="w-3.5 h-3.5 text-gray-500" />
            <span>Backup Data</span>
          </button>

          <label className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center space-x-1 cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-gray-500" />
            <span>Restore</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Sub Tabs: Invoices vs Parties */}
      <div className="flex space-x-2 border-b border-gray-200 pb-3 mb-4">
        <button
          onClick={() => setSubTab('invoices')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center space-x-1.5 ${
            subTab === 'invoices'
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Saved Receipts ({history.length})</span>
        </button>

        <button
          onClick={() => setSubTab('parties')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center space-x-1.5 ${
            subTab === 'parties'
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Customer Directory ({savedParties.length})</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            subTab === 'invoices'
              ? 'Search by invoice #, buyer name, vehicle no...'
              : 'Search customers by name, GSTIN, address...'
          }
          className="w-full text-xs pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 bg-white"
        />
      </div>

      {/* INVOICES LIST */}
      {subTab === 'invoices' && (
        <div className="space-y-3">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-semibold">No saved receipts found</p>
              <p className="text-[11px] text-gray-400 mt-1">
                Receipts you generate or download will automatically appear here.
              </p>
            </div>
          ) : (
            filteredHistory.map((inv) => (
              <div
                key={inv.id}
                className="p-3.5 sm:p-4 rounded-xl border border-gray-200 hover:border-gray-300 bg-white shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-900 text-xs sm:text-sm">
                      #{inv.invoiceNo || 'Draft'}
                    </span>
                    <span className="bg-red-50 text-red-700 text-[10px] font-bold px-1.5 py-0.2 rounded border border-red-200">
                      {inv.copyType || 'Original'}
                    </span>
                    <span className="text-gray-400 text-xs flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{inv.invoiceDate}</span>
                    </span>
                  </div>

                  <div className="font-semibold text-xs text-gray-700 mt-1">
                    {inv.partyName || 'Untitled Customer'}
                  </div>

                  <div className="text-[11px] text-gray-500 flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                    {inv.partyGstin && <span>GSTIN: {inv.partyGstin}</span>}
                    {inv.vehicleNo && <span>Vehicle: {inv.vehicleNo}</span>}
                    <span>
                      Items: {inv.items.filter((i) => i.particulars).length}
                    </span>
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className="flex items-center justify-between sm:justify-end space-x-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] text-gray-400 uppercase font-semibold">Total Amount</div>
                    <div className="text-sm sm:text-base font-black text-red-700 font-serif">
                      ₹{formatIndianCurrency(inv.totalAfterTax)}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => onLoadInvoice(inv)}
                      className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors flex items-center space-x-1"
                      title="Load this invoice in editor"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Load</span>
                    </button>

                    <button
                      onClick={() => onDownloadInvoicePdf(inv)}
                      className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors flex items-center space-x-1"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">PDF</span>
                    </button>

                    <button
                      onClick={() => onDeleteInvoice(inv.id)}
                      className="p-1.5 text-xs text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                      title="Delete from history"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* PARTIES DIRECTORY */}
      {subTab === 'parties' && (
        <div className="space-y-2.5">
          {filteredParties.length === 0 ? (
            <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-semibold">No customers saved yet</p>
            </div>
          ) : (
            filteredParties.map((party) => (
              <div
                key={party.id}
                className="p-3 rounded-xl border border-gray-200 hover:border-gray-300 bg-white flex items-center justify-between gap-3"
              >
                <div>
                  <div className="font-bold text-xs text-gray-900">{party.name}</div>
                  <div className="text-[11px] text-gray-500 line-clamp-1">{party.address}</div>
                  <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                    GSTIN: {party.gstin || 'Unregistered'} | Code: {party.code}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectParty(party)}
                  className="px-2.5 py-1 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg shrink-0"
                >
                  Apply to Invoice
                </button>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};
