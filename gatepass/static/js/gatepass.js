const scanAlert = document.getElementById('scan-alert');
const logSection = document.getElementById('logSection');
const toggleButton = document.getElementById('toggleButton');
const searchInput = document.getElementById('searchInput');

const today = new Date();

const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
};

const formattedDate = today.toLocaleDateString('en-US', options).toUpperCase();

document.getElementById('currentDate').textContent = formattedDate;

function showAlert(message, type = 'success') {
    scanAlert.innerHTML = message;
    scanAlert.className = `alert alert-${type}`;
    scanAlert.classList.remove('d-none');
    setTimeout(() => scanAlert.classList.add('d-none'), 3000);
}

function parseQr(qrString) {
    const parts = qrString.split(';');
    const data = {};
    for (const part of parts) {
        const [key, val] = part.split('=');
        if (key && val) data[key.trim()] = val.trim();
    }
    return data;
}

let lastScanTime = 0; 
const SCAN_DELAY = 5000;

function onScanSuccess(decodedText) {
    const now = Date.now();

    if (now - lastScanTime < SCAN_DELAY) {
        // Optional: showAlert('Please wait before scanning again.', 'info');
        return; // Ignore scan if within cooldown
    }
    lastScanTime = now;

    const parsed = parseQr(decodedText);
    const userId = parsed.ID;

    if (!userId) {
        showAlert('Invalid QR code format', 'danger');
        return;
    }

    fetch(`/gatepass/api/user/${userId}`)
    .then(res => res.json())
    .then(data => {
        if (data.status === 'error') {
            showAlert(data.message, 'danger');
        } else {
            if (data.report_status === 'PENDING') {
                showAlert(`Vehicle ${data.plate_number} has ${data.status} the campus.<br><strong>Please see admin to clarify report.</strong>`, 'warning');
            } else {
                showAlert(`Vehicle ${data.plate_number} has ${data.status} the campus`, 'success');
            }
            loadTodayLogs();  // Refresh logs after scan
        }
    })
    .catch(err => {
        showAlert('Error fetching user data.', 'danger');
    });
}

const html5QrCode = new Html5Qrcode("reader");
Html5Qrcode.getCameras().then(cameras => {
    if (cameras.length) {
        html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: {width:500, height:400} },
            onScanSuccess
        );
    } else {
        showAlert('No cameras found', 'danger');
    }
}).catch(err => {
    showAlert('Could not get cameras', 'danger');
});

// New formatTime: converts "HH:mm:ss.xxx" 24-hour to 12-hour with AM/PM
function formatTime(time) {
    if (!time || time === '00:00:00' || time === 'null') return '---';

    // 1. Check if the input already contains AM/PM to avoid "double am/pm"
    const isPM = /PM/i.test(time);
    const isAM = /AM/i.test(time);

    // 2. Clean numbers only (e.g., "14:30:05.123" -> "14:30")
    const cleanTime = time.replace(/(AM|PM)/i, '').trim();
    const parts = cleanTime.split(':');
    let hour = parseInt(parts[0], 10);
    const minute = parts[1] ? parts[1].substring(0, 2) : '00';

    // 3. Logic: If it's already 12-hour format, just use the existing label.
    // Otherwise, calculate AM/PM based on the 24-hour number.
    let ampm;
    if (isPM || isAM) {
        ampm = isPM ? 'PM' : 'AM';
    } else {
        ampm = hour >= 12 ? 'PM' : 'AM';
    }

    // 4. Convert 24-hour to 12-hour
    hour = hour % 12;
    if (hour === 0) hour = 12; 

    return `${hour}:${minute} ${ampm}`;
}

function loadTodayLogs() {
    

    fetch('/gatepass/api/logs/today')
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            const tbody = document.querySelector('#logTable tbody');
            tbody.innerHTML = '';

            data.data.forEach((row, index) => {
                const tr = document.createElement('tr');

                const isInside = !row.time_out || row.time_out === '00:00:00' || row.time_out === 'null';

                const timeOutDisplay = isInside 
                ? '<span class="badge rounded-pill bg-success-subtle text-success border border-success">ON CAMPUS</span>' 
                : formatTime(row.time_out);

                // ✅ Highlight expired vehicle
                const isExpired = row.vehicle_status && row.vehicle_status.toUpperCase() === 'EXPIRED';
                if (isExpired) {
                    tr.classList.add('table-danger'); // Bootstrap red background
                }

                if (isInside) {
                    tr.style.backgroundColor = "rgba(25, 135, 84, 0.05)"; 
                }

                // ✅ Report Status Column
                let statusHtml = '';
                if (!row.report_status || row.report_status === 'CLEARED') {
                    statusHtml = `<span style="color: green; font-weight: bold;">&#10004; Cleared</span>`;
                } else {
                    statusHtml = `<span style="color: orange; font-weight: bold;">&#9888; ${row.report_status}</span>`;
                }

                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${row.plate_number} ${isExpired ? '<span class="badge bg-danger ms-1">Expired</span>' : ''}</td>
                    <td>${row.full_name}</td>
                    <td>${formatTime(row.time_in)}</td>
                    <td>${formatTime(row.time_out)}</td>
                `;
                tbody.appendChild(tr);
            });
            filterTable();
        }
    });
}

function filterTable() {
    const searchText = searchInput.value.toLowerCase().trim();
    const showOnlyInside = document.getElementById('onCampusToggle').checked;
    const rows = document.querySelectorAll("#logTable tbody tr");

    rows.forEach(row => {
        const plateAndOwner = row.cells[1].textContent.toLowerCase() + row.cells[2].textContent.toLowerCase();
        
        // Logic: A row is "Inside" if the Time Out column (cell 4) contains our 'On Campus' badge or is empty
        // In your current code, you display '---' or 'On Campus' for vehicles still inside.
        const timeOutText = row.cells[4].textContent.trim();
        const isStillInside = timeOutText === '---' || timeOutText.includes('On Campus');

        // Combined Filter Logic
        const matchesSearch = plateAndOwner.includes(searchText);
        const matchesStatus = !showOnlyInside || isStillInside;

        if (matchesSearch && matchesStatus) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

// Add the event listener for the toggle
document.getElementById('onCampusToggle').addEventListener('change', filterTable);

// Attach event listener here:
searchInput.addEventListener('input', filterTable);

loadTodayLogs();
setInterval(loadTodayLogs, 5000);

toggleButton.addEventListener('click', () => {
    const isVisible = logSection.style.display !== 'none';
    logSection.style.display = isVisible ? 'none' : 'block';
    toggleButton.textContent = isVisible ? 'Show Logs' : 'Hide Logs';
});

