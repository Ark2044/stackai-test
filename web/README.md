# StackAI Web Application

The web dashboard for StackAI - a decentralized platform for collaborative AI model development with blockchain-based betting on model merges.

## 🚀 Features

### Model Merge Betting
- **Browse Models** - View AI model merge proposals with detailed metrics
- **Place Bets** - Stake MMT tokens to approve or reject model merges
- **Earn Rewards** - Win +15% on successful predictions, risk -25% on incorrect ones
- **Track Performance** - Dashboard with betting statistics and transaction history

### Web3 Integration
- **MetaMask Connection** - Seamless wallet integration
- **Sepolia Testnet** - Deployed smart contracts for testing
- **Real-time Updates** - Live blockchain transaction tracking
- **Etherscan Links** - Direct links to transaction details

### Repository Management
- **Create Repositories** - Initialize new AI model repositories
- **Merge Requests** - Submit and review model changes
- **Collaboration** - Team-based model development

## 🛠 Tech Stack

- [Next.js 16](https://nextjs.org) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type-safe development
- [Prisma](https://prisma.io) - Database ORM with driver adapters
- [NeonDB](https://neon.tech/) - Serverless PostgreSQL database
- [NextAuth.js](https://next-auth.js.org) - Authentication
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [ethers.js](https://docs.ethers.org/) - Ethereum library

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Betting dashboard
│   ├── validators/        # Model voting pages
│   └── ...
├── components/
│   ├── betting/           # TokenStaking, BettingDashboard
│   ├── wallet/            # WalletConnectButton, TransactionHistory
│   ├── repository/        # Repo management components
│   └── ui/                # Reusable UI components
├── contracts/             # Smart contract ABI & config
├── hooks/                 # React hooks (useWallet, useContract, etc.)
├── store/                 # Redux store & slices
└── lib/                   # Utility functions
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- NeonDB account (serverless PostgreSQL)
- MetaMask browser extension

### Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Copy environment variables
cp .env.example .env.local

# Setup database
npm run db:push

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file with:

```env
# NeonDB Connection String
DATABASE_URL="postgresql://user:password@ep-xxx.region.neon.tech/neondb?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

> Get your DATABASE_URL from [Neon Console](https://console.neon.tech/)

## 📖 Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with platform overview |
| `/validators/models` | Browse and bet on model merges |
| `/dashboard` | View betting stats and transactions |
| `/wallet-test` | Debug wallet connection |
| `/repo/[name]` | Repository details |
| `/merge/[id]` | Merge request details |

## 🔗 Web3 Setup

1. Install [MetaMask](https://metamask.io/)
2. Switch to **Sepolia Testnet**
3. Get test ETH from a [Sepolia faucet](https://sepoliafaucet.com/)
4. Connect wallet via the navbar button

## 📚 Documentation

Detailed documentation in the `docs/` folder:

- [Quick Start Guide](docs/QUICK_START.md)
- [Web3 Integration](docs/WEB3_INTEGRATION.md)
- [Merge Request Guide](docs/MERGE_REQUEST_GUIDE.md)
- [Redux State Management](docs/REDUX_STATE_MANAGEMENT.md)
- [UI Pages Guide](docs/UI_PAGES_GUIDE.md)
- [Implementation Summary](docs/IMPLEMENTATION_SUMMARY.md)

## 🧪 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Type checking
npm run typecheck
```

## 🗄️ Database (Prisma + NeonDB)

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes to NeonDB (no migrations)
npm run db:push

# Create and apply migrations (development)
npm run db:migrate

# Deploy migrations (production)
npm run db:migrate:deploy

# Reset database and reapply migrations
npm run db:reset

# Seed database with initial data
npm run db:seed

# Open Prisma Studio (visual database browser)
npm run db:studio
```

> **Note**: This project uses Prisma with the NeonDB serverless driver adapter (`@prisma/adapter-neon`).

## 📄 License

MIT License - see LICENSE for details

---

Built with ❤️ as part of the StackAI platform
