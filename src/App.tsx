import { useState, useEffect } from 'react';
import type { InvoiceData, CompanyInfo, SavedParty } from './types/invoice';
import {
  getSavedDraft,
  saveDraft,
  getSavedCompany,
  saveCompanyInfo,
  getInvoiceHistory,
  saveInvoiceToHistory,
  deleteInvoiceFromHistory,
  getSavedParties,
  recalculateInvoice,
  SAMPLE_INVOICE,
  createNewBlankInvoice,
} from './utils/storage';
import { generateAndDownloadPdf, printInvoice, shareInvoicePdf } from './utils/pdfGenerator';
import { Navbar } from './components/Navbar';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoiceTemplate } from './components/InvoiceTemplate';
import { HistoryModal } from './components/HistoryModal';
import { CompanySettingsModal } from './components/CompanySettingsModal';
import { MobileActionBar } from './components/MobileActionBar';
import { Download, Printer, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export function App() {
  const [invoice, setInvoice] = useState<InvoiceData>(() => recalculateInvoice(getSavedDraft()));
  const [company, setCompany] = useState<CompanyInfo>(() => getSavedCompany());
  const [history, setHistory] = useState<InvoiceData[]>(() => getInvoiceHistory());
  const [savedParties, setSavedParties] = useState<SavedParty[]>(() => getSavedParties());
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'history' | 'settings'>('edit');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(1);

  // Auto-save draft on every change
  useEffect(() => {
    saveDraft(invoice);
  }, [invoice]);

  // Recalculate invoice when fields change
  const handleInvoiceChange = (updated: InvoiceData) => {
    const recalculated = recalculateInvoice(updated);
    setInvoice(recalculated);
  };

  // Quick load sample data matching user's PDF
  const handleQuickSample = () => {
    const sample = recalculateInvoice(SAMPLE_INVOICE);
    setInvoice(sample);
  };

  // Create new blank invoice
  const handleNewInvoice = () => {
    if (confirm('Start a new invoice? Make sure your current receipt is downloaded or saved in history.')) {
      const blank = recalculateInvoice(createNewBlankInvoice());
      setInvoice(blank);
      setActiveTab('edit');
    }
  };

  // Download PDF
  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      
      // Auto-save into history so record is never lost
      saveInvoiceToHistory(invoice);
      setHistory(getInvoiceHistory());
      setSavedParties(getSavedParties());

      // Format safe file name e.g. "Leo_Plastics_Invoice_002_2026-27.pdf"
      const safeNo = (invoice.invoiceNo || 'Draft').replace(/[/\\?%*:|"<>]/g, '_');
      const fileName = `Leo_Plastics_Invoice_${safeNo}.pdf`;

      await generateAndDownloadPdf('invoice-print-container', fileName);
    } catch (err) {
      console.error('PDF download error:', err);
      alert('Failed to generate PDF: ' + err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Native Print
  const handlePrint = () => {
    saveInvoiceToHistory(invoice);
    setHistory(getInvoiceHistory());
    setSavedParties(getSavedParties());
    printInvoice();
  };

  // Share via Web Share
  const handleShare = async () => {
    try {
      const safeNo = (invoice.invoiceNo || 'Draft').replace(/[/\\?%*:|"<>]/g, '_');
      const fileName = `Leo_Plastics_Invoice_${safeNo}`;
      const shared = await shareInvoicePdf('invoice-print-container', fileName);
      if (!shared) {
        // Fallback: download PDF
        handleDownloadPdf();
      }
    } catch (err) {
      console.error('Share error:', err);
    }
  };

  // Load an invoice from history
  const handleLoadInvoice = (inv: InvoiceData) => {
    setInvoice(recalculateInvoice(inv));
    setActiveTab('edit');
  };

  // Delete invoice from history
  const handleDeleteInvoice = (id: string) => {
    if (confirm('Delete this invoice from saved history?')) {
      deleteInvoiceFromHistory(id);
      setHistory(getInvoiceHistory());
    }
  };

  // Apply a saved party to current invoice
  const handleSelectParty = (party: SavedParty) => {
    setInvoice((prev) =>
      recalculateInvoice({
        ...prev,
        partyName: party.name,
        partyAddress: party.address,
        partyGstin: party.gstin,
        partyCode: party.code || 'PARTY',
      })
    );
  };

  // Save company settings
  const handleSaveCompany = (updatedCompany: CompanyInfo) => {
    saveCompanyInfo(updatedCompany);
    setCompany(updatedCompany);
    setInvoice((prev) =>
      recalculateInvoice({
        ...prev,
        company: updatedCompany,
      })
    );
  };

  // Import JSON backup
  const handleImportData = (data: { history?: InvoiceData[]; parties?: SavedParty[] }) => {
    if (data.history && Array.isArray(data.history)) {
      localStorage.setItem('leo_plastics_invoice_history', JSON.stringify(data.history));
      setHistory(data.history);
    }
    if (data.parties && Array.isArray(data.parties)) {
      localStorage.setItem('leo_plastics_saved_parties', JSON.stringify(data.parties));
      setSavedParties(data.parties);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans text-gray-900">
      
      {/* Top Navbar */}
      <div className="no-print">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onQuickSample={handleQuickSample}
          onNewInvoice={handleNewInvoice}
          onDownload={handleDownloadPdf}
          onPrint={handlePrint}
          isGeneratingPdf={isGeneratingPdf}
          historyCount={history.length}
        />
      </div>

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6 no-print">
        
        {/* VIEW 1: FORM & DESKTOP SPLIT VIEW */}
        {activeTab === 'edit' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Form Editor Column */}
            <div className="lg:col-span-7">
              <InvoiceForm
                invoice={invoice}
                onChange={handleInvoiceChange}
                savedParties={savedParties}
                onSelectParty={handleSelectParty}
              />
            </div>

            {/* Desktop Live Preview Column */}
            <div className="hidden lg:block lg:col-span-5 sticky top-20">
              <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                      Live Receipt Preview
                    </span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setPreviewZoom((z) => Math.max(0.6, z - 0.1))}
                      className="p-1 text-gray-500 hover:text-gray-900 rounded"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] font-mono text-gray-500">
                      {Math.round(previewZoom * 100)}%
                    </span>
                    <button
                      onClick={() => setPreviewZoom((z) => Math.min(1.2, z + 0.1))}
                      className="p-1 text-gray-500 hover:text-gray-900 rounded"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setPreviewZoom(1)}
                      className="p-1 text-gray-500 hover:text-gray-900 rounded"
                      title="Reset Zoom"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Scaled Preview Box */}
                <div className="overflow-x-auto overflow-y-auto max-h-[75vh] border border-gray-200 rounded-lg p-2 bg-gray-50 flex justify-center">
                  <div
                    style={{
                      transform: `scale(${previewZoom * 0.62})`,
                      transformOrigin: 'top center',
                      width: '794px',
                      marginBottom: `${(previewZoom * 0.62 - 1) * 1120}px`,
                    }}
                    className="shadow-md bg-white shrink-0"
                  >
                    <InvoiceTemplate invoice={invoice} id="invoice-preview-desktop" />
                  </div>
                </div>

                {/* Quick Action Buttons on Desktop Preview */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-red-700">
                    Exact 1:1 Print Ready Template
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="px-2.5 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center space-x-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadPdf}
                      disabled={isGeneratingPdf}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-red-700 hover:bg-red-800 rounded-lg flex items-center space-x-1 shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: FULLSCREEN / MOBILE PDF PREVIEW TAB */}
        {activeTab === 'preview' && (
          <div className="space-y-4 pb-24 md:pb-6">
            <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                  Receipt Document Preview
                </h2>
                <p className="text-xs text-gray-500">
                  This is the exact layout that prints and downloads as a PDF.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrint}
                  className="px-3 py-2 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors flex items-center space-x-1"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>

                <button
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="px-4 py-2 text-xs font-bold bg-red-700 hover:bg-red-800 disabled:bg-red-400 text-white rounded-lg transition-all shadow-xs flex items-center space-x-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
                </button>
              </div>
            </div>

            {/* Mobile / Responsive Preview Frame */}
            <div className="w-full overflow-x-auto bg-gray-200/80 p-2 sm:p-6 rounded-xl border border-gray-300 flex justify-center">
              <div className="bg-white shadow-xl rounded-sm">
                <InvoiceTemplate invoice={invoice} id="invoice-preview-full" />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: SAVED RECEIPTS & HISTORY TAB */}
        {activeTab === 'history' && (
          <HistoryModal
            history={history}
            savedParties={savedParties}
            onLoadInvoice={handleLoadInvoice}
            onDeleteInvoice={handleDeleteInvoice}
            onSelectParty={(party) => {
              handleSelectParty(party);
              setActiveTab('edit');
            }}
            onDownloadInvoicePdf={(inv) => {
              setInvoice(recalculateInvoice(inv));
              setTimeout(() => {
                handleDownloadPdf();
              }, 100);
            }}
            onImportData={handleImportData}
          />
        )}

        {/* VIEW 4: COMPANY PROFILE TAB */}
        {activeTab === 'settings' && (
          <CompanySettingsModal
            company={company}
            onSave={handleSaveCompany}
          />
        )}

      </main>

      {/* DEDICATED INVOICE CONTAINER FOR PDF GENERATION & BROWSER PRINT */}
      <div
        id="invoice-capture-wrapper"
        className="print:block"
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: '794px',
          backgroundColor: '#ffffff',
          zIndex: -50,
          pointerEvents: 'none',
        }}
      >
        <InvoiceTemplate invoice={invoice} id="invoice-print-container" />
      </div>

      {/* MOBILE STICKY ACTION BAR */}
      <MobileActionBar
        totalAmount={invoice.totalAfterTax}
        onDownload={handleDownloadPdf}
        onPrint={handlePrint}
        onTogglePreview={() => setActiveTab(activeTab === 'preview' ? 'edit' : 'preview')}
        onShare={handleShare}
        isPreviewActive={activeTab === 'preview'}
        isGeneratingPdf={isGeneratingPdf}
      />

    </div>
  );
}

export default App;
