# Web3 Model Merge Betting System - Integration Guide

## 🎯 Overview

Your betting system is now fully integrated! Users can place bets on model merge predictions using MetaMask and MMT tokens, with automatic reward/penalty distribution handled by the smart contract.

## ✅ What's Been Implemented

### 1. **Smart Contract Integration**
- ✅ Contract ABI configured
- ✅ Sepolia testnet deployment connected
- ✅ Server wallet: `0x962a2afd14CF97fdD11824d4c4293607aA6f8013`
- ✅ Contract address: `0x0878229B9903D0d31FF8e5e009072BC8666b3e3f`

### 2. **Wallet Connection**
- ✅ MetaMask integration
- ✅ Automatic contract initialization
- ✅ Real-time balance updates (ETH & MMT)
- ✅ Network switching detection

### 3. **Betting System**
- ✅ Place bets on merge predictions (Approve/Reject)
- ✅ Automatic token transfer to contract
- ✅ Win: +15% reward automatically transferred
- ✅ Lose: -25% penalty kept by server wallet
- ✅ Bet validation and error handling

### 4. **User Interface**
- ✅ Wallet connect button in navbar
- ✅ Balance display (ETH + MMT tokens)
- ✅ Betting modal with prediction selection
- ✅ Transaction status tracking
- ✅ Transaction history viewer
- ✅ Real-time bet amount calculations

## 🚀 How to Use

### For Users:

1. **Connect Wallet**
   - Click "Connect Wallet" button in navbar
   - Approve MetaMask connection
   - Switch to Sepolia testnet if prompted

2. **Place a Bet**
   - Browse model merge proposals
   - Click "Approve" or "Reject" button
   - Enter bet amount in MMT tokens
   - Review potential rewards/penalties
   - Click "Place Bet"
   - Confirm transaction in MetaMask

3. **Track Bets**
   - View transaction status in real-time
   - Check transaction history
   - See confirmed bets on blockchain

4. **Receive Rewards**
   - Automatic after 100 validators vote
   - Win: +15% transferred to your wallet
   - Lose: -25% transferred to server wallet

### For Developers:

#### Files Created:
```
web/src/
├── contracts/
│   ├── ModelMergeStakingABI.ts    # Contract ABI
│   └── config.ts                   # Contract configuration
├── hooks/
│   ├── useContract.ts              # Contract connection hook
│   ├── useModelStaking.ts          # Betting functions hook
│   └── useMetaMask.ts              # Wallet connection hook
└── components/
    ├── wallet-connect-button.tsx   # Wallet UI
    ├── token-staking.tsx           # Betting modal
    └── transaction-history.tsx     # Transaction viewer
```

#### Key Functions:

**useContract Hook:**
```typescript
const { contract, balance, initializeContract, refreshBalances } = useContract();
```

**useModelStaking Hook:**
```typescript
const { placeBet, isProcessing, txStatus } = useModelStaking();

// Place a bet
await placeBet(mergeId, "10.5", true); // Bet 10.5 MMT on approve
```

**useMetaMask Hook:**
```typescript
const { account, isConnected, connect, disconnect } = useMetaMask();
```

## 📊 How the System Works

### Betting Flow:
1. User clicks Approve/Reject on a model merge
2. Modal opens with betting form
3. User enters MMT amount to bet
4. `stakeOnMerge()` called on smart contract
5. Tokens transferred from user → contract
6. Vote recorded (yes/no)
7. After 100 votes, merge finalizes automatically
8. Rewards/penalties distributed:
   - Correct prediction: +15% reward
   - Wrong prediction: -25% penalty to server

### Smart Contract Logic:
```solidity
stakeOnMerge(mergeId, amount, prediction)
├── Validates merge not finalized
├── Transfers MMT tokens to contract
├── Records vote (yes/no)
├── Increments vote count
└── Auto-finalizes at 100 votes
    ├── Distributes rewards to winners
    └── Keeps penalties in contract (for server)
```

## 🔧 Configuration

