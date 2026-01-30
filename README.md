# StackAI Model Merge Platform

A decentralized platform for collaborative AI model development with blockchain-based staking, federated learning, and version control.

## 🚀 Overview

StackAI enables collaborative machine learning model development through:
- **Blockchain-based staking** for model contributions and governance
- **Federated learning** for privacy-preserving model training
- **Git-like CLI** for model versioning and management
- **Web dashboard** for repository management and betting on model performance

## 📁 Project Structure

```
├── blockchain/        # Smart contracts (Solidity/Hardhat)
├── cli/              # Go-based CLI for model version control
├── fed-avg/          # Federated learning server and client (Python)
└── web/              # Next.js web application with Prisma ORM
```

## 🔧 Components

### Blockchain

Smart contracts for model merge staking and governance.

**Tech Stack:** Solidity, Hardhat, OpenZeppelin

```bash
cd blockchain
npm install
npx hardhat test
npx hardhat run scripts/deploy.js --network sepolia
```

See [blockchain/README.md](blockchain/README.md) for details.

### CLI

Command-line tool for managing AI models with Git-like commands.

**Tech Stack:** Go

**Commands:**
- `init` - Initialize a model repository
- `add` - Stage model changes
- `commit` - Commit model changes
- `branch` - Manage branches
- `merge` - Merge model branches
- `push` - Push to remote
- `checkout` - Switch branches

```bash
cd cli
go build -o modelctl main.go
./modelctl init
```

### Federated Learning

Privacy-preserving distributed model training.

**Tech Stack:** Python, Flower Framework

```bash
cd fed-avg
pip install -r requirements.txt
python server_with_save.py  # Start server
python client.py            # Start client
```

See [fed-avg/README.md](fed-avg/README.md) for details.

### Web Application

Full-stack Next.js application with authentication, repository management, and betting system.

**Tech Stack:** Next.js 14, TypeScript, Prisma, PostgreSQL, Redux, Tailwind CSS, Web3

**Features:**
- User authentication and profiles
- Repository creation and management
- Merge request workflows
- Betting on model performance
- Web3 wallet integration
- Real-time collaboration

```bash
cd web
npm install
npm run db:push        # Setup database
npm run dev            # Start development server
```

See [web/README.md](web/README.md) and documentation in `web/docs/` for more details.

## 🎯 Quick Start

### Prerequisites

- Node.js 18+
- Go 1.21+
- Python 3.9+
- PostgreSQL
- MetaMask or compatible Web3 wallet

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ark2044/stackai-test.git
   cd stackai-test
   ```

2. **Setup Blockchain**
   ```bash
   cd blockchain
   npm install
   ```

3. **Build CLI**
   ```bash
   cd cli
   go build -o modelctl main.go
   ```

4. **Setup Federated Learning**
   ```bash
   cd fed-avg
   pip install -r requirements.txt
   ```

5. **Setup Web App**
   ```bash
   cd web
   npm install
   cp .env.example .env.local  # Configure environment variables
   npm run db:push
   npm run dev
   ```

## 📚 Documentation

- [Quick Start Guide](web/docs/QUICK_START.md)
- [Web3 Integration](web/docs/WEB3_INTEGRATION.md)
- [Merge Request Guide](web/docs/MERGE_REQUEST_GUIDE.md)
- [State Management](web/docs/REDUX_STATE_MANAGEMENT.md)
- [Implementation Summary](web/docs/IMPLEMENTATION_SUMMARY.md)

## 🔑 Environment Variables

See individual component READMEs for required environment variables:
- Blockchain: Network RPC URLs, private keys
- Web: Database URL, NextAuth secret, Web3 provider

## 🧪 Testing

```bash
# Blockchain tests
cd blockchain && npx hardhat test

# Web tests
cd web && npm test

# CLI tests
cd cli && go test ./...
```

## 🚀 Deployment

- **Smart Contracts:** Deployed on Sepolia testnet (see `blockchain/deployment-sepolia-*.json`)
- **Web App:** Deploy to Vercel or similar platforms
- **CLI:** Distribute compiled binaries for different platforms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see LICENSE files in individual components.

## 🔗 Links

- [GitHub Repository](https://github.com/Ark2044/stackai-test)
- [Contract Deployment](blockchain/deployment-sepolia-1769331723703.json)

## 💡 Architecture

The platform integrates four key components:

1. **Smart Contracts** handle staking, rewards, and governance
2. **CLI Tool** provides Git-like version control for AI models
3. **Federated Learning** enables distributed, privacy-preserving training
4. **Web Dashboard** offers a user-friendly interface for all operations

Models are versioned using the CLI, trained using federated learning, and contributions are tracked on-chain for transparent reward distribution.

---

Built with ❤️ for decentralized AI collaboration
