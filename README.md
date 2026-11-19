# Leo Plastics - Tax Invoice & Accounting Receipt System

A mobile-first, high-precision Tax Invoice Generator web application tailored specifically for **LEO PLASTICS**. It enables quick mobile data entry, automatic GST and amount-in-words calculations, lightweight local browser storage, and instant one-click downloading of the exact 1:1 invoice PDF matching the company's official template.

---

## 🚀 Key Features

### 1. 📄 Pixel-Perfect 1:1 Receipt Template Match
- **Exact Layout & Styling**: Recreates the company receipt template with precision:
  - Deep crimson red header for **LEO PLASTICS**
  - Company address, GSTN (`33SDUPS3805N2ZD`), and Phone (`9629284489`)
  - "TAX INVOICE" banner in signature periwinkle blue (`#b8cce4`)
  - Copy type selector (`Original for Receipent`, `Duplicate for Transporter`, `Triplicate for Supplier`, `Extra Copy`)
  - Invoice No, Invoice Date, Party details, Code, GSTIN, and Vehicle No
  - **10-Row Item Grid** with exact columns: S.No, Particulars, SAC/HSN, Qty, Rate/Nos, Taxable Value, CGST (Rate & Amount), SGST (Rate & Amount), and Total
  - Total row with background highlighting
  - Automatic conversion of total into Indian Currency words (e.g. `ONE LAKH FIFTY NINE THOUSAND THREE HUNDRED RUPEES ONLY`)
  - Lower bank details table and tax breakdown sub-table (`Total Amount before Tax`, `Add:CGST`, `Add: SGST`, `IGST`, `Total Amount after Tax`)
  - Official certification line and Authorised Signatory section for **LEO PLASTICS**

### 2. 📱 Mobile-First Data Entry
- Designed from the ground up for phone users who enter accounting details on the move.
- Clean touch-friendly form cards with large numeric inputs.
- Sticky mobile bottom action bar displaying the live total and quick buttons for **Download PDF**, **Print**, and **Live Preview**.
- Datalist suggestions for common plastic scrap items (e.g., *Waste Plastic Scrap*, *HDPE*, *PP Scrap*, *LDPE*, *Granules*).

### 3. 💾 Lightweight Storage (Zero Backend Required)
- **Auto-Save Drafts**: Automatically saves every keystroke in browser `localStorage`. If you refresh or close the tab, your data is never lost.
- **Invoice History**: Automatically archives downloaded receipts. Search, view, duplicate, or re-download past invoices anytime.
- **Customer Directory**: Auto-remembers buyer names, addresses, GSTINs, and codes for 1-tap autofill.
- **Backup & Restore**: Export and import your data as a clean JSON backup file.

### 4. 🖨️ Dual PDF Generation
- **One-Click PDF Download**: Generates a high-resolution 300 DPI vector-crisp PDF downloaded directly to your phone/computer via `jspdf` + `html2canvas`.
- **Native A4 Print**: Built-in `@media print` CSS formatted for standard A4 portrait printing without margins or unwanted webpage elements.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **PDF Generation**: jsPDF + html2canvas
- **Icons**: Lucide React
- **Storage**: Browser `localStorage` (Lightweight, private, offline-capable)
- **Deployment**: Vercel-ready with `vercel.json`

---

## 💻 Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

---

## ☁️ Deploying to Vercel

This repository is pre-configured and 100% deployment-ready for Vercel.

### Option 1: Via GitHub & Vercel Dashboard (Recommended)
1. Push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Leo Plastics Invoice Generator"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com/) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Vercel will automatically detect **Vite** and run `npm run build` using the included `vercel.json`.
5. Click **Deploy**. Your site will be live on a fast global URL!

### Option 2: Via Vercel CLI
1. Run:
   ```bash
   npx vercel
   ```
2. Follow the interactive prompts to link and deploy your project in seconds.
