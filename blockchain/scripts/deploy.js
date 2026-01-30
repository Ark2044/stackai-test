import hre from "hardhat";
import fs from "fs";
const { ethers } = hre;

async function main() {
  console.log("========================================");
  console.log("  ModelMergeStaking Deployment Script  ");
  console.log("========================================\n");
  
  // Get deployer account
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  const balance = await ethers.provider.getBalance(deployer.address);
  
  console.log("📋 Deployment Information:");
  console.log("  Network:", network.name, `(Chain ID: ${network.chainId})`);
  console.log("  Deployer:", deployer.address);
  console.log("  Balance:", ethers.formatEther(balance), "ETH\n");

  // Confirm sufficient balance
  const minBalance = ethers.parseEther("0.01"); // Minimum 0.01 ETH
  if (balance < minBalance) {
    console.error("❌ Error: Insufficient balance. Need at least 0.01 ETH");
    process.exit(1);
  }

  // Get contract factory and estimate deployment gas
  console.log("📝 Preparing ModelMergeStaking contract...");
  const ModelMergeStaking = await ethers.getContractFactory("ModelMergeStaking");
  
  // Estimate deployment cost
  const deploymentData = ModelMergeStaking.bytecode;
  const estimatedGas = await ethers.provider.estimateGas({
    data: deploymentData,
  });
  const feeData = await ethers.provider.getFeeData();
  const estimatedCost = estimatedGas * feeData.gasPrice;
  
  console.log("  Estimated Gas:", estimatedGas.toString());
  console.log("  Gas Price:", ethers.formatUnits(feeData.gasPrice, "gwei"), "gwei");
  console.log("  Estimated Cost:", ethers.formatEther(estimatedCost), "ETH\n");

  // Deploy ModelMergeStaking
  console.log("🚀 Deploying ModelMergeStaking...");
  const stakingToken = await ModelMergeStaking.deploy();
  
  console.log("⏳ Waiting for deployment confirmation...");
  await stakingToken.waitForDeployment();
  
  const contractAddress = await stakingToken.getAddress();
  console.log("✅ ModelMergeStaking deployed to:", contractAddress);

  // Get deployment transaction details
  const deployTx = stakingToken.deploymentTransaction();
  if (deployTx) {
    const receipt = await deployTx.wait();
    console.log("  Transaction Hash:", receipt.hash);
    console.log("  Block Number:", receipt.blockNumber);
    console.log("  Gas Used:", receipt.gasUsed.toString());
    console.log("  Actual Cost:", ethers.formatEther(receipt.gasUsed * receipt.gasPrice), "ETH\n");
  }

  // Verify initial state
  console.log("📊 Contract Initial State:");
  const tokenName = await stakingToken.name();
  const tokenSymbol = await stakingToken.symbol();
  const totalSupply = await stakingToken.totalSupply();
  const maxSupply = await stakingToken.MAX_SUPPLY();
  const owner = await stakingToken.owner();
  
  console.log("  Token Name:", tokenName);
  console.log("  Token Symbol:", tokenSymbol);
  console.log("  Initial Supply:", ethers.formatEther(totalSupply), "MMT");
  console.log("  Max Supply:", ethers.formatEther(maxSupply), "MMT");
  console.log("  Owner:", owner);
  console.log("  Deployer Balance:", ethers.formatEther(await stakingToken.balanceOf(deployer.address)), "MMT\n");

  // Save deployment information
  console.log("💾 Saving deployment information...");
  const deploymentInfo = {
    network: network.name,
    chainId: network.chainId.toString(),
    contract: {
      name: "ModelMergeStaking",
      address: contractAddress,
      deployer: deployer.address,
      transactionHash: deployTx?.hash || "N/A",
      blockNumber: deployTx ? (await deployTx.wait()).blockNumber : "N/A",
    },
    token: {
      name: tokenName,
      symbol: tokenSymbol,
      initialSupply: ethers.formatEther(totalSupply),
      maxSupply: ethers.formatEther(maxSupply),
    },
    timestamp: new Date().toISOString(),
    deploymentCost: deployTx ? ethers.formatEther((await deployTx.wait()).gasUsed * (await deployTx.wait()).gasPrice) : "N/A",
  };
  
  const filename = `deployment-${network.name}-${Date.now()}.json`;
  fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
  console.log("✅ Deployment info saved to:", filename);

  console.log("\n========================================");
  console.log("🎉 Deployment Completed Successfully!");
  console.log("========================================\n");

  // Verification instructions
  if (network.name === "sepolia" || network.chainId === 11155111n) {
    console.log("📝 Next Steps:");
    console.log("  1. Verify contract on Etherscan:");
    console.log(`     npx hardhat verify --network sepolia ${contractAddress}`);
    console.log("\n  2. View on Etherscan:");
    console.log(`     https://sepolia.etherscan.io/address/${contractAddress}\n`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });