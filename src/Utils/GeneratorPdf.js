import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { Button } from 'primereact/button';

const PdfGenerator = () => {
    const handleGeneratePDF = () => {
        const vendor = {
            name: "Velavan B",
            address: "14/203, Kallakulam, Seenapuram",
            pinCode: "638057",
            contact: "Santhosh D",
            phone: "8993298712",
        };

        const items = [
            { name: 'Water Tanks', qty: 15, uom: "Liters", price: 1200 },
            { name: 'Laptops', qty: 5, uom: "Pieces", price: 25000 },
            { name: 'Coffee Mugs', qty: 50, uom: "Pieces", price: 50 },
            { name: 'Desk Chairs', qty: 8, uom: "Pieces", price: 8000 },
            { name: 'LED TVs', qty: 3, uom: "Units", price: 30000 },
            { name: 'Bookshelves', qty: 2, uom: "Units", price: 5000 },
            { name: 'Smartphones', qty: 10, uom: "Pieces", price: 15000 },
            { name: 'Desk Lamps', qty: 20, uom: "Pieces", price: 100 },
            { name: 'Headphones', qty: 25, uom: "Pairs", price: 500 },
            { name: 'Backpacks', qty: 12, uom: "Pieces", price: 800 },
            { name: 'Fitness Trackers', qty: 7, uom: "Pieces", price: 1200 },
            { name: 'Digital Cameras', qty: 4, uom: "Units", price: 15000 },
            { name: 'Portable Speakers', qty: 18, uom: "Pieces", price: 800 },
            { name: 'Sunglasses', qty: 30, uom: "Pairs", price: 200 },
            { name: 'Running Shoes', qty: 15, uom: "Pairs", price: 1000 },
            { name: 'Gaming Consoles', qty: 6, uom: "Units", price: 25000 },
            { name: 'Wristwatches', qty: 9, uom: "Pieces", price: 3000 },
            { name: 'Power Banks', qty: 20, uom: "Pieces", price: 500 },
            { name: 'Bluetooth Earbuds', qty: 22, uom: "Pairs", price: 1000 },
            { name: 'Home Printers', qty: 3, uom: "Units", price: 8000 },
        ].map((item) => ({
            ...item,
            total: (item.qty * item.price).toString()
        }));

        const doc = new jsPDF();
        doc.setProperties({ title: "Request For Quotation" });

        const logoImg = "/aalam.png";
        const phoneIcon = "/Calling.png";

        doc.addImage(logoImg, 'JPEG', 10, 5, 40, 12);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('REQUEST FOR QUOTATION', 150, 12);
        doc.line(10, 18, 200, 18);

        doc.setFont('helvetica', 'normal');
        doc.text('Contact Person', 13, 23);
        doc.text("Nithish Kumar CP", 13, 28);
        doc.addImage(phoneIcon, 'PNG', 13, 29, 3, 3);
        doc.text("9078382732", 16, 32);

        doc.setFont('helvetica', 'bold');
        doc.text('RFQ No      :', 130, 23);
        doc.text('RFQ Date   :', 130, 27);
        doc.text('Due Date    :', 130, 31);
        doc.setFont('helvetica', 'normal');
        doc.text("RFQ20240092", 155, 23);
        doc.text(format(new Date(), 'MMM dd, yyyy'), 155, 27);
        doc.text(format(new Date("2024-02-08"), 'MMM dd, yyyy'), 155, 31);
        doc.line(10, 34, 200, 34);

        doc.setFont('helvetica', 'bold');
        doc.text('To', 13, 39);
        doc.text('Purchase Centre Address :', 130, 39);
        doc.setFont('helvetica', 'normal');
        doc.text('Head Office', 130, 44);
        doc.text('CHENNAI', 130, 48);
        doc.text(vendor.name, 13, 44);
        doc.text(vendor.address, 13, 48);
        doc.text(`P.O BOX : ${vendor.pinCode}`, 13, 52);
        doc.setFont('helvetica', 'bold');
        doc.text('Contact Person', 13, 56);
        doc.setFont('helvetica', 'normal');
        doc.text(vendor.contact, 13, 60);
        doc.addImage(phoneIcon, 'PNG', 13, 61, 3, 3);
        doc.text(`  ${vendor.phone}`, 16, 64);

        doc.setFont('helvetica', 'bold');
        doc.text('Dear Sir,', 13, 72);
        doc.setFont('helvetica', 'normal');
        doc.text('Please send your most competitive offer/mentioning your Terms & Conditions before the due date.', 13, 79);
        doc.text('You can send the same to the above mentioned e-mail/fax.', 13, 83);

        const tableBody = items.map((item, i) => [
            `${i + 1}`,
            item.name,
            item.qty.toString(),
            item.uom,
            item.total
        ]);

        autoTable(doc, {
            head: [['S.No', 'Item Name', 'Quantity', 'UOM', 'Total']],
            body: tableBody,
            startY: 88,
            styles: {
                fontSize: 10,
                font: 'helvetica',
                textColor: [0, 0, 0],
            },
            headStyles: {
                fillColor: [240, 240, 240],
                fontStyle: 'bold',
            },
            columnStyles: {
                0: { cellWidth: 15 },
                1: { cellWidth: 90 },
                2: { cellWidth: 30 },
                3: { cellWidth: 30 },
                4: { cellWidth: 23 },
            },
            margin: { left: 13 },
        });

        const pageHeight = doc.internal.pageSize.getHeight();
        const footerY = pageHeight - 50;

        doc.setFont('helvetica', 'normal');
        doc.text('Thanking You,', 13, footerY + 20);
        doc.text('Yours Faithfully,', 13, footerY + 24);
        doc.text('For ', 13, footerY + 28);

        doc.setFont('helvetica', 'bold');
        doc.text('Aalam Info Solutions LLP', 19, footerY + 28);

        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.line(10, 283, 200, 283);
            doc.setFont('helvetica', 'normal');
            doc.text(`Page ${i} of ${totalPages}`, 185, doc.internal.pageSize.getHeight() - 5);
        }

        doc.save('RFQ.pdf');
        const pdfUri = doc.output('datauristring');
        const newWindow = window.open();
        newWindow?.document.write(`<iframe width="100%" height="100%" src="${pdfUri}"></iframe>`);
    };

    return (
        <div className="flex justify-content-center p-3">
            <Button
                icon="pi pi-file-pdf"
                label="Generar PDF"
                className="p-button-raised p-button-danger"
                onClick={handleGeneratePDF}
            />
        </div>
    );
};

export default PdfGenerator;
