import React from 'react';
import type { InvoiceData } from '../types/invoice';
import { formatIndianCurrency } from '../utils/numberToWords';

interface InvoiceTemplateProps {
  invoice: InvoiceData;
  id?: string;
}

export const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({
  invoice,
  id = 'invoice-print-container',
}) => {
  // Ensure we have exactly 10 rows for 100% visual fidelity with the original template
  const rows = Array.from({ length: 10 }, (_, index) => {
    return invoice.items[index] || {
      id: `empty-${index}`,
      sNo: index + 1,
      particulars: '',
      sacHsn: '',
      qty: '',
      rate: '',
      taxableValue: 0,
      cgstRate: 0,
      cgstAmount: 0,
      sgstRate: 0,
      sgstAmount: 0,
      igstRate: 0,
      igstAmount: 0,
      total: 0,
    };
  });

  const isIntra = invoice.taxType === 'intra';

  return (
    <div
      id={id}
      className="bg-white text-black text-[11px] leading-tight select-text"
      style={{
        width: '100%',
        maxWidth: '794px', // Standard A4 pixel width at 96 DPI
        minHeight: '1120px',
        margin: '0 auto',
        padding: '16px',
        fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Arial, sans-serif',
        boxSizing: 'border-box',
      }}
    >
      {/* Outer Border Box */}
      <div className="border-[1.5px] border-black flex flex-col w-full h-full bg-white">
        
        {/* TOP HEADER SECTION */}
        <div className="grid grid-cols-[1fr_180px] border-b-[1.5px] border-black">
          {/* Company Details (Left) */}
          <div className="flex flex-col border-r-[1.5px] border-black">
            {/* Company Name */}
            <div className="pt-2 pb-1 text-center">
              <h1
                className="font-serif font-black tracking-wider text-[26px] leading-none uppercase"
                style={{ color: '#b91c1c' }}
              >
                {invoice.company.name || 'LEO PLASTICS'}
              </h1>
            </div>

            {/* Address */}
            <div className="px-3 pb-1.5 text-center font-bold text-[10.5px] leading-snug uppercase tracking-tight text-black">
              {invoice.company.address}
            </div>

            {/* GSTN & Phone sub-row */}
            <div className="grid grid-cols-2 border-t border-black text-center font-bold text-[11px] py-0.5">
              <div className="border-r border-black px-2">
                <span>GSTN: {invoice.company.gstn}</span>
              </div>
              <div className="px-2">
                <span>PH: {invoice.company.phone}</span>
              </div>
            </div>
          </div>

          {/* Copy Type Box (Right) */}
          <div className="flex items-center justify-center p-2 text-center font-bold text-[11px] leading-snug">
            <span>{invoice.copyType || 'Original for Receipent'}</span>
          </div>
        </div>

        {/* TAX INVOICE BAR */}
        <div
          className="border-b-[1.5px] border-black text-center font-bold text-[13px] tracking-wide py-1 text-black uppercase"
          style={{ backgroundColor: '#b8cce4' }}
        >
          TAX INVOICE
        </div>

        {/* INVOICE & BUYER DETAILS SECTION */}
        <div className="grid grid-cols-[44%_56%] border-b-[1.5px] border-black">
          {/* Left: Invoice No & Date */}
          <div className="flex flex-col border-r-[1.5px] border-black">
            <div className="border-b border-black px-2 py-1 font-bold">
              <span>Invoice No: </span>
              <span className="font-semibold">{invoice.invoiceNo}</span>
            </div>
            <div className="px-2 py-1 font-bold">
              <span>Invoice date: </span>
              <span className="font-semibold">{invoice.invoiceDate}</span>
            </div>
          </div>

          {/* Right: Buyer Name & Address */}
          <div className="flex flex-col">
            <div className="border-b border-black px-2 py-1 font-bold flex">
              <span className="shrink-0 mr-1">Name:</span>
              <span className="font-bold">{invoice.partyName}</span>
            </div>
            <div className="px-2 py-1 font-bold flex items-start">
              <span className="shrink-0 mr-1">Address:</span>
              <span className="font-normal text-[10.5px] leading-snug break-words">
                {invoice.partyAddress}
              </span>
            </div>
          </div>
        </div>

        {/* PARTY CODE, GSTIN, VEHICLE NO ROW */}
        <div className="grid grid-cols-[33%_37%_30%] border-b-[1.5px] border-black text-[11px] font-bold">
          <div className="border-r border-black px-2 py-0.5 flex justify-between">
            <span>Code:</span>
            <span className="font-semibold">{invoice.partyCode || 'PARTY'}</span>
          </div>
          <div className="border-r border-black px-2 py-0.5 flex items-center">
            <span className="mr-1">GSTIN:</span>
            <span className="font-bold">{invoice.partyGstin}</span>
          </div>
          <div className="px-2 py-0.5 flex items-center justify-between">
            <span>Vehicle No.</span>
            <span className="font-bold">{invoice.vehicleNo}</span>
          </div>
        </div>

        {/* MAIN ITEMS TABLE */}
        <div className="w-full flex-1">
          <table className="w-full border-collapse text-[10.5px]">
            <thead>
              {/* Header Row 1 */}
              <tr style={{ backgroundColor: '#b8cce4' }} className="font-bold text-center border-b border-black">
                <th rowSpan={2} className="border-r border-black py-1 px-1 w-[4.5%]">
                  S.<br />No.
                </th>
                <th rowSpan={2} className="border-r border-black py-1 px-1.5 w-[24%] text-center">
                  Particulars
                </th>
                <th rowSpan={2} className="border-r border-black py-1 px-1 w-[7%]">
                  SAC/HSN
                </th>
                <th rowSpan={2} className="border-r border-black py-1 px-1 w-[7.5%]">
                  Qty
                </th>
                <th rowSpan={2} className="border-r border-black py-1 px-1 w-[8.5%]">
                  Rate/Nos
                </th>
                <th rowSpan={2} className="border-r border-black py-1 px-1 w-[12%]">
                  Taxable Value
                </th>
                <th colSpan={2} className="border-r border-black py-0.5 px-1 w-[15%]">
                  CGST
                </th>
                <th colSpan={2} className="border-r border-black py-0.5 px-1 w-[15%]">
                  SGST
                </th>
                <th rowSpan={2} className="py-1 px-1 w-[11%]">
                  Total
                </th>
              </tr>
              {/* Header Row 2 (Sub-columns for CGST & SGST) */}
              <tr style={{ backgroundColor: '#b8cce4' }} className="font-bold text-center text-[9.5px] border-b border-black">
                <th className="border-r border-black py-0.5 px-0.5 w-[7%]">Rate</th>
                <th className="border-r border-black py-0.5 px-0.5 w-[8%]">Amount</th>
                <th className="border-r border-black py-0.5 px-0.5 w-[7%]">Rate</th>
                <th className="border-r border-black py-0.5 px-0.5 w-[8%]">Amount</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const hasData = Boolean(row.particulars || row.qty || row.rate || row.taxableValue);
                return (
                  <tr
                    key={row.sNo}
                    className="border-b border-black font-semibold text-[10.5px]"
                    style={{ height: '30px' }}
                  >
                    {/* S.No */}
                    <td className="border-r border-black text-center py-1 px-0.5">
                      {row.sNo}
                    </td>

                    {/* Particulars */}
                    <td className="border-r border-black text-left py-1 px-2 font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                      {hasData ? row.particulars : ''}
                    </td>

                    {/* SAC/HSN */}
                    <td className="border-r border-black text-center py-1 px-0.5">
                      {hasData ? row.sacHsn : ''}
                    </td>

                    {/* Qty */}
                    <td className="border-r border-black text-right py-1 px-1.5 font-bold">
                      {hasData && row.qty !== '' ? row.qty : ''}
                    </td>

                    {/* Rate/Nos */}
                    <td className="border-r border-black text-right py-1 px-1.5 font-bold">
                      {hasData && row.rate !== ''
                        ? typeof row.rate === 'number'
                          ? row.rate.toFixed(2)
                          : parseFloat(row.rate as string)
                          ? parseFloat(row.rate as string).toFixed(2)
                          : row.rate
                        : ''}
                    </td>

                    {/* Taxable Value */}
                    <td className="border-r border-black text-right py-1 px-1.5 font-bold">
                      {hasData && row.taxableValue > 0
                        ? formatIndianCurrency(row.taxableValue)
                        : ''}
                    </td>

                    {/* CGST Rate */}
                    <td className="border-r border-black text-center py-1 px-0.5 font-bold">
                      {hasData && isIntra && row.cgstRate > 0
                        ? `${row.cgstRate.toFixed(2)}%`
                        : ''}
                    </td>

                    {/* CGST Amount */}
                    <td className="border-r border-black text-right py-1 px-1 font-bold">
                      {hasData && isIntra && row.cgstAmount > 0
                        ? formatIndianCurrency(row.cgstAmount)
                        : ''}
                    </td>

                    {/* SGST Rate */}
                    <td className="border-r border-black text-center py-1 px-0.5 font-bold">
                      {hasData && isIntra && row.sgstRate > 0
                        ? `${row.sgstRate.toFixed(2)}%`
                        : ''}
                    </td>

                    {/* SGST Amount */}
                    <td className="border-r border-black text-right py-1 px-1 font-bold">
                      {hasData && isIntra && row.sgstAmount > 0
                        ? formatIndianCurrency(row.sgstAmount)
                        : ''}
                    </td>

                    {/* Total */}
                    <td className="text-right py-1 px-1.5 font-bold">
                      {hasData && row.total > 0
                        ? formatIndianCurrency(row.total)
                        : ''}
                    </td>
                  </tr>
                );
              })}

              {/* TABLE SUMMARY / TOTAL ROW */}
              <tr
                style={{ backgroundColor: '#b8cce4' }}
                className="font-bold border-b-[1.5px] border-black text-[11px]"
              >
                <td colSpan={5} className="border-r border-black py-1 px-2 text-center font-bold">
                  Total
                </td>
                <td className="border-r border-black py-1 px-1.5 text-right font-bold">
                  {invoice.totalBeforeTax > 0
                    ? formatIndianCurrency(invoice.totalBeforeTax)
                    : ''}
                </td>
                <td className="border-r border-black py-1 px-0.5"></td>
                <td className="border-r border-black py-1 px-1 text-right font-bold">
                  {isIntra && invoice.totalCgst > 0
                    ? formatIndianCurrency(invoice.totalCgst)
                    : ''}
                </td>
                <td className="border-r border-black py-1 px-0.5"></td>
                <td className="border-r border-black py-1 px-1 text-right font-bold">
                  {isIntra && invoice.totalSgst > 0
                    ? formatIndianCurrency(invoice.totalSgst)
                    : ''}
                </td>
                <td className="py-1 px-1.5 text-right font-bold">
                  {invoice.totalAfterTax > 0
                    ? formatIndianCurrency(invoice.totalAfterTax)
                    : ''}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* LOWER SECTION: AMOUNT IN WORDS + TAX BREAKDOWN */}
        <div className="grid grid-cols-[62%_38%] border-b border-black">
          {/* Left Column: Words + Bank Details Box */}
          <div className="flex flex-col justify-between border-r-[1.5px] border-black p-2">
            {/* Amount in words */}
            <div className="font-bold text-[11px] leading-snug mb-3">
              <span>{invoice.amountInWords}</span>
            </div>

            {/* Inner Bank Details / Terms Sub-table (Matching the 4 blank rows in the PDF) */}
            <div className="w-[85%] border border-black text-[10px]">
              <div className="grid grid-cols-[68%_32%] border-b border-black py-0.5 px-1.5 min-h-[18px]">
                <span className="font-semibold">
                  {invoice.company.bankName ? `Bank: ${invoice.company.bankName}` : ''}
                </span>
                <span></span>
              </div>
              <div className="grid grid-cols-[68%_32%] border-b border-black py-0.5 px-1.5 min-h-[18px]">
                <span className="font-semibold">
                  {invoice.company.accountNo ? `A/c: ${invoice.company.accountNo}` : ''}
                </span>
                <span></span>
              </div>
              <div className="grid grid-cols-[68%_32%] border-b border-black py-0.5 px-1.5 min-h-[18px]">
                <span className="font-semibold">
                  {invoice.company.ifscCode ? `IFSC: ${invoice.company.ifscCode}` : ''}
                </span>
                <span></span>
              </div>
              <div className="grid grid-cols-[68%_32%] py-0.5 px-1.5 min-h-[18px]">
                <span className="font-semibold">
                  {invoice.company.branch ? `Branch: ${invoice.company.branch}` : ''}
                </span>
                <span></span>
              </div>
            </div>
          </div>

          {/* Right Column: Tax Breakdown Sub-table */}
          <div className="flex flex-col text-[11px] font-bold">
            <div className="grid grid-cols-[65%_35%] border-b border-black py-1 px-2">
              <span>Total Amount before Tax</span>
              <span className="text-right">
                {invoice.totalBeforeTax > 0
                  ? formatIndianCurrency(invoice.totalBeforeTax)
                  : ''}
              </span>
            </div>

            <div className="grid grid-cols-[65%_35%] border-b border-black py-1 px-2">
              <span>Add:CGST</span>
              <span className="text-right">
                {isIntra && invoice.totalCgst > 0
                  ? formatIndianCurrency(invoice.totalCgst)
                  : ''}
              </span>
            </div>

            <div className="grid grid-cols-[65%_35%] border-b border-black py-1 px-2">
              <span>Add: SGST</span>
              <span className="text-right">
                {isIntra && invoice.totalSgst > 0
                  ? formatIndianCurrency(invoice.totalSgst)
                  : ''}
              </span>
            </div>

            <div className="grid grid-cols-[65%_35%] border-b border-black py-1 px-2">
              <span>IGST</span>
              <span className="text-right">
                {!isIntra && invoice.totalIgst > 0
                  ? formatIndianCurrency(invoice.totalIgst)
                  : ''}
              </span>
            </div>

            <div className="grid grid-cols-[65%_35%] py-1 px-2 text-[11.5px] font-black">
              <span>Total Amount after Tax:</span>
              <span className="text-right">
                {invoice.totalAfterTax > 0
                  ? formatIndianCurrency(invoice.totalAfterTax)
                  : ''}
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM CERTIFICATION & SIGNATURE */}
        <div className="flex flex-col">
          {/* Certification text */}
          <div className="py-1 px-2 text-center font-bold text-[9.5px] border-b border-black">
            <span>{invoice.certificationText}</span>
          </div>

          {/* Signatory Box */}
          <div className="flex justify-end p-2 pr-6">
            <div className="flex flex-col items-center">
              <span className="font-bold text-[11px] mb-8">
                {invoice.signatoryCompany}
              </span>
              <span className="font-bold text-[11px] border-t border-transparent pt-1">
                {invoice.signatoryTitle}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
