from web3 import Web3

# Ganache default address
ganache_url = "http://127.0.0.1:7545"
w3 = Web3(Web3.HTTPProvider(ganache_url))

if w3.is_connected():
    print("✅ Successfully connected to Ganache!")
    print(f"Available Accounts: {w3.eth.accounts}")
    print(f"Current Block: {w3.eth.block_number}")
else:
    print("❌ Connection Failed. Check if Ganache is running.")