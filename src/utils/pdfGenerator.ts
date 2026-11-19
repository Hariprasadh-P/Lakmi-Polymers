import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export async function generateAndDownloadPdf(
  elementId: string,
  fileName: string = 'Leo_Plastics_Invoice.pdf'
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Invoice template element with id "${elementId}" not found`);
  }

  try {
    // Wait for fonts to be fully rendered
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    // Generate high-resolution PNG using html-to-image
    // pixelRatio: 2.5 ensures 300 DPI razor-sharp print quality
    const dataUrl = await toPng(element, {
      quality: 1.0,
      pixelRatio: 2.5,
      backgroundColor: '#ffffff',
      cacheBust: true,
      filter: (node) => {
        if (node instanceof HTMLElement && node.classList.contains('no-print')) {
          return false;
        }
        return true;
      },
    });

    // Create A4 PDF (210mm x 297mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load rendered invoice image'));
      img.src = dataUrl;
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 5; // 5mm margin
    const contentWidth = pageWidth - margin * 2; // 200mm
    const contentHeight = (img.height * contentWidth) / img.width;

    // Center content neatly on A4
    const yPos = contentHeight < pageHeight ? margin : 2;

    pdf.addImage(
      dataUrl,
      'PNG',
      margin,
      yPos,
      contentWidth,
      Math.min(contentHeight, pageHeight - margin * 2)
    );

    const safeFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    pdf.save(safeFileName);
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw error;
  }
}

export function printInvoice(): void {
  window.print();
}

export async function shareInvoicePdf(
  elementId: string,
  fileName: string = 'Leo_Plastics_Invoice.pdf'
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) return false;

  if (typeof navigator.share !== 'function') {
    return false;
  }

  try {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const dataUrl = await toPng(element, {
      quality: 0.95,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
    });

    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const file = new File([blob], `${fileName}.png`, { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: fileName,
        text: 'Tax Invoice from Leo Plastics',
        files: [file],
      });
      return true;
    }
  } catch (err) {
    console.error('Share error:', err);
  }
  return false;
}
