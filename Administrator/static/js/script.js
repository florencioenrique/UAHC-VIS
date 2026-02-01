function applyFilters() {
    const search = document.getElementById("searchInput").value.toLowerCase();
    const typeFilter = document.getElementById("typeFilter").value.toLowerCase();
    const rows = document.querySelectorAll(".log-row");
    
    rows.forEach(row => {
        const plate = row.querySelector(".plate-text").textContent.toLowerCase();
        const owner = row.querySelector(".owner-name").textContent.toLowerCase();
        const vehicleType = (row.getAttribute("data-type") || "").toLowerCase();
        
        const matchesSearch = plate.includes(search) || owner.includes(search);
        const matchesType = (typeFilter === "all" || vehicleType === typeFilter);
        
        row.style.display = (matchesSearch && matchesType) ? "" : "none";
    });
}

// Ensure the search bar also triggers the combined filter
document.getElementById("searchInput").addEventListener("input", applyFilters);

// Your existing filterByDate function should probably look like this:
function filterByDate() {
    const date = document.getElementById("dateSelect").value;
    window.location.href = `?date=${date}`;
}


function filterByDate() {
    const selectedDate = document.getElementById("dateSelect").value;
    // Use the blueprint prefix 'admin'
    window.location.href = `/admin/vehicle_log?date=${selectedDate}`;
}

function printPDF() {
    const printArea = document.getElementById("printArea");
    if (!printArea) return;
    
    // 1. Clone and Clean Content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = printArea.innerHTML;
    
    // Target the specific titles and dates currently sitting above your table
    const titlesToRemove = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, .text-center, .mb-4');
    titlesToRemove.forEach(el => {
        const text = el.innerText.toUpperCase();
        if (text.includes('VEHICLE LOG REPORT') || text.includes('DATE:')) {
            el.remove();
        }
    });
    
    const printContents = tempDiv.innerHTML;
    const printWindow = window.open('', '', 'height=800,width=1000');
    
    const now = new Date();
    const dateString = now.toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    }).toUpperCase();
    
    const logoUrl = window.location.origin + "/admin/static/images/ua1.png"; 
    
    let html = '<html><head><title>&nbsp;</title>'; // Set title to non-breaking space to hide window title
    html += '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />';
    html += '<style>';
    
    /* THE FIX: This removes the browser metadata (URL, Date, Title) */
    html += '@page { size: auto; margin: 0; }'; 
    
    /* We add padding to the body so the content doesn't hit the very edge of the paper */
    html += 'body { padding: 1.5cm !important; display: flex; flex-direction: column; min-height: 98vh; background: white; }';
    
    // Header Styling (Logo + University Name)
    html += '.report-header { border-bottom: 2px solid #000; margin-bottom: 20px; padding-bottom: 15px; }';
    html += '.univ-name { font-size: 22px; font-weight: bold; margin: 0; }';
    html += '.sys-name { font-size: 16px; color: #333; margin: 0; }';
    html += '.logo-img { max-height: 60px; width: auto; margin-right: 15px; }';
    
    // User-Friendly Zebra Table
    html += 'table { width: 100% !important; border-collapse: collapse !important; border: 1px solid #000 !important; }';
    html += 'th { background-color: #f8f9fa !important; border: 1px solid #000 !important; padding: 10px !important; font-size: 12px; text-transform: uppercase; }';
    html += 'td { border: 1px solid #000 !important; padding: 8px !important; font-size: 13px; }';
    html += 'tr:nth-child(even) { background-color: #f2f2f2 !important; }'; 
    
    // Footer Logic
    html += '.content-body { flex-grow: 1; margin-top: 10px; }';
    html += '.report-footer { border-top: 2px solid #000; padding-top: 10px; margin-top: 30px; font-size: 12px; font-weight: bold; }';
    html += '</style></head><body>';
    
    // 3. YOUR BRANDED HEADER (This stays)
    html += '<div class="report-header d-flex align-items-center">';
    html += '  <img src="' + logoUrl + '" class="logo-img" onerror="this.style.display=\'none\'">';
    html += '  <div>';
    html += '    <p class="univ-name">University of Antique</p>';
    html += '    <p class="sys-name">Vehicle Identification System</p>';
    html += '  </div>';
    html += '</div>';
    
    // 4. THE TABLE
    html += '<div class="content-body">' + printContents + '</div>';
    
    // 5. OFFICIAL FOOTER
    html += '<div class="report-footer text-center">';
    html += '  <p>REPORT GENERATED ON: ' + dateString + '</p>';
    html += '</div>';
    
    html += '</body></html>';
    
    printWindow.document.write(html);
    printWindow.document.close();
    
    printWindow.onload = function() {
        setTimeout(function() {
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        }, 500);
    };
}


