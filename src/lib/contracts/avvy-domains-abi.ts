// ABI for Avvy Domains Contract
export const AVVY_DOMAINS_ABI = [
  // Domain expiry functions
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "domainHash",
        "type": "bytes32"
      }
    ],
    "name": "expiryOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  // Domain renewal function
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "domainHash",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "newExpiry",
        "type": "uint256"
      }
    ],
    "name": "renewDomain",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  // Other potential functions that might be in the contract
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "domainHash",
        "type": "bytes32"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "domainHash",
        "type": "bytes32"
      }
    ],
    "name": "exists",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];