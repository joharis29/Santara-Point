import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * SANTARA POINT - PDF Receipt Generator
 * Generates a professional, branded PDF receipt.
 */
export const generateReceiptPDF = (transaction, storeSettings) => {
    if (!transaction || !transaction.items || transaction.items.length === 0) {
        console.error('Invalid transaction data for PDF generation');
        return;
    }

    // Create new PDF (Portrait, mm, 80mm width for POS feel)
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: [80, 250] // Custom height
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 5;
    let currentY = 10;

    // --- Header Section ---
    // Logo (Simulated for now, since we need Base64 for local files in jsPDF)
    // For now we use text-based branding
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(16, 185, 129); // Emerald-500
    doc.text(storeSettings.storeName || 'Santara Point', pageWidth / 2, currentY, { align: 'center' });
    
    currentY += 5;
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'italic');
    doc.text(storeSettings.storeTagline || 'Hidangan Lezat, Penuh Keberkahan.', pageWidth / 2, currentY, { align: 'center' });

    currentY += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    const addressLines = doc.splitTextToSize(storeSettings.address || 'Jl. Raya Santara No. 123, Bandung', pageWidth - 10);
    doc.text(addressLines, pageWidth / 2, currentY, { align: 'center' });
    
    currentY += (addressLines.length * 3) + 2;
    doc.text(`WA: ${storeSettings.whatsapp || '-'} | Email: ${storeSettings.email || '-'}`, pageWidth / 2, currentY, { align: 'center' });

    // Divider
    currentY += 4;
    doc.setDrawColor(230);
    doc.line(margin, currentY, pageWidth - margin, currentY);

    // --- Transaction Info ---
    currentY += 6;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(`ID: ${transaction.id || 'N/A'}`, margin, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date(transaction.timestamp).toLocaleString('id-ID'), pageWidth - margin, currentY, { align: 'right' });

    currentY += 4;
    doc.text(`Pelanggan: ${transaction.customerName || 'Umum'}`, margin, currentY);
    doc.text(`Antrian: ${transaction.queueNumber || '-'}`, pageWidth - margin, currentY, { align: 'right' });

    currentY += 4;
    doc.text(`Tipe: ${transaction.orderType || 'Dine-In'}`, margin, currentY);
    doc.text(`Kasir: ${transaction.cashierName || 'Online'}`, pageWidth - margin, currentY, { align: 'right' });

    // --- Items Table ---
    currentY += 6;
    const tableHead = [['Menu', 'Qty', 'Total']];
    const tableData = transaction.items.map(item => [
        item.name,
        item.quantity.toString(),
        `Rp ${(item.price * item.quantity).toLocaleString('id-ID')}`
    ]);

    autoTable(doc, {
        startY: currentY,
        head: tableHead,
        body: tableData,
        theme: 'plain',
        margin: { left: margin, right: margin },
        styles: { fontSize: 7, cellPadding: 1, textContent: 'normal' },
        headStyles: { fontStyle: 'bold', borderBottom: 1, borderColor: 200 },
        columnStyles: {
            0: { cellWidth: 'auto' },
            1: { cellWidth: 10, halign: 'center' },
            2: { cellWidth: 20, halign: 'right' }
        },
        didDrawPage: (data) => {
            currentY = data.cursor.y;
        }
    });

    // --- Totals Section ---
    currentY += 6;
    doc.setFontSize(7);
    
    // Subtotal
    const subtotal = transaction.totalAmount - (transaction.pajak || 0);
    doc.text('Subtotal:', pageWidth - 30, currentY, { align: 'right' });
    doc.text(`Rp ${subtotal.toLocaleString('id-ID')}`, pageWidth - margin, currentY, { align: 'right' });

    // Pajak
    currentY += 4;
    doc.text('Pajak Daerah (10%):', pageWidth - 30, currentY, { align: 'right' });
    doc.text(`Rp ${(transaction.pajak || 0).toLocaleString('id-ID')}`, pageWidth - margin, currentY, { align: 'right' });

    // Total
    currentY += 5;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL AKHIR:', pageWidth - 30, currentY, { align: 'right' });
    doc.text(`Rp ${transaction.totalAmount.toLocaleString('id-ID')}`, pageWidth - margin, currentY, { align: 'right' });

    // Payment Method
    currentY += 6;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(`Metode Pembayaran: ${transaction.paymentMethod || 'Tunai'}`, margin, currentY);

    // --- Footer ---
    currentY += 15;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(150);
    const footerText = storeSettings.footerText || 'Terima kasih telah berbelanja.\nBerkah setiap saat.';
    const footerLines = doc.splitTextToSize(footerText, pageWidth - 10);
    doc.text(footerLines, pageWidth / 2, currentY, { align: 'center' });

    // Save PDF
    doc.save(`Santara_Receipt_${transaction.id}.pdf`);
};
