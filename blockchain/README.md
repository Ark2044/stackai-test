# ModelMergeStaking Smart Contract

A decentralized ERC20-based staking system for AI model merging with validator voting mechanism. Built with Hardhat and Solidity 0.8.28, following 2026 industry standards.

## 🌟 Features

- **ERC20 Token**: ModelMergeToken (MMT) with 1M initial supply, 10M max supply
- **Decentralized Model Registry**: Upload and track AI models via IPFS
- **Merge Request System**: Propose merging of AI models with validator voting
- **Staking Mechanism**: Validators stake tokens to vote on merge proposals
- **Automated Rewards/Penalties**: 15% reward for correct votes, 25% penalty for incorrect
- **Emergency Controls**: Pausable contract with owner-controlled emergency functions
- **Security**: ReentrancyGuard, Ownable, and Pausable from OpenZeppelin v5.4.0

## 📋 Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** for version control
- **MetaMask** or similar Web3 wallet
- **Sepolia ETH** for testnet deployment ([Get testnet ETH](https://sepoliafaucet.com/))
- **Infura/Alchemy API Key** ([Get free key](https://infura.io/))
- **Etherscan API Key** for contract verification ([Get key](https://etherscan.io/apis))

## 🚀 Quick Start

### 1. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd blockchain

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Network Configuration
SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID

# Wallet Private Key (NEVER share or commit this!)
PRIVATE_KEY=your_wallet_private_key_here

# Etherscan API Key (for contract verification)
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# Optional: Enable gas reporting
REPORT_GAS=true
```

⚠️ **Security Warning**: Never commit your `.env` file. The `.gitignore` is configured to exclude it.

### 3. Compile Contracts

```bash
npm run compile
```

Expected output:
```
Compiled 1 Solidity file successfully
```

### 4. Run Tests (Optional)

```bash
# Run on local Hardhat network
npm test

# With gas reporting
REPORT_GAS=true npm test
```

## 🎯 Deployment

### Local Development Network

```bash
# Terminal 1: Start local node
npm run node

# Terminal 2: Deploy
npm run deploy:local
```

### Sepolia Testnet (Recommended for Testing)

1. **Ensure you have Sepolia ETH** (at least 0.01 ETH recommended)
2. **Verify your `.env` configuration**
3. **Deploy:**

```bash
npm run deploy:sepolia
```

The deployment script will:
- ✅ Display network and deployer information
- ✅ Estimate and show gas costs
- ✅ Deploy the ModelMergeStaking contract
- ✅ Verify initial token state
- ✅ Save deployment details to `deployment-sepolia-{timestamp}.json`

Example output:
```
========================================
  ModelMergeStaking Deployment Script  
========================================

📋 Deployment Information:
  Network: sepolia (Chain ID: 11155111)
  Deployer: 0x123...abc
  Balance: 0.05 ETH

🚀 Deploying ModelMergeStaking...
✅ ModelMergeStaking deployed to: 0x456...def

📊 Contract Initial State:
  Token Name: ModelMergeToken
  Token Symbol: MMT
  Initial Supply: 1000000.0 MMT
  Max Supply: 10000000.0 MMT
```

## ✅ Contract Verification

After deploying to Sepolia, verify your contract on Etherscan:

```bash
npm run verify
```

Or manually:
```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

## 📚 Contract Architecture

### Core Components

1. **ERC20 Token (MMT)**
   - Initial Supply: 1,000,000 MMT
   - Max Supply: 10,000,000 MMT
   - Mintable by owner (up to max supply)

2. **Model Registry**
   - Create models with IPFS URIs
   - Track model creators and metadata

3. **Merge Request System**
   - Propose merging two models
   - Requires 100 validator votes to finalize
   - Automatic finalization when threshold reached

4. **Staking & Voting**
   - Validators stake MMT tokens to vote
   - Vote YES (merge approved) or NO (merge rejected)
   - One validator, one vote per merge request

5. **Reward Distribution**
   - ✅ Correct votes: +15% reward
   - ❌ Incorrect votes: -25% penalty
   - Automatic distribution after finalization

### Security Features

- **ReentrancyGuard**: Prevents reentrancy attacks
- **Pausable**: Emergency pause functionality
- **Ownable**: Access-controlled admin functions
- **Input Validation**: Comprehensive checks on all user inputs

## 🔧 Available Commands

### Using NPM Scripts (Recommended - Shorter!)

```bash
# Compile contracts
npm run compile

# Run tests
npm test

# Deploy to localhost
npm run deploy:local

# Deploy to Sepolia
npm run deploy:sepolia

# Verify contract on Sepolia
npm run verify

# Start local node
npm run node

# Clean artifacts
npm run clean
```

### Using Hardhat CLI Directly

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to localhost
npx hardhat run scripts/deploy.js --network localhost

# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia

# Verify contract
npx hardhat run scripts/verify.js --network sepolia

# Start local node
npx hardhat node

# Clean artifacts
npx hardhat node

# Clean artifacts
npx hardhat clean
```

## 📁 Project Structure

```
blockchain/
├── contracts/
│   └── ModelMergeStaking.sol    # Main smart contract
├── scripts/
│   ├── deploy.js                # Deployment script
│   └── verify.js                # Verification script
├── hardhat.config.js            # Hardhat configuration
├── package.json                 # Dependencies
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```

## 🔐 Security Considerations

1. **Private Keys**: Never share or commit private keys
2. **Testnet First**: Always test on Sepolia before mainnet
3. **Audit**: Consider professional audit for mainnet deployment
4. **Access Control**: Owner has privileged functions (pause, mint)
5. **Token Economics**: Ensure contract has sufficient MMT for rewards

## 🐛 Troubleshooting

### "Insufficient funds" error
- Ensure your wallet has enough Sepolia ETH
- Get testnet ETH from [Sepolia Faucet](https://sepoliafaucet.com/)

### "Invalid API Key" error
- Verify your Infura/Alchemy API key in `.env`
- Check that the URL format is correct

### "Contract verification failed"
- Wait a few minutes after deployment
- Ensure ETHERSCAN_API_KEY is set in `.env`
- Try manual verification with constructor arguments

### Compilation errors
- Run `npx hardhat clean`
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## 📖 Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Ethereum Sepolia Testnet](https://sepolia.dev/)
- [Etherscan Sepolia](https://sepolia.etherscan.io/)

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## ⚠️ Disclaimer

This software is provided "as is" without warranty. Use at your own risk. This is not financial advice. Always conduct thorough testing and security audits before deploying to mainnet.

---

**Built with ❤️ using Hardhat, Solidity 0.8.28, and OpenZeppelin v5.4.0**
