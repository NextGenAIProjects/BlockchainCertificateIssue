import json
import sys
from web3 import Web3
from solcx import compile_standard, install_solc

try:
    from solcx import compile_standard, install_solc
except ImportError:
    print("❌ Library not found. Try running: pip3 install py-solc-x")
    sys.exit()

# Force installation of the Solidity compiler if it's missing
print("Setting up Solidity compiler...")
try:
    install_solc("0.8.0")
except Exception as e:
    print(f"Note: solc might already be installed or had this issue: {e}")

# 1. Load and Compile
with open("CertificateRegistry.sol", "r") as file:
    contract_source = file.read()

compiled_sol = compile_standard({
    "language": "Solidity",  # <--- Must be Capital 'S'
    "sources": {"CertificateRegistry.sol": {"content": contract_source}},
    "settings": {
        "outputSelection": {
            "*": {
                "*": ["abi", "evm.bytecode"]
            }
        }
    }
}, solc_version="0.8.0")

# 2. Extract ABI and Bytecode
abi = compiled_sol['contracts']['CertificateRegistry.sol']['CertificateRegistry']['abi']
bytecode = compiled_sol['contracts']['CertificateRegistry.sol']['CertificateRegistry']['evm']['bytecode']['object']

# 3. Connect to Ganache
w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:7545'))
admin_account = w3.eth.accounts[0]

# 4. Deploy Contract
print("Deploying Contract...")
CertificateContract = w3.eth.contract(abi=abi, bytecode=bytecode)
tx_hash = CertificateContract.constructor().transact({'from': admin_account})
tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

contract_address = tx_receipt.contractAddress
print(f"✅ Contract Deployed at: {contract_address}")

# 5. Seed Initial Data (Issue a Test Certificate)
print("Issuing Test Certificate: CERT-2025-001...")
contract_instance = w3.eth.contract(address=contract_address, abi=abi)
tx_issue = contract_instance.functions.issueCertificate(
    "CERT-2025-001", 
    "John Doe", 
    "Blockchain Engineering"
).transact({'from': admin_account})
w3.eth.wait_for_transaction_receipt(tx_issue)

# 6. Save Config for app.py
config = {
    "contract_address": contract_address,
    "abi": abi
}
with open("config.json", "w") as f:
    json.dump(config, f)

print("🚀 Deployment Complete. Config saved to config.json")