// Animation
let tl = gsap.timeline();
tl.from(".school-name", {duration: 1, y: -50, opacity: 0, ease: "power2.out"});
tl.from(".sys-name-main", {duration: 1, y: -50, opacity: 0, ease: "power2.out"}, "-=0.5");
tl.from(".message", {duration: 1, y: -50, opacity: 0, ease: "power2.out"}, "-=0.5");
// tl.from(".get-started", {duration: 1, scale: 0.5, opacity: 0, ease: "power2.out"}, "-=0.5");
tl.from(".logo-main-page", {duration: 1, rotation: 360, opacity: 0, ease: "power2.out"}, "-=1");

gsap.registerPlugin(ScrollTrigger);

// Animate .key-features when it scrolls into view
gsap.from(".key-features", {
    duration: 1,
    y: 50,
    opacity: 0,
    ease: "power2.out",
    scrollTrigger: {
        trigger: ".key-features",
        start: "top 80%",
        toggleActions: "play none none none",
        // Uncomment to make animation progress smoothly with scroll:
        // scrub: 0.5,
    }
});

// Animate .how-it-works separately when it scrolls into view
gsap.from(".how-it-works", {
    duration: 1,
    y: 50,
    opacity: 0,
    ease: "power2.out",
    scrollTrigger: {
        trigger: ".how-it-works",  // fixed trigger here
        start: "top 80%",
        toggleActions: "play none none none",
        // scrub: 0.5,
    }
});

// const vehicleImageContainer = document.getElementById('vehicleImageContainer');
const resultText = document.getElementById('resultText');
const resultCard = document.getElementById('resultCard');
const resultImage = document.getElementById('resultImage');
const ownerName = document.getElementById('ownerName');
const beepSound = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
const cameraSelect = document.getElementById('cameraSelect');
const reportBtn = document.getElementById('reportBtn');
const reportModal = new bootstrap.Modal(document.getElementById('reportModal'));
const reportForm = document.getElementById('reportForm');
const violationType = document.getElementById('violationType');
const violationImage = document.getElementById('violationImage');
const vehicleIdInput = document.getElementById('vehicleIdInput');
const userIdInput = document.getElementById('userIdInput');

let html5QrcodeScanner = null;
let currentCameraId = null;
let scannedUserData = null;

function parseQrData(qrString) {
    const parts = qrString.split(';');
    const data = {};
    parts.forEach(part => {
        const [key, ...valueParts] = part.split('=');
        if (key && valueParts.length) {
            data[key.trim()] = valueParts.join('=').trim();
        }
    });
    return data;
}

function startScanner(cameraId) {
    if (html5QrcodeScanner) {
        html5QrcodeScanner.stop()
        .then(() => {
            html5QrcodeScanner.clear();
            html5QrcodeScanner = null;
            initScanner(cameraId);
        })
        .catch(err => console.error("Failed to stop scanner", err));
    } else {
        initScanner(cameraId);
    }
}

