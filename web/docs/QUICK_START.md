# 🚀 Quick Start Guide - Model Merge Betting System

## For End Users

### 1️⃣ Setup (One Time)
```bash
1. Install MetaMask: https://metamask.io/download/
2. Create/Import wallet in MetaMask
3. Switch to Sepolia Testnet:
   - Open MetaMask
   - Click network dropdown (top)
   - Select "Show test networks" in settings
   - Select "Sepolia Test Network"
4. Get test ETH: https://sepoliafaucet.com/
5. Contact admin for MMT test tokens
```

### 2️⃣ Connect Wallet
```bash
1. Open the web app
2. Login to your account
3. Click "Connect Wallet" in navbar
4. Approve MetaMask popup
5. View your balances in dropdown
```

### 3️⃣ Place Your First Bet
```bash
1. Navigate to Models page
2. Find a merge proposal
3. Click "Approve" or "Reject"
4. Enter bet amount (e.g., "10" for 10 MMT)
5. Review reward/penalty calculation
6. Click "Place Bet"
7. Confirm in MetaMask
8. Wait for confirmation ✅
```

### 4️⃣ Track Your Bets
```bash
- View transaction status in modal
- Check transaction history component
- Monitor balance updates in navbar
- Verify on Etherscan: https://sepolia.etherscan.io
```

## For Developers

### 🔧 Installation
```bash
cd web
npm install ethers@6 --legacy-peer-deps
```

### 📁 Key Files
```
web/src/
├── contracts/
│   ├── ModelMergeStakingABI.ts    # ABI for contract
│   └── config.ts                   # Network & address config
├── hooks/
│   ├── useContract.ts              # Contract connection
│   ├── useModelStaking.ts          # Betting logic
│   └── useMetaMask.ts              # Wallet connection
└── components/
    ├── wallet-connect-button.tsx   # Wallet UI
    ├── token-staking.tsx           # Betting modal
    ├── transaction-history.tsx     # TX viewer
    └── betting-dashboard.tsx       # Stats dashboard
```

### 🎯 Usage Examples

#### Connect to Contract
```typescript
import { useContract } from "~/hooks/useContract";

function MyComponent() {
  const { contract, balance, initializeContract } = useContract();
  
  useEffect(() => {
    initializeContract();
  }, []);
  
  return <div>Balance: {balance.mmt} MMT</div>;
}
```

#### Place a Bet
```typescript
import { useModelStaking } from "~/hooks/useModelStaking";

function BettingComponent() {
  const { placeBet, isProcessing } = useModelStaking();
  
  const handleBet = async () => {
    const result = await placeBet(
      1,          // mergeId
      "10.5",     // amount in MMT
      true        // prediction (true = approve, false = reject)
    );
    
    if (result.success) {
      console.log("Bet placed!", result.txHash);
    }
  };
  
  return (
    <button onClick={handleBet} disabled={isProcessing}>
      Place Bet
    </button>
  );
}
```

#### Check User Balance
```typescript
import { useContract } from "~/hooks/useContract";

const { balance } = useContract();
console.log(`MMT: ${balance.mmt}, ETH: ${balance.eth}`);
```

#### Get Merge Details
```typescript
import { useModelStaking } from "~/hooks/useModelStaking";

const { getMergeRequest } = useModelStaking();
const merge = await getMergeRequest(1);
console.log(merge);
// {
//   mergeId: "1",
//   totalStaked: "1000.5",
//   yesVotes: "50",
//   noVotes: "30",
//   finalized: false,
//   merged: false
// }
```

### 🔄 Update Contract Address
Edit `web/src/contracts/config.ts`:
```typescript
export const CONTRACT_CONFIG = {
  sepolia: {
    chainId: 11155111,
    contractAddress: "YOUR_NEW_ADDRESS_HERE",
    serverWallet: "YOUR_SERVER_WALLET_HERE",
    blockExplorer: "https://sepolia.etherscan.io",
  },
};
```

### 🎨 Add to UI

#### In any page:
```typescript
import { WalletConnectButton } from "~/components/wallet-connect-button";
import { BettingDashboard } from "~/components/betting-dashboard";
import { TransactionHistory } from "~/components/transaction-history";

export default function Page() {
  return (
    <div>
      <BettingDashboard />
      <TransactionHistory />
    </div>
  );
}
```

#### In voting modal:
```typescript
import { TokenStaking } from "~/components/token-staking";

<Modal>
  <ModalTrigger>Approve</ModalTrigger>
  <ModalBody>
    <TokenStaking 
      mergeId={1} 
      prediction={true}
      onSuccess={() => console.log("Bet placed!")}
    />
  </ModalBody>
</Modal>
```

## 🧪 Testing

### Local Testing
```bash
# Terminal 1: Start local Hardhat node
cd blockchain
npx hardhat node

# Terminal 2: Deploy contract
npx hardhat run scripts/deploy.js --network localhost

# Terminal 3: Start web app
cd web
npm run dev

# Update config.ts with local contract address
```

### Test on Sepolia
```bash
1. Get Sepolia ETH from faucet
2. Get MMT tokens from contract owner
3. Connect wallet in app
4. Place small test bet (1-5 MMT)
5. Check transaction on Etherscan
6. Wait for confirmation
```

## 📊 Smart Contract Functions

### Read Functions (Free)
```typescript
- balanceOf(address): Get MMT balance
- mergeRequests(id): Get merge details
- getStakeInfo(mergeId, address): Check if user staked
- validatorRewards(address): Get user rewards
- models(id): Get model details
```

### Write Functions (Costs Gas)
```typescript
- stakeOnMerge(mergeId, amount, prediction): Place bet
- createModel(modelURI): Create new model
- createMergeRequest(base, proposed): Create merge
```

## 🎯 Betting Rules

### Rewards & Penalties
- ✅ Correct prediction: **+15% reward**
- ❌ Wrong prediction: **-25% penalty**
- 🔒 Locked until 100 validators vote
- 🤖 Automatic distribution

### Validation
- ✅ Must have sufficient MMT balance
- ✅ Must have ETH for gas fees
- ✅ Cannot bet twice on same merge
- ✅ Cannot bet after finalization
- ✅ Amount must be > 0

## 🔐 Security

### Before Betting
- Verify contract address
- Check transaction details in MetaMask
- Never share private keys
- Use test networks for testing

### During Betting
- Double-check bet amount
- Confirm prediction (Approve/Reject)
- Review gas fee estimate
- Wait for confirmation

## 🆘 Common Issues

### "Insufficient MMT balance"
→ Get more MMT from admin or reduce bet amount

### "Transaction failed"
→ Check you have enough ETH for gas

### "Already staked"
→ You've already bet on this merge

### "Merge already finalized"
→ This merge voting has ended

### "Wrong network"
→ Switch to Sepolia in MetaMask

## 📈 What Happens Next?

1. **Your bet is recorded** on blockchain
2. **100 validators vote** (can take time)
3. **Merge finalizes automatically**
4. **Smart contract calculates** winner
5. **Rewards distributed** automatically
6. **Balance updates** in your wallet

## 🎉 Success Indicators

✅ Transaction confirmed on Etherscan  
✅ Balance updated in wallet dropdown  
✅ Transaction appears in history  
✅ "Place Bet" modal shows success message

## 📞 Support

- Check [WEB3_INTEGRATION.md](./WEB3_INTEGRATION.md) for detailed docs
- Review browser console for errors
- Verify transaction on Etherscan
- Contact support with transaction hash

---

**Ready to bet?** Connect your wallet and start now! 🚀
