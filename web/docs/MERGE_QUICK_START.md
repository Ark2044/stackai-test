# Quick Start: Creating Your First Merge Request

## Prerequisites
- MetaMask installed and configured
- Connected to Sepolia testnet
- Some Sepolia ETH for gas fees
- Wallet connected to the app

## Option 1: Quick Test (Using Existing Models)

### Step 1: Navigate to Merge Page
```
http://localhost:3000/merge
```

### Step 2: Select "Use Existing Models" Tab

### Step 3: Enter Model IDs
- **Base Model ID**: Enter an existing model ID (e.g., `1`)
- **Proposed Model ID**: Enter another existing model ID (e.g., `2`)

### Step 4: Verify Models
Click the **"Verify Models"** button to check if both models exist on-chain.

You should see:
- ✅ Model verified
- URI and Creator address displayed

### Step 5: Create Merge Request
Click **"Create Merge Request"**

MetaMask will pop up → Confirm the transaction

Wait for confirmation (15-30 seconds on Sepolia)

Success! You'll see:
- ✅ Merge request created successfully!
- Merge ID: 42 (your unique merge ID)
- [View on Etherscan] link

## Option 2: Complete Flow (Creating New Models)

### Step 1: Navigate to Merge Page
```
http://localhost:3000/merge
```

### Step 2: Select "Upload New Models" Tab

### Step 3: Enter Model URIs

**For testing, you can use sample URIs:**

Base Model URI:
```
ipfs://QmBaseModel-v1.0.0-test
```

Proposed Model URI:
```
ipfs://QmProposedModel-v1.1.0-improved
```

Or use HTTP URLs:
```
https://example.com/models/base-resnet50.pth
https://example.com/models/proposed-resnet50-optimized.pth
```

### Step 4: Submit
Click **"Create Models & Merge Request"**

The system will:
1. Create base model → Transaction 1 ⏳
2. Create proposed model → Transaction 2 ⏳
3. Create merge request → Transaction 3 ⏳

Each step requires MetaMask confirmation.

Total time: ~1-2 minutes on Sepolia

Success message:
```
✅ Models created and merge request submitted!
Base Model ID: 5
Proposed Model ID: 6
Merge ID: 3
[View transaction on Etherscan]
```

## What Happens Next?

Your merge request is now live! 🎉

### View in Models Page
Navigate to:
```
/validators/models
```

Find your merge request by searching for the Merge ID.

### Validators Can Vote
Other users can:
- View your merge request
- Stake MMT tokens
- Vote Accept or Reject
- Earn rewards when finalization occurs

### Finalization
- Requires 100 validator votes
- Majority vote determines outcome
- Winners get rewards, losers get penalties

## Common Issues & Solutions

### ❌ "Contract not initialized"
**Solution:** 
- Check MetaMask is connected
- Click "Connect Wallet" button
- Refresh page

### ❌ "Wrong network"
**Solution:**
- Open MetaMask
- Switch to Sepolia Testnet
- Refresh page

### ❌ "Model does not exist"
**Solution:**
- Double-check model ID
- Use "Verify Models" button first
- Ensure model was created successfully

### ❌ "Insufficient funds"
**Solution:**
- Get Sepolia ETH from faucet:
  - https://sepoliafaucet.com/
  - https://faucet.quicknode.com/ethereum/sepolia
- Need ~0.01 ETH for gas

### ❌ Transaction failed
**Solution:**
- Check gas settings in MetaMask
- Ensure you approved the transaction
- Try again with higher gas limit

## Testing Checklist

- [ ] Wallet connected
- [ ] On Sepolia network  
- [ ] Have Sepolia ETH
- [ ] Tab 1: Verify existing models works
- [ ] Tab 1: Create merge request succeeds
- [ ] Tab 2: Create new models and merge request
- [ ] Merge ID displayed
- [ ] View transaction on Etherscan
- [ ] Can see merge request in /validators/models

## Production Best Practices

### Use IPFS for Model Storage

```bash
# Install IPFS CLI or use Pinata/Infura

# Upload model to IPFS
ipfs add model-v1.pth
# Output: QmX1234abcd...

# Use full URI
ipfs://QmX1234abcd...
```

### Model Naming Convention
```
ipfs://Qm[ModelName]-v[Version]-[Description]

Examples:
ipfs://QmResNet50-v1.0.0-baseline
ipfs://QmResNet50-v1.1.0-pruned-20pct
ipfs://QmBERT-v2.0.0-finetuned-squad
```

### Add Metadata
Store metadata JSON alongside model:
```json
{
  "name": "ResNet50 Optimized",
  "version": "1.1.0",
  "base_version": "1.0.0",
  "changes": "Pruned 20% parameters, quantized to INT8",
  "accuracy": 0.941,
  "model_uri": "ipfs://QmX123...",
  "timestamp": "2026-01-28T12:00:00Z"
}
```

## Next Steps

1. **Share your Merge ID** with the community
2. **Wait for validators** to stake and vote
3. **Monitor progress** on the models page
4. **Engage with feedback** from validators

## Support

Having trouble? Check:
- Browser console for errors (F12)
- MetaMask activity tab
- Etherscan for transaction details
- Documentation in `/web/docs/MERGE_REQUEST_GUIDE.md`

## Example Complete Workflow

```
User: Alice
Goal: Merge improved ResNet50

1. Alice trains improved model
2. Alice uploads to IPFS → QmNewModel123
3. Alice has base model → Model ID #5
4. Alice goes to /merge
5. Alice enters:
   - Base: 5
   - Proposed URI: ipfs://QmNewModel123
6. Alice creates new proposed model → Model ID #12
7. Alice creates merge request → Merge ID #7
8. Bob (validator) sees Merge #7
9. Bob stakes 10 MMT, votes Accept
10. Charlie stakes 8 MMT, votes Reject
11. ... 98 more validators vote
12. Merge finalizes → Accept wins!
13. Bob and other Accept voters get rewards
14. Alice's model is officially merged
```

Happy merging! 🚀