### Current Setup (Sepolia Testnet):
- **Network:** Sepolia Testnet (Chain ID: 11155111)
- **Contract:** `0x0878229B9903D0d31FF8e5e009072BC8666b3e3f`
- **Server Wallet:** `0x962a2afd14CF97fdD11824d4c4293607aA6f8013`
- **Token:** MMT (ModelMergeToken)
- **Block Explorer:** https://sepolia.etherscan.io

### To Change Networks:
Edit `web/src/contracts/config.ts`:
```typescript
export const NETWORK = "sepolia"; // Change to "localhost" or "mainnet"
```

## 🧪 Testing

### Requirements:
1. MetaMask browser extension
2. Sepolia testnet ETH (for gas)
3. MMT tokens (get from contract owner)

### Get Test Tokens:
1. **Sepolia ETH:** https://sepoliafaucet.com/
2. **MMT Tokens:** Contact contract owner or use mint function

### Test Betting:
1. Connect wallet with test ETH & MMT
2. Navigate to model voting page
3. Click Approve/Reject on any model
4. Enter small test amount (e.g., 1 MMT)
5. Confirm transaction
6. Check transaction on Etherscan

## 📱 UI Components

### Wallet Connect Button
Shows in navbar after login. Displays:
- Shortened wallet address
- ETH balance
- MMT token balance
- Disconnect option

### Betting Modal
Appears when clicking Approve/Reject:
- Current balance display
- Bet amount input
- Reward/penalty calculation
- Transaction status
- Success/error messages

### Transaction History
Shows all user's betting transactions:
- Bet amount and prediction
- Transaction hash with Etherscan link
- Status (pending/confirmed/failed)
- Timestamp

## 🎨 Customization

### Add More Models:
In `models-voting.tsx`, add to the `models` array:
```typescript
{
  id: "3",
  mergeId: 3, // Must match blockchain merge ID
  name: "Your Model",
  // ... other properties
}
```

### Create Merge Requests:
Use the `createMergeRequest` function:
```typescript
const { createMergeRequest } = useModelStaking();
await createMergeRequest(baseModelId, proposedModelId);
```

## 🔒 Security Notes

- ✅ All transactions require MetaMask approval
- ✅ Contract validates all inputs
- ✅ ReentrancyGuard prevents attacks
- ✅ Only owner can mint tokens
- ✅ Bets locked until finalization
- ⚠️ Currently on testnet - DO NOT use real funds

## 📈 Next Steps

### Recommended Enhancements:
1. **Real-time Updates:** Add WebSocket for live bet updates
2. **Notifications:** Toast notifications for transaction status
3. **History Export:** Download transaction history as CSV
4. **Leaderboard:** Show top validators/winners
5. **Analytics Dashboard:** Visualize betting statistics
6. **Mobile Responsive:** Optimize for mobile wallets

### Production Checklist:
- [ ] Audit smart contract
- [ ] Deploy to mainnet
- [ ] Set up backend API for caching
- [ ] Add error tracking (Sentry)
- [ ] Implement rate limiting
- [ ] Add transaction retry logic
- [ ] Set up monitoring/alerts

## 🆘 Troubleshooting

### "MetaMask not installed"
- Install MetaMask browser extension
- Refresh page after installation

### "Switch to Sepolia Network"
- Open MetaMask
- Click network dropdown
- Select "Sepolia Test Network"

### "Insufficient MMT balance"
- Get test MMT from contract owner
- Or reduce bet amount

### "Transaction failed"
- Check you have enough ETH for gas
- Ensure you haven't already bet on this merge
- Verify merge hasn't been finalized

### "Wrong network"
- Contract expects Sepolia testnet
- Switch network in MetaMask

## 🔗 Useful Links

- **Contract on Etherscan:** https://sepolia.etherscan.io/address/0x0878229B9903D0d31FF8e5e009072BC8666b3e3f
- **Sepolia Faucet:** https://sepoliafaucet.com/
- **MetaMask Docs:** https://docs.metamask.io/
- **Ethers.js Docs:** https://docs.ethers.org/v6/

## 💡 Support

For issues or questions:
1. Check transaction on Etherscan
2. Review browser console for errors
3. Verify MetaMask is connected
4. Ensure sufficient token balances

---

**Status:** ✅ Fully Functional
**Last Updated:** January 27, 2026
**Version:** 1.0.0