function initScanner(cameraId) {
    html5QrcodeScanner = new Html5Qrcode("reader");
    const config = {
        fps: 10,
        qrbox: { width: 400, height: 300 }
    };
    
    html5QrcodeScanner.start(
        { deviceId: { exact: cameraId } },
        config,
        decodedText => {
            beepSound.play();
            const data = parseQrData(decodedText);
            const userId = data.ID;
            const vehicleId = data['VH-ID'];
            
            if (!userId) {
                console.error("Invalid QR Code: No ID found.");
                resultText.innerHTML = `<p class="text-danger">Invalid QR code format.</p>`;
                ownerName.textContent = 'Unknown';
                resultImage.style.display = 'none';
                return;
            }
            
            // Fetch user data from Flask backend
            fetch(`/api/user/${userId}`)
            .then(response => response.json())
            .then(user => {
                if (user.status === 'error') {
                    resultText.innerHTML = `<p class="text-danger">${user.message}</p>`;
                    ownerName.textContent = 'Not Found';
                    resultImage.style.display = 'none';
                    return;
                }
                
                scannedUserData = user;
                ownerName.textContent = user.full_name || 'Unknown';
                resultText.innerHTML = `
                <p><strong>Phone:</strong> ${user.phone || 'N/A'}</p>
                <p><strong>Address:</strong> ${user.address}</p>
                <p><strong>Emergency Contact:</strong> ${user.emergency_name || 'N/A'} - ${user.emergency_phone || 'N/A'}</p>
            `;
                
                if (user.profile_pic) {
                    resultImage.src = `/uploads/profile/${user.profile_pic}`;
                    resultImage.style.display = 'block';
                } else {
                    resultImage.src = 'https://via.placeholder.com/150?text=No+Image';
                    resultImage.style.display = 'block';
                }
                vehicleIdInput.value = data['VH-ID'];
                userIdInput.value = userId;
                
                resultCard.style.display = 'block';
                
                // vehicleImageContainer.style.display = 'none';
            })
            .catch(err => {
                console.error("Error fetching user data", err);
                resultText.innerHTML = `<p class="text-danger">Failed to fetch user data.</p>`;
            });
        },
        error => {
            console.warn(`QR code scanning failed: ${error}`);
        });
    }
    
    function setupCameraSelector() {
        Html5Qrcode.getCameras().then(devices => {
            if (devices && devices.length) {
                const cameraOptions = devices.map(device => {
                    const option = document.createElement('option');
                    option.value = device.id;
                    option.textContent = device.label || 'Unnamed Camera';
                    return option;
                });
                
                cameraSelect.innerHTML = '';
                cameraOptions.forEach(option => cameraSelect.appendChild(option));
                
                cameraSelect.addEventListener('change', () => {
                    startScanner(cameraSelect.value);
                });
                
                // Try to find a camera labeled as back or rear
                const backCam = devices.find(device =>
                    device.label.toLowerCase().includes('back') ||
                    device.label.toLowerCase().includes('rear')
                );
                
                const preferredCameraId = backCam ? backCam.id : devices[0].id;
                
                cameraSelect.value = preferredCameraId;
                cameraSelect.disabled = false;
                
                startScanner(preferredCameraId);
            } else {
                cameraSelect.innerHTML = '<option>No cameras available</option>';
                cameraSelect.disabled = true;
            }
        }).catch(err => {
            console.error("Failed to get cameras", err);
            cameraSelect.innerHTML = '<option>Error loading cameras</option>';
            cameraSelect.disabled = true;
        });
    }
    
    document.getElementById('qrUpload').addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const html5QrCode = new Html5Qrcode("reader");
        
        html5QrCode.scanFile(file, true)
        .then(decodedText => {
            beepSound.play();
            const data = parseQrData(decodedText);
            const userId = data.ID;
            const vehicleId = data['VH-ID'];
            
            if (!userId) {
                console.error("Invalid QR Code: No ID found.");
                resultText.innerHTML = `<p class="text-danger">Invalid QR code format.</p>`;
                ownerName.textContent = 'Unknown';
                resultImage.style.display = 'none';
                return;
            }
            
            // Fetch user data
            fetch(`/api/user/${userId}`)
            .then(response => response.json())
            .then(user => {
                if (user.status === 'error') {
                    resultText.innerHTML = `<p class="text-danger">${user.message}</p>`;
                    ownerName.textContent = 'Not Found';
                    resultImage.style.display = 'none';
                    return;
                }
                
                scannedUserData = user;
                ownerName.textContent = user.full_name || 'Unknown';
                resultText.innerHTML = `
                        <p><strong>Phone:</strong> ${user.phone || 'N/A'}</p>
                        <p><strong>Address:</strong> ${user.address}</p>
                        <p><strong>Emergency Contact:</strong> ${user.emergency_name || 'N/A'} - ${user.emergency_phone || 'N/A'}</p>
                    `;
                
                resultImage.src = user.profile_pic
                ? `/uploads/profile/${user.profile_pic}`
                : 'https://via.placeholder.com/150?text=No+Image';
                resultImage.style.display = 'block';
                
                vehicleIdInput.value = vehicleId;
                userIdInput.value = userId;
                
                resultCard.style.display = 'block';
                // vehicleImageContainer.style.display = 'none';
            })
            .catch(err => {
                console.error("Error fetching user data", err);
                resultText.innerHTML = `<p class="text-danger">Failed to fetch user data.</p>`;
            });
        })
        .catch(err => {
            console.warn("QR code image scan failed:", err);
            Swal.fire({
                title: 'Scan Failed',
                text: 'Could not detect a valid QR code in the image.',
                icon: 'warning'
            });
        });
    });
    
    
    
    reportBtn.addEventListener('click', () => {
        reportModal.show();
    });
    
    reportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('violation', violationType.value);
        formData.append('vehicle_id', vehicleIdInput.value);
        formData.append('user_id', userIdInput.value);
        formData.append('violation_image', violationImage.files[0]);
        
        fetch('/api/report_violation', {
            method: 'POST',
            body: formData
        }).then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                Swal.fire({
                    title: 'Success!',
                    text: 'Violation reported successfully!',
                    icon: 'success',
                    confirmButtonText: 'Okay'
                }).then(() => {
                    reportModal.hide();
                });
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'Error reporting violation: ' + data.message,
                    icon: 'error',
                    confirmButtonText: 'Try Again'
                });
            }
        }).catch(err => {
            console.error('Error reporting violation:', err);
            Swal.fire({
                title: 'Error!',
                text: 'Something went wrong. Please try again later.',
                icon: 'error',
                confirmButtonText: 'Okay'
            });
        });
    });
    setupCameraSelector();