# 🎨 UI Pages & Navigation Guide

## 📍 Page Structure

### 1. **Home Page** (`/`)
- **Purpose**: Landing page with betting platform introduction
- **Features**:
  - Hero section with platform description
  - 4 card grid linking to main sections:
    - Browse Models → `/validators/models`
    - Dashboard → `/dashboard`
    - Connect Wallet → `/wallet-test`
    - Get Started → `/login`
- **Navigation**: Available to all users (logged in or not)

### 2. **Models Page** (`/validators/models`)
- **Purpose**: Browse and bet on AI model merges
- **Features**:
  - Search and filter models by category (NLP, Vision, Audio, Multimodal)
  - View model details (accuracy, size, submission info)
  - **Merge ID** displayed for blockchain tracking
  - **Approve/Reject buttons** open betting modal
  - Voting progress bars
  - Wallet connection banner:
    - Not connected: Shows "Connect Your Wallet" alert
    - Connected: Shows "Ready to Bet" with reward info (+15%/-25%)
- **Key Components**:
  - `ModelsVoting` - Main component
  - `TokenStaking` - Betting modal (opens on Approve/Reject)
- **Navigation**: Accessible via navbar "Models" link

### 3. **Dashboard Page** (`/dashboard`)
- **Purpose**: Track betting activity and transaction history
- **Features**:
  - **Two tabs**:
    - **Overview Tab**: `BettingDashboard` component
      - Total bets placed
      - Win/loss statistics
      - Current MMT balance
      - Pending bets
    - **Transactions Tab**: `TransactionHistory` component
      - All betting transactions from blockchain
      - Etherscan links for each transaction
      - Filter by type (placed, won, lost)
  - **Wallet Required**: Shows alert if not connected
- **Navigation**: Accessible via navbar "Dashboard" link or home page card

### 4. **Wallet Test Page** (`/wallet-test`)
- **Purpose**: Debug and verify wallet connection
- **Features**:
  - Connection status display
  - Network validation (checks for Sepolia)
  - ETH and MMT balance display
  - Contract initialization status
  - Error messages with solutions
  - Quick start instructions
  - Contract info with Etherscan link
- **Use Case**: First-time setup and troubleshooting
- **Navigation**: Accessible via navbar "Wallet Test" link or home page card

### 5. **Login/Signup Pages** (`/login`, `/signup`)
- **Purpose**: User authentication
- **Features**:
  - Email/password authentication
  - OAuth providers (if configured)
- **Navigation**: Accessible via home page or navbar when not logged in

---

## 🧭 Navigation Bar

### Visible to All Users
- **Logo**: "GitRepo" with Book icon
- **Search Bar**: Search repositories (placeholder functionality)
- **Theme Toggle**: Dark/light mode switcher

### Logged In Users Only
- **NavBar Links** (desktop):
  - Models → `/validators/models`
  - Dashboard → `/dashboard`
  - Wallet Test → `/wallet-test`
- **Wallet Connect Button**:
  - Shows "Connect Wallet" when disconnected
  - Shows dropdown with address, ETH balance, MMT balance when connected
  - Includes "Disconnect" button
- **User Menu** (dropdown):
  - Profile
  - Settings
  - Sign Out

### Mobile Navigation
- Hamburger menu (Sheet component)
- Same links as desktop in mobile drawer

---

## 🔗 Component Connections

### Betting Flow
```
ModelsVoting → TokenStaking Modal → useModelStaking hook → Smart Contract
                                   ↓
                            Transaction submitted
                                   ↓
                            TransactionHistory (updates)
```

### Wallet Connection Flow
```
WalletConnectButton → useMetaMask hook → MetaMask Browser Extension
                           ↓
                    useContract hook → Smart Contract
                           ↓
                    Load balances (ETH + MMT)
```

### Page Hierarchy
```
Home (/)
├── Models (/validators/models)
│   └── Betting Modal (TokenStaking)
├── Dashboard (/dashboard)
│   ├── Overview Tab (BettingDashboard)
│   └── Transactions Tab (TransactionHistory)
├── Wallet Test (/wallet-test)
└── Login/Signup (/login, /signup)
```

---

## 🎯 Key Features by Page

| Page | Wallet Required? | Blockchain Interaction | Main Purpose |
|------|-----------------|----------------------|--------------|
| Home | ❌ No | ❌ No | Introduction & navigation |
| Models | ✅ Yes (for betting) | ✅ Yes (place bets) | Browse & bet on merges |
| Dashboard | ✅ Yes | ✅ Yes (read data) | Track betting stats |
| Wallet Test | ⚠️ Optional | ✅ Yes (test connection) | Debug & setup |
| Login/Signup | ❌ No | ❌ No | Authentication |

---

## 📱 Responsive Design

All pages are fully responsive:
- **Desktop**: Full navbar with all links, side-by-side layouts
- **Tablet**: Collapsed navigation, stacked cards
- **Mobile**: Hamburger menu, single column layouts

---

## 🚀 Quick Navigation Tips

1. **First Time Setup**:
   - Go to `/wallet-test` to verify MetaMask connection
   - Ensure you're on Sepolia network
   - Check balances before betting

2. **Placing Bets**:
   - Navigate to `/validators/models`
   - Filter by category if needed
   - Click "Approve" or "Reject" on pending models
   - Enter bet amount in modal

3. **Tracking Activity**:
   - Go to `/dashboard` to see all your bets
   - Switch to "Transactions" tab for blockchain history
   - Click Etherscan links to verify on-chain

4. **Troubleshooting**:
   - Visit `/wallet-test` for connection issues
   - Check navbar wallet button for network errors
   - See `METAMASK_TROUBLESHOOTING.md` for detailed help

---

## 🎨 UI Components Used

- **shadcn/ui components**:
  - Card, Button, Badge, Progress
  - Alert, Input, Dropdown Menu
  - Tabs, Sheet (mobile menu)
- **Custom components**:
  - WalletConnectButton
  - TokenStaking (betting modal)
  - BettingDashboard
  - TransactionHistory
  - ModelsVoting
- **Icons**: lucide-react

---

## 📝 Notes

- All blockchain interactions require MetaMask connection
- Sepolia testnet must be active (Chain ID: 11155111)
- Test ETH and MMT tokens required for betting
- Server wallet: `0x962a2afd14CF97fdD11824d4c4293607aA6f8013`
- Smart contract: `0x0878229B9903D0d31FF8e5e009072BC8666b3e3f`
