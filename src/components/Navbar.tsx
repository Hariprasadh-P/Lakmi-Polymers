import React from 'react';
import { FileText, History, Settings, RefreshCw, Sparkles, Printer, Download } from 'lucide-react';

interface NavbarProps {
  activeTab: 'edit' | 'preview' | 'history' | 'settings';
  setActiveTab: (tab: 'edit' | 'preview' | 'history' | 'settings') => void;
  onQuickSample: () => void;
  onNewInvoice: () => void;
  onDownload: () => void;
  onPrint: () => void;
  isGeneratingPdf: boolean;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onQuickSample,
  onNewInvoice,
  onDownload,
  onPrint,
  isGeneratingPdf,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Company Title */}
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-lg bg-red-700 flex items-center justify-center text-white font-bold shadow-xs">
              <span className="font-serif text-lg">LP</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-red-700 text-base sm:text-lg tracking-wide uppercase font-serif">
                  LEO PLASTICS
                </span>
                <span className="bg-red-50 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-red-200 hidden sm:inline-block">
                  INVOICE GENERATOR
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium hidden sm:block">
                Tax Invoice & Accounting Receipt System
              </p>
            </div>
          </div>

          {/* Desktop/Tablet Navigation Tabs */}
          <div className="hidden md:flex items-center space-x-1 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('edit')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 ${
                activeTab === 'edit'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 ${
                activeTab === 'preview'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>PDF Preview</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 ${
                activeTab === 'history'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Saved Receipts</span>
              {historyCount > 0 && (
                <span className="ml-1 bg-gray-200 text-gray-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {historyCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 ${
                activeTab === 'settings'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Company Profile</span>
            </button>
          </div>

          {/* Top Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onQuickSample}
              title="Fill Sample PDF Template Data"
              className="text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded-lg transition-colors flex items-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Sample Data</span>
            </button>

            <button
              onClick={onNewInvoice}
              title="Clear & New Invoice"
              className="text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 p-2 sm:px-2.5 sm:py-1.5 rounded-lg transition-colors flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New</span>
            </button>

            <button
              onClick={onPrint}
              title="Print Invoice"
              className="hidden lg:flex items-center space-x-1 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={onDownload}
              disabled={isGeneratingPdf}
              className="text-xs font-bold text-white bg-red-700 hover:bg-red-800 disabled:bg-red-400 px-3 py-1.5 rounded-lg transition-all shadow-xs flex items-center space-x-1.5"
            >
              {isGeneratingPdf ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{isGeneratingPdf ? 'Generating...' : 'Download PDF'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs (visible only on small screens) */}
        <div className="flex md:hidden border-t border-gray-100 py-1.5 justify-around bg-white">
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex-1 py-1.5 text-xs font-semibold text-center rounded-md flex items-center justify-center space-x-1 ${
              activeTab === 'edit' ? 'text-red-700 bg-red-50' : 'text-gray-600'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Edit Form</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-1.5 text-xs font-semibold text-center rounded-md flex items-center justify-center space-x-1 ${
              activeTab === 'preview' ? 'text-red-700 bg-red-50' : 'text-gray-600'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Receipt PDF</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-1.5 text-xs font-semibold text-center rounded-md flex items-center justify-center space-x-1 ${
              activeTab === 'history' ? 'text-red-700 bg-red-50' : 'text-gray-600'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>History ({historyCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-1.5 text-xs font-semibold text-center rounded-md flex items-center justify-center space-x-1 ${
              activeTab === 'settings' ? 'text-red-700 bg-red-50' : 'text-gray-600'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>
        </div>
      </div>
    </header>
  );
};
