import { run } from "hardhat";
import fs from "fs";

async function main() {
  console.log("========================================");
  console.log("  Contract Verification Script  ");
  console.log("========================================\n");

  // Read deployment info from the latest deployment file
  const files = fs.readdirSync('.')
    .filter(f => f.startsWith('deployment-') && f.endsWith('.json'))
    .sort()
    .reverse();

  if (files.length === 0) {
    console.error("❌ Error: No deployment files found. Please deploy first.");
    process.exit(1);
  }

  const latestFile = files[0];
  console.log("📄 Reading deployment info from:", latestFile);
  
  const deploymentInfo = JSON.parse(fs.readFileSync(latestFile, 'utf8'));
  const contractAddress = deploymentInfo.contract.address;
  const network = deploymentInfo.network;

  console.log("  Network:", network);
  console.log("  Contract Address:", contractAddress);
  console.log("");

  // Verify only on public networks
  if (network === "hardhat" || network === "localhost") {
    console.log("⚠️  Skipping verification - local network detected");
    console.log("   Verification is only available for public networks (Sepolia, Mainnet, etc.)");
    process.exit(0);
  }

  try {
    console.log("🔍 Verifying contract on Etherscan...");
    console.log("⏳ This may take a few moments...\n");

    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [], // ModelMergeStaking has no constructor arguments
    });

    console.log("\n✅ Contract verified successfully!");
    console.log(`   View on Etherscan: https://${network}.etherscan.io/address/${contractAddress}#code`);
    
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ Contract is already verified!");
      console.log(`   View on Etherscan: https://${network}.etherscan.io/address/${contractAddress}#code`);
    } else {
      console.error("❌ Verification failed:", error.message);
      process.exit(1);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