function renewVehicle() {
    const modalInstance = bootstrap.Modal.getOrCreateInstance(document.getElementById('editModal'));
    modalInstance.hide();
    const userId = document.getElementById('edit_user_id').value;
    
    
    fetch('/admin/renew_vehicle', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Vehicle successfully renewed!");
            
            // Close the modal and reload
            const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
            modal.hide();
            location.reload();
        } else {
            alert("Failed to renew: " + data.message);
        }
    })
    .catch(error => {
        console.error("Renewal error:", error);
        alert("An error occurred during renewal.");
    });
}


document.getElementById('searchInput').addEventListener('input', function () {
    const filter = this.value.toLowerCase();
    const rows = document.querySelectorAll('table tbody tr');
    
    rows.forEach(row => {
        const ownerName = row.querySelector('td:nth-child(1)')?.textContent.toLowerCase() || "";
        const gatePass = row.querySelector('td:nth-child(2)')?.textContent.toLowerCase() || "";
        const address = row.querySelector('td:nth-child(4)')?.textContent.toLowerCase() || "";
        
        if (ownerName.includes(filter) || gatePass.includes(filter) || address.includes(filter)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});


function showQRModal(userId) {
    const owner = owners.find(o => String(o.user_id) === String(userId));
    
    if (!owner) {
        console.error("Owner data not found");
        return;
    }

    // Update download button data attributes
    const downloadBtn = document.getElementById("downloadBtn");
    downloadBtn.setAttribute("data-gate-pass", owner.gate_pass || "N/A");
    downloadBtn.setAttribute("data-owner-name", `${owner.first_name} ${owner.last_name}`);

    const qrData = `ID=${owner.user_id};VH-ID=${owner.vehicle_id}`;
    const qrContainer = document.getElementById("modal-qr-container");
    qrContainer.innerHTML = "";
    
    // Generate the QR code (Logo drawing logic removed)
    const qr = new QRCode(qrContainer, {
        text: qrData,
        width: 250,
        height: 250,
        correctLevel: QRCode.CorrectLevel.M // Set to Medium since there's no logo blocking data
    });
    
    // Show Bootstrap modal
    const modal = new bootstrap.Modal(document.getElementById('qrModal'));
    modal.show();
}

function enableInputs() {
    // Select all inputs, selects, and buttons inside the form
    const inputs = document.querySelectorAll('#editModal input, #editModal select');
    inputs.forEach(input => {
        input.disabled = false;
    });
    
    // Specifically trigger your cascading load functions if they are empty
    if (document.getElementById('region').options.length <= 1) {
        loadHomeRegions();
        loadBirthCountries();
    }
}

function toggleForHireFields() {
    const usage = document.getElementById('usage_select').value;
    const container = document.getElementById('forHireContainer');
    container.style.display = (usage === 'For Hire') ? 'block' : 'none';
}

function deleteOwner(userId) {
    Swal.fire({
        title: 'Are you sure?',
        text: "This will permanently delete the owner and associated vehicle info.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/admin/delete_owner/${userId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'Owner record has been deleted.',
                        timer: 2000,
                        showConfirmButton: false
                    }).then(() => {
                        location.reload();
                    });
                } else {
                    Swal.fire('Error', 'Failed to delete owner.', 'error');
                }
            })
            .catch(error => {
                console.error("Error deleting owner:", error);
                Swal.fire('Error', 'An error occurred.', 'error');
            });
        }
    });
}




let currentCanvas = null;
const { jsPDF } = window.jspdf;

function toggleForHireFields() {
    const isForHire = document.getElementById('vehicleForHire').checked;
    const forHireFields = document.getElementById('forHireFields');
    forHireFields.style.display = isForHire ? 'block' : 'none';
}

// document.getElementById('profilePicInput').addEventListener('change', function(event) {
//     const reader = new FileReader();
//     reader.onload = function(){
//         document.getElementById('previewImage').src = reader.result;
//     };
//     if (event.target.files[0]) {
//         reader.readAsDataURL(event.target.files[0]);
//     }
// });

