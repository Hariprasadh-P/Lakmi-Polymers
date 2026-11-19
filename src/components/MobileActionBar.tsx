import React from 'react';
import { Download, Eye, Printer, Share2 } from 'lucide-react';
import { formatIndianCurrency } from '../utils/numberToWords';

interface MobileActionBarProps {
  totalAmount: number;
  onDownload: () => void;
  onPrint: () => void;
  onTogglePreview: () => void;
  onShare?: () => void;
  isPreviewActive: boolean;
  isGeneratingPdf: boolean;
}

export const MobileActionBar: React.FC<MobileActionBarProps> = ({
  totalAmount,
  onDownload,
  onPrint,
  onTogglePreview,
  onShare,
  isPreviewActive,
  isGeneratingPdf,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-3 py-2.5 shadow-lg md:hidden">
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
        
        {/* Left: Total Amount */}
        <div className="shrink-0">
          <div className="text-[10px] text-gray-500 font-semibold uppercase leading-none">
            Total Amount
          </div>
          <div className="text-base font-black text-red-700 font-serif leading-tight">
            ₹{formatIndianCurrency(totalAmount)}
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center space-x-1.5 shrink-0">
          {/* Preview Toggle */}
          <button
            type="button"
            onClick={onTogglePreview}
            className={`p-2 rounded-lg border text-xs font-semibold transition-colors ${
              isPreviewActive
                ? 'bg-red-50 border-red-300 text-red-700'
                : 'bg-gray-100 border-gray-200 text-gray-700'
            }`}
            title="Preview Receipt"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Print */}
          <button
            type="button"
            onClick={onPrint}
            className="p-2 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200 text-xs font-semibold transition-colors"
            title="Print Receipt"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Share (if provided) */}
          {onShare && (
            <button
              type="button"
              onClick={onShare}
              className="p-2 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200 text-xs font-semibold transition-colors"
              title="Share Receipt"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}

          {/* Main Download PDF Button */}
          <button
            type="button"
            onClick={onDownload}
            disabled={isGeneratingPdf}
            className="px-3.5 py-2 bg-red-700 hover:bg-red-800 disabled:bg-red-400 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5"
          >
            {isGeneratingPdf ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isGeneratingPdf ? 'Saving...' : 'PDF'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
