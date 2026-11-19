import React, { useState } from 'react';
import type { CompanyInfo } from '../types/invoice';
import { Building2, Save, RefreshCw } from 'lucide-react';
import { DEFAULT_COMPANY } from '../utils/storage';

interface CompanySettingsProps {
  company: CompanyInfo;
  onSave: (company: CompanyInfo) => void;
}

export const CompanySettingsModal: React.FC<CompanySettingsProps> = ({
  company,
  onSave,
}) => {
  const [formData, setFormData] = useState<CompanyInfo>({ ...company });
  const [savedAlert, setSavedAlert] = useState(false);

  const handleChange = (field: keyof CompanyInfo, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleResetDefaults = () => {
    if (confirm('Reset company details back to official Leo Plastics defaults?')) {
      setFormData({ ...DEFAULT_COMPANY });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 sm:p-6 pb-24 md:pb-6">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Building2 className="w-5 h-5 text-red-700" />
          <h2 className="text-base font-bold text-gray-900">
            Company Profile & Letterhead
          </h2>
        </div>

        <button
          type="button"
          onClick={handleResetDefaults}
          className="text-xs text-gray-500 hover:text-red-700 flex items-center space-x-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {savedAlert && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-xs font-semibold">
          ✓ Company profile saved successfully! It will now appear on all your invoices.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Company Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full text-xs font-bold px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Full Registered Address
          </label>
          <textarea
            rows={3}
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full text-xs font-medium px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 bg-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              GSTN / GSTIN
            </label>
            <input
              type="text"
              value={formData.gstn}
              onChange={(e) => handleChange('gstn', e.target.value.toUpperCase())}
              className="w-full text-xs font-mono font-medium px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 bg-white uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Contact Phone / Mobile
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full text-xs font-medium px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 bg-white"
            />
          </div>
        </div>

        {/* Bank Information */}
        <div className="pt-3 border-t border-gray-100">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-3">
            Default Bank Account (Optional)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                value={formData.bankName || ''}
                onChange={(e) => handleChange('bankName', e.target.value)}
                placeholder="e.g. State Bank of India"
                className="w-full text-xs font-medium px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Account Number
              </label>
              <input
                type="text"
                value={formData.accountNo || ''}
                onChange={(e) => handleChange('accountNo', e.target.value)}
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
                value={formData.ifscCode || ''}
                onChange={(e) => handleChange('ifscCode', e.target.value.toUpperCase())}
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
                value={formData.branch || ''}
                onChange={(e) => handleChange('branch', e.target.value)}
                placeholder="e.g. Thirumudivakkam"
                className="w-full text-xs font-medium px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 bg-white"
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Company Details</span>
          </button>
        </div>
      </form>
    </div>
  );
};
