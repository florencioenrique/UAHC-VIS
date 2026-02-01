// function downloadQRAsPDF() {
//     // 1. Find the canvas inside your specific container
//     const qrContainer = document.getElementById("modal-qr-container");
//     const qrCanvas = qrContainer.querySelector("canvas");

//     if (!qrCanvas) {
//         alert("QR Code not found! Please generate it first.");
//         return;
//     }

//     const { jsPDF } = window.jspdf;
//     // Convert canvas to Image Data
//     const qrImageData = qrCanvas.toDataURL("image/png");

//     const pdf = new jsPDF({
//         orientation: 'portrait',
//         unit: 'mm',
//         format: 'a4'
//     });

//     const pageWidth = pdf.internal.pageSize.getWidth();
//     const qrSize = 80;
//     const padding = 10;
//     const header = "University of Antique";
//     const today = new Date().toLocaleDateString();
//     const footer = `Generated on: ${today}`;

//     // Measure widths
//     pdf.setFont("helvetica", "bold");
//     pdf.setFontSize(14);
//     const headerWidth = pdf.getTextWidth(header);
//     const headerHeight = 14 * 0.35; 

//     pdf.setFontSize(12);
//     const footerWidth = pdf.getTextWidth(footer);
//     const footerHeight = 12 * 0.35;

//     // Calculate box dimensions
//     const boxWidth = Math.max(qrSize, headerWidth, footerWidth) + padding * 2;
//     const boxHeight = headerHeight + qrSize + footerHeight + (padding * 4);
//     const boxX = (pageWidth - boxWidth) / 2;
//     const boxY = 60; // Set a fixed starting Y position

//     // --- DRAWING ---
//     // Draw Border Box
//     pdf.setDrawColor(0);
//     pdf.rect(boxX, boxY, boxWidth, boxHeight);

//     // Draw Header
//     pdf.text(header, pageWidth / 2, boxY + padding + headerHeight, { align: "center" });

//     // Draw QR Code
//     pdf.addImage(qrImageData, "PNG", (pageWidth - qrSize) / 2, boxY + (padding * 2) + headerHeight, qrSize, qrSize);

//     // Draw Footer
//     pdf.setFontSize(10);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(footer, pageWidth / 2, boxY + (padding * 3) + headerHeight + qrSize + footerHeight, { align: "center" });

//     // Save PDF
//     pdf.save("ua_vehicle_qr.pdf");
// }

async function downloadQRAsPDF() {
    const downloadBtn = document.getElementById("downloadBtn");
    
    // 1. Pull the REAL data we stored in the showQRModal function
    const gatePass = downloadBtn.getAttribute("data-gate-pass");
    const ownerName = downloadBtn.getAttribute("data-owner-name");

    const qrContainer = document.getElementById("modal-qr-container");
    const qrCanvas = qrContainer.querySelector("canvas");

    if (!qrCanvas) {
        alert("QR Code not found!");
        return;
    }

    const { jsPDF } = window.jspdf;
    const qrImageData = qrCanvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const cardWidth = 100; 
    const cardHeight = 140; 
    const startX = (pageWidth - cardWidth) / 2;
    const startY = 40;
    const centerX = pageWidth / 2;

    // --- 1. Background Logo (Watermark) with Correct Clipping ---
    // We use saveGraphicsState/restoreGraphicsState to prevent the clip 
    // and opacity from affecting the rest of the PDF elements.
    pdf.saveGraphicsState(); 
    pdf.rect(startX, startY, cardWidth, cardHeight);
    pdf.clip(); 

    try {
        const logoUrl = "/admin/static/images/ua1.png"; 
        pdf.setGState(new pdf.GState({ opacity: 0.15 }));
        
        const logoSize = 150; 
        const logoX = centerX - (logoSize / 2);
        const logoY = (startY + (cardHeight / 2)) - (logoSize / 2);
        
        pdf.addImage(logoUrl, "PNG", logoX, logoY, logoSize, logoSize);
    } catch (e) {
        console.error("Logo failed to load.", e);
    }

    pdf.restoreGraphicsState(); // This resets opacity to 1.0 and removes the clip

    // --- 2. "Cut Here" Border ---
    pdf.setLineWidth(0.1);
    pdf.setLineDashPattern([2, 2], 0);
    pdf.setDrawColor(180); 
    pdf.rect(startX, startY, cardWidth, cardHeight);
    pdf.setLineDashPattern([], 0); 

    // --- 3. Header Text ---
    pdf.setTextColor(190, 30, 45); // UA Maroon
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.text("UNIVERSITY OF ANTIQUE", centerX, startY + 15, { align: "center" });

    pdf.setFontSize(14);
    pdf.text("HAMTIC CAMPUS", centerX, startY + 23, { align: "center" });

    // --- 4. QR Code with Border ---
    const qrSize = 70;
    const qrX = (pageWidth - qrSize) / 2;
    const qrY = startY + 30;

    pdf.setDrawColor(0); 
    pdf.setLineWidth(0.5);
    pdf.rect(qrX - 1, qrY - 1, qrSize + 2, qrSize + 2); 
    pdf.addImage(qrImageData, "PNG", qrX, qrY, qrSize, qrSize);

    // --- 5. Database Data (Gate Pass & System Name) ---
    pdf.setFontSize(32);
    pdf.setTextColor(0, 0, 0); 
    // Uses the real gatePass from the database
    pdf.text(gatePass || "N/A", centerX, startY + 115, { align: "center" });

    pdf.setTextColor(190, 30, 45);
    pdf.setFontSize(12);
    pdf.text("VEHICLE INFORMATION SYSTEM", centerX, startY + 125, { align: "center" });

    // --- 6. Footer Banner & Dynamic Date ---
    pdf.setFillColor(0, 100, 50); // UA Green
    pdf.rect(startX, startY + cardHeight - 10, cardWidth, 10, 'F');

    const today = new Date().toLocaleDateString('en-US', { 
        month: 'long', day: 'numeric', year: 'numeric' 
    }).toUpperCase();

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.text(today, centerX, startY + cardHeight - 3.5, { align: "center" });

    // Save using the Gate Pass ID as the filename
    pdf.save(`VIS_${gatePass}.pdf`);
}