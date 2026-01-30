# Model Merge Request System

## Overview

The merge request system allows users to propose merging two models on-chain. Validators can then stake tokens to vote on whether the merge should be accepted or rejected.

## Accessing the Merge Page

Navigate to `/merge` or click "Merge Request" in the navigation menu.

## Two Ways to Create a Merge Request

### Option 1: Use Existing On-Chain Models

This option is best when you already have models registered on the blockchain.

1. **Select "Use Existing Models" tab**
2. **Enter Model IDs:**
   - **Base Model ID (Mx)**: The original model that serves as the foundation
   - **Proposed Model ID (My)**: The model containing changes you want to merge
3. **Verify Models**: Click "Verify Models" to check if both models exist on-chain
4. **Create Merge Request**: Once verified, click "Create Merge Request"

**Example:**
- Base Model ID: `1` (Your main production model)
- Proposed Model ID: `5` (Updated model with improvements)

### Option 2: Upload New Models

This option allows you to upload new models and create a merge request in one transaction flow.

1. **Select "Upload New Models" tab**
2. **Enter Model URIs:**
   - **Base Model URI**: IPFS hash or URL for the base model
   - **Proposed Model URI**: IPFS hash or URL for the proposed model
3. **Submit**: Click "Create Models & Merge Request"

The system will:
- Create the base model on-chain
- Create the proposed model on-chain
- Create a merge request linking them

**Example URIs:**
- IPFS: `QmX1234...` or `ipfs://QmX1234...`
- HTTP: `https://example.com/models/base-v1.pth`
- S3: `s3://bucket/models/proposed-v2.pth`

## How Model URIs Work

### IPFS (Recommended for Production)

IPFS (InterPlanetary File System) is the recommended way to store models:

```
ipfs://QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG
```

**Benefits:**
- Decentralized storage
- Content-addressed (URI = hash of content)
- Permanent and immutable
- Cannot be changed or deleted

**Example IPFS Upload Flow:**
1. Upload model to IPFS using Pinata, Infura, or local node
2. Get IPFS CID (e.g., `QmYwAPJz...`)
3. Use full URI: `ipfs://QmYwAPJz...` or just the CID

### HTTP URLs (Development/Testing)

For development, you can use standard HTTP URLs:

```
https://storage.example.com/models/my-model-v1.pth
https://huggingface.co/username/model/resolve/main/model.bin
```

**Note:** HTTP URLs are mutable and depend on centralized servers.

### Other URI Schemes

- **S3**: `s3://my-bucket/models/model.pth`
- **HTTPS**: `https://example.com/model.safetensors`
- **Arweave**: `ar://...`

## What Happens After Submission?

1. **Transaction Submission**: Your merge request is submitted to the blockchain
2. **Merge ID Assignment**: A unique Merge ID is generated (e.g., Merge ID: 42)
3. **Validator Voting**: Validators can stake tokens to vote Accept/Reject
4. **Finalization**: After 100 validator votes, the merge is finalized
5. **Rewards/Penalties**: Validators on the winning side get rewards

## Smart Contract Functions

### `createModel(string memory modelURI)`
Creates a new model on-chain.
- **Parameters**: Model URI (IPFS hash or URL)
- **Returns**: Model ID (uint256)
- **Event**: `ModelCreated(modelId, creator, modelURI)`

### `createMergeRequest(uint256 baseModelId, uint256 proposedModelId)`
Creates a merge request between two existing models.
- **Parameters**: 
  - `baseModelId`: The original model ID
  - `proposedModelId`: The model to merge
- **Returns**: Merge ID (uint256)
- **Event**: `MergeRequested(mergeId, baseModelId, proposedModelId)`

## Validator Voting

Once a merge request is created, validators can vote:

1. Go to the Models/Voting page
2. Find the merge request by ID
3. Stake tokens and select Accept or Reject
4. Wait for finalization (100 votes required)

## Best Practices

### Model Naming Convention

Use semantic versioning in your model URIs:

```
ipfs://QmBaseModel-v1.0.0
ipfs://QmBaseModel-v1.1.0-improved
```

### Model Metadata

Consider storing metadata alongside your models:

```json
{
  "model_uri": "ipfs://QmX...",
  "version": "1.0.0",
  "architecture": "ResNet50",
  "training_data": "ImageNet",
  "accuracy": 0.94,
  "size_mb": 102,
  "framework": "PyTorch 2.0"
}
```

### Testing Flow

1. **Development**: Use HTTP URLs for quick iterations
2. **Staging**: Upload to IPFS, test merge requests
3. **Production**: Use permanent IPFS storage with pinning services

## Gas Costs

Approximate gas costs on Sepolia:

- **Create Model**: ~100,000 gas (~0.002 ETH)
- **Create Merge Request**: ~150,000 gas (~0.003 ETH)
- **Both + Merge Request**: ~350,000 gas (~0.007 ETH)

## Troubleshooting

### "Model does not exist"
- Double-check the model ID
- Ensure the model was successfully created on-chain
- Use "Verify Models" button to check

### "Transaction failed"
- Check if you have enough ETH for gas
- Ensure you're connected to Sepolia network
- Verify your wallet has approved the transaction

### "Contract not initialized"
- Check MetaMask is connected
- Switch to Sepolia network
- Refresh the page

## Example Workflow

### Complete Flow: Upload to Vote

```
1. User uploads model to IPFS → Gets CID: QmX123
2. User creates base model → Model ID: 10
3. User uploads improved model → Gets CID: QmY456
4. User creates proposed model → Model ID: 11
5. User creates merge request → Merge ID: 5
6. Validators stake and vote on Merge ID 5
7. After 100 votes, merge finalizes
8. Winning validators receive rewards
```

## Security Considerations

- **Verify URIs**: Always verify model URIs point to correct content
- **IPFS Pinning**: Ensure IPFS content is pinned to prevent loss
- **Model Validation**: Validate model integrity before merging
- **Test First**: Test on Sepolia before mainnet deployment

## API Integration

For programmatic access:

```typescript
import { ethers } from "ethers";
import { ModelMergeStakingABI, getContractConfig } from "~/contracts/config";

// Create merge request
const contract = new ethers.Contract(address, ABI, signer);
const tx = await contract.createMergeRequest(baseId, proposedId);
const receipt = await tx.wait();

// Extract merge ID from events
const event = receipt.logs.find(log => {
  const parsed = contract.interface.parseLog(log);
  return parsed?.name === "MergeRequested";
});
```

## Support

For issues or questions:
- Check the console for error messages
- Verify network connectivity
- Ensure contract address is correct
- Contact team if issues persist
