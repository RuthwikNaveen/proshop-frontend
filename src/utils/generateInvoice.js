import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // MODIFIED: A more explicit import

const generateInvoice = (order) => {
  const doc = new jsPDF();

  const safeText = (text) => text || 'N/A';

  // Add Header
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('ProShop Invoice', 14, 22);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('ProShop Marketplace', 14, 30);
  doc.text('123 Tech Lane, Mysuru, KA 570001', 14, 34);
  doc.text('support@proshop.com', 14, 38);

  // Add Invoice Details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice To:', 14, 50);
  doc.setFont('helvetica', 'normal');
  doc.text(safeText(order?.user?.email), 14, 56);
  doc.text(safeText(order?.shippingAddress?.address), 14, 60);
  doc.text(
    `${safeText(order?.shippingAddress?.city)}, ${safeText(
      order?.shippingAddress?.postalCode
    )}`,
    14,
    64
  );
  doc.text(safeText(order?.shippingAddress?.country), 14, 68);

  const pageRight = doc.internal.pageSize.getWidth() - 14;
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice Number:', 108, 50);
  doc.setFont('helvetica', 'normal');
  doc.text(safeText(order?._id), pageRight, 50, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.text('Date:', 108, 56);
  doc.setFont('helvetica', 'normal');
  doc.text(
    order.paidAt ? new Date(order.paidAt).toLocaleDateString() : 'N/A',
    pageRight, 56, { align: 'right' }
  );

  // Add Table of Items
  const tableColumn = ["Item", "Qty", "Price", "Total"];
  const tableRows = [];

  order.orderItems.forEach(item => {
    const itemData = [
      item.name,
      item.qty,
      `$${item.price.toFixed(2)}`,
      `$${(item.qty * item.price).toFixed(2)}`
    ];
    tableRows.push(itemData);
  });

  // MODIFIED: Call autoTable as a direct function
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 80,
    theme: 'striped',
    headStyles: { fillColor: [38, 50, 56] }
  });

  // Add Totals
  const finalY = doc.lastAutoTable.finalY;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  
  doc.text('Subtotal:', 140, finalY + 10);
  doc.text(`$${order.itemsPrice?.toFixed(2) || '0.00'}`, pageRight, finalY + 10, { align: 'right' });

  doc.text('Shipping:', 140, finalY + 15);
  doc.text(`$${order.shippingPrice?.toFixed(2) || '0.00'}`, pageRight, finalY + 15, { align: 'right' });
  
  doc.text('Tax:', 140, finalY + 20);
  doc.text(`$${order.taxPrice?.toFixed(2) || '0.00'}`, pageRight, finalY + 20, { align: 'right' });
  
  doc.setFontSize(12);
  doc.text('Total:', 140, finalY + 25);
  doc.setFont('helvetica', 'bold');
  doc.text(`$${order.totalPrice?.toFixed(2) || '0.00'}`, pageRight, finalY + 25, { align: 'right' });


  // Add Footer
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text('Thank you for your business!', 14, finalY + 40);

  // Save the PDF
  doc.save(`invoice-${order._id}.pdf`);
};

export default generateInvoice;

