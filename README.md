# 🎓 Blockchain Certificate Verification System

A Full-Stack Decentralized Application (DApp) that allows educational institutions to issue tamper-proof certificates on an Ethereum-based blockchain.

## 🚀 Overview
This system solves the problem of certificate forgery. By storing a unique "fingerprint" (hash) of each certificate on a distributed ledger, any third party can verify the authenticity of a credential without needing to contact the issuing institution.

### Key Features
* **Immutable Ledger:** Certificates are stored on the blockchain using Solidity Smart Contracts.
* **Duplicate Prevention:** Built-in logic to prevent issuing multiple certificates with the same ID.
* **Real-time Search:** A live transaction table to monitor all blockchain activities.
* **PDF Generation:** Instantly generate and download professional certificates via `jsPDF`.
* **Address Validation:** Secure backend checks to ensure recipient addresses are valid Ethereum identities.
* **Modern UI:** Responsive design with SweetAlert2 popups for a smooth user experience.

---

## 🛠️ Tech Stack
* **Blockchain:** Solidity, Ganache (Local Ethereum Network)
* **Backend:** Python 3.12, Flask, Web3.py
* **Frontend:** HTML5, CSS3, JavaScript (ES6)
* **Libraries:** SweetAlert2 (Modals), jsPDF (PDF Generation)

---

## 📦 Installation & Setup

### 1. Prerequisites
* [Node.js](https://nodejs.org/) (for optional frontend tools)
* [Python 3.12+](https://www.python.org/downloads/)
* [Ganache GUI](https://trufflesuite.com/ganache/)

### 2. Clone and Install Dependencies
```bash
pip install flask web3 eth-utils requests

3. Blockchain Setup
Open Ganache and select "Quickstart".
Ensure the RPC Server is running at http://127.0.0.1:7545.
Deploy the Smart Contract:
python contract_deploy.py

4. Run the Application
python app.py
Open your browser and navigate to http://127.0.0.1:5000

5. Usage
Issue: Enter the Recipient's Ethereum Address (copy from Ganache), a unique Certificate ID, Student Name, and Course.

Verify: Enter a Certificate ID in the "Verify" tab. If valid, the system retrieves the data from the blockchain.

Download: Click the "Download PDF" button in the success popup to get your digital certificate.