async function printFullOwnerData(userId) {
    
    try {
        // 1. Fetch the absolute latest data from your Flask backend
        // Assuming your route is /get_owner/ID (check your script.js fetchOwnerData logic)
        const response = await fetch(`/admin/get_owner/${userId}`);
        
        const data = await response.json();
        
        if (!data) {
            alert("Record not found!");
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // --- PDF STYLING ---
        doc.setFontSize(18);
        doc.text("UNIVERSITY OF ANTIQUE", 105, 20, { align: "center" });
        doc.setFontSize(12);
        doc.text("Vehicle & Owner Information Sheet", 105, 28, { align: "center" });
        doc.line(20, 32, 190, 32);
        
        // Helper to handle null/undefined
        const check = (val) => (val && val !== "None") ? val : "N/A";
        
        // --- SECTION: PERSONAL ---
        doc.setFont("helvetica", "bold");
        doc.text("I. OWNER INFORMATION", 20, 45);
        doc.setFont("helvetica", "normal");
        
        let y = 55;
        const rowHeight = 8;
        
        const details = [
            ["Full Name:", `${check(data.first_name)} ${check(data.middle_name)} ${check(data.last_name)}`],
            ["User ID:", data.user_id],
            ["Address:", `${check(data.region)} ${check(data.province)} ${check(data.municipality)} ${check(data.barangay)}`],
            ["Contact:", check(data.phone)],
            ["Birthday:", check(data.birthday)],
            ["Gender/Civil Status:", `${check(data.gender)} / ${check(data.civil_status)}`],
            ["Emergency Contact:", `${check(data.emergency_name)} (${check(data.emergency_phone)})`]
        ];
        
        details.forEach(item => {
            doc.setFont("helvetica", "bold");
            doc.text(item[0], 25, y);
            doc.setFont("helvetica", "normal");
            doc.text(String(item[1]), 75, y);
            y += rowHeight;
        });
        
        // --- SECTION: VEHICLE ---
        y += 5;
        doc.setFont("helvetica", "bold");
        doc.text("II. VEHICLE & LICENSE DETAILS", 20, y);
        y += 10;
        
        const vehicle = [
            ["Plate Number:", check(data.plate_number)],
            ["Vehicle Type:", check(data.vehicle_type)],
            ["Brand/Color:", `${check(data.brand)} / ${check(data.color)}`],
            ["Gate Pass:", check(data.gate_pass)],
            ["License No:", check(data.license_number)],
            ["License Type:", check(data.license_type)],
            ["Expiry Date:", check(data.expiration_date)],
        ];
        
        vehicle.forEach(item => {
            doc.setFont("helvetica", "bold");
            doc.text(item[0], 25, y);
            doc.setFont("helvetica", "normal");
            doc.text(String(item[1]), 75, y);
            y += rowHeight;
        });
        
        // Footer
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 280);
        
        // 3. Trigger Print/Save
        doc.save(`Owner_Record_${data.last_name}.pdf`);
        
        
        console.log("Full Data Received:", data); // <--- ADD THIS
        
    } catch (error) {
        console.error("Error printing data:", error);
        alert("Failed to fetch data for printing.");
    }
}

// --- 1. Replace your entire search/filter logic with this unified version ---

function filterTable() {
    const searchVal = document.getElementById('searchInput')?.value.toLowerCase().trim() || "";
    const statusVal = document.getElementById('statusFilter')?.value.trim() || "";
    const typeVal = document.getElementById('typeFilter')?.value.trim() || "";
    
    const rows = document.querySelectorAll('.owner-row');
    const noResultsRow = document.getElementById('noResultsRow');
    
    let visibleCount = 0;
    
    rows.forEach(row => {
        const nameText = row.querySelector('.owner-name-cell')?.textContent.toLowerCase() || "";
        const plateText = row.querySelector('.plate-cell')?.textContent.toLowerCase() || "";
        
        // Clean Status Text
        const statusBadge = row.querySelector('.status-cell .badge');
        const statusText = statusBadge ? statusBadge.textContent.trim() : "";
        
        // Clean Vehicle Type Text
        const typeDiv = row.querySelector('.type-cell');
        const typeText = typeDiv ? typeDiv.textContent.trim() : "";
        
        // Comparison
        const matchesSearch = nameText.includes(searchVal) || plateText.includes(searchVal);
        const matchesStatus = (statusVal === "") || (statusText.toLowerCase() === statusVal.toLowerCase());
        const matchesType = (typeVal === "") || (typeText.toLowerCase() === typeVal.toLowerCase());
        
        // DEBUG: Uncomment the next line to see why it fails in the console (F12)
        // console.log(`Row: ${nameText} | Type: "${typeText}" | Filter: "${typeVal}" | Match: ${matchesType}`);
        
        if (matchesSearch && matchesStatus && matchesType) {
            row.style.display = "";
            visibleCount++;
        } else {
            row.style.display = "none";
        }
    });
    
    if (noResultsRow) {
        noResultsRow.style.display = (visibleCount === 0) ? "" : "none";
    }
}

// Ensure the search input also calls the main function
document.getElementById('searchInput')?.addEventListener('input', filterTable);

// Reset function
function resetFilters() {
    if(document.getElementById('searchInput')) document.getElementById('searchInput').value = '';
    if(document.getElementById('statusFilter')) document.getElementById('statusFilter').value = '';
    if(document.getElementById('typeFilter')) document.getElementById('typeFilter').value = '';
    filterTable();
}