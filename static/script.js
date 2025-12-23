// Toggle between Issue and Verify sections
function showSection(sectionId) {
    document.getElementById('issue-section').style.display = 'none';
    document.getElementById('verify-section').style.display = 'none';
    document.getElementById(sectionId).style.display = 'block';
}

function clearForm() {
    document.getElementById('adminAccount').value = "";
    document.getElementById('certId').value = "";
    document.getElementById('studentName').value = "";
    document.getElementById('courseName').value = "";
}

// Handle Issuing
async function handleIssue() {
    // .trim() removes accidental spaces at the start or end
    const recipient = document.getElementById('adminAccount').value.trim(); 
    const certId = document.getElementById('certId').value.trim();
    const name = document.getElementById('studentName').value.trim();
    const course = document.getElementById('courseName').value.trim();
    
    if(!recipient || !certId || !name || !course) {
        Swal.fire({
            icon: 'warning',
            title: 'Missing Info',
            text: 'Please fill in all fields before issuing.',
            confirmButtonColor: '#2b6cb0'
        });
        return;
    }

    // Show a "Loading" popup while the blockchain processes
    Swal.fire({
        title: 'Issuing Certificate...',
        text: 'Please wait while we write to the Blockchain ledger.',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    try {
        const response = await fetch('/api/issue', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                recipient_address: recipient, 
                cert_id: certId, 
                name: name, 
                course: course 
            })
        });

        const result = await response.json();

        if (response.ok) {
            // SUCCESS POPUP
            Swal.fire({
                icon: 'success',
                title: 'Successfully Issued!',
                html: `<b>Cert ID:</b> ${certId}<br><b>Tx Hash:</b> ${result.tx_hash.substring(0,20)}...`,
                showCancelButton: true,
                confirmButtonText: 'Download PDF',
                cancelButtonText: 'Close',
                confirmButtonColor: '#1e561e'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Trigger the PDF generation
                    downloadPDF(name, course, certId);
                };
            });
            clearForm();
            loadHistory();
        } else {
            // This will now show "Address not found in Ganache" and "Certificate already exists" error from Python/Solidity
            Swal.fire({
                icon: 'error',
                title: 'Issuance Failed',
                text: result.message,
                confirmButtonColor: '#d33'
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Connection Error',
            text: 'Could not connect to the Flask server.'
        });
    }

    const result = await response.json();
    if(response.ok) {
        alert("Certificate Successfully Issued to Blockchain!");
        // In handleIssue function added loadHistory()
        if (typeof loadHistory === "function") loadHistory();
    } else {
        alert("Error: " + result.message);
    }
}

// Handle Verification
async function handleVerify() {
    const certId = document.getElementById('verifyCertId').value.trim();

    if(!certId) {
        Swal.fire({ icon: 'warning', title: 'Input Required', text: 'Please enter a Certificate ID.' });
        return;
    }

    const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ cert_id: certId })
    });

    const data = await response.json();
    if(response.ok) {
        Swal.fire({
            icon: 'success',
            title: 'Certificate Verified ✅',
            html: `
                <div style="text-align: left; padding: 10px; border: 1px solid #eee; border-radius: 8px;">
                    <p><b>Student:</b> ${data.name}</p>
                    <p><b>Course:</b> ${data.course}</p>
                    <p><small><b>Status:</b> Validated on Blockchain</small></p>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Download PDF',
            cancelButtonText: 'Close',
            confirmButtonColor: '#2b6cb0'
        }).then((result) => {
            if (result.isConfirmed) {
                // We use the same PDF function we created earlier
                downloadPDF(data.name, data.course, certId);
            }
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Not Found',
            text: 'This certificate ID does not exist on the blockchain ledger.',
            confirmButtonColor: '#d33'
        });
    }
}

async function loadHistory() {
    const response = await fetch('/api/history');
    const data = await response.json();
    const body = document.getElementById('historyBody');
    body.innerHTML = ""; // Clear old rows

    data.reverse().forEach(tx => {
        const row = `<tr>
            <td>${tx.cert_id}</td>
            <td>${tx.name}</td>
            <td>${tx.course}</td>
            <td>#${tx.block}</td>
        </tr>`;
        body.innerHTML += row;
    });
}

// Call this on page load
window.onload = loadHistory;

function searchTable() {
    // Get the search string and convert to lowercase
    const input = document.getElementById("tableSearch");
    const filter = input.value.toLowerCase();
    const table = document.getElementById("historyTable");
    const tr = table.getElementsByTagName("tr");

    // Loop through all table rows (skipping the header)
    for (let i = 1; i < tr.length; i++) {
        let visible = false;
        const tds = tr[i].getElementsByTagName("td");
        
        // Check ID, Name, and Course columns for a match
        for (let j = 0; j < tds.length; j++) {
            if (tds[j] && tds[j].innerHTML.toLowerCase().indexOf(filter) > -1) {
                visible = true;
                break;
            }
        }
        
        // Show or hide the row based on the match
        tr[i].style.display = visible ? "" : "none";
    }
}

if(response.ok) {
    alert("Success!");
    loadHistory(); // Refresh the table
}

function downloadPDF(name, course, certId) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
    });

    // Design Elements
    doc.setDrawColor(43, 108, 176); // Blue color to match your UI
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190); 
    
    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(30);
    doc.setTextColor(43, 108, 176);
    doc.text("OFFICIAL DIGITAL RECORD", 148, 45, { align: "center" });

    // Main Text
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text("This document confirms the blockchain-verified achievement of", 148, 70, { align: "center" });

    doc.setFontSize(28);
    doc.setFont("times", "bolditalic");
    doc.text(name, 148, 90, { align: "center" });

    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text("for the successful completion of", 148, 110, { align: "center" });

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(course, 148, 125, { align: "center" });

    // Footer / Blockchain Metadata
    doc.setDrawColor(200, 200, 200);
    doc.line(40, 160, 257, 160);
    
    doc.setFontSize(10);
    doc.setFont("courier", "bold");
    doc.text(`VERIFICATION HASH: ${certId.toUpperCase()}`, 148, 170, { align: "center" });
    
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 100, 100);
    doc.text("This certificate is secured by a decentralized ledger and cannot be altered.", 148, 185, { align: "center" });

    doc.save(`Verified_Certificate_${certId}.pdf`);
}