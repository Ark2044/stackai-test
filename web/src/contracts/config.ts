import { ModelMergeStakingABI } from "./ModelMergeStakingABI";

// Contract deployment information
export const CONTRACT_CONFIG = {
  // Sepolia Testnet
  sepolia: {
    chainId: 11155111,
    contractAddress: "0x0878229B9903D0d31FF8e5e009072BC8666b3e3f",
    serverWallet: "0x962a2afd14CF97fdD11824d4c4293607aA6f8013", // Deployer/Owner wallet
    blockExplorer: "https://sepolia.etherscan.io",
  },
  // Add more networks as needed
  localhost: {
    chainId: 31337,
    contractAddress: "", // Will be set after local deployment
    serverWallet: "",
    blockExplorer: "http://localhost:8545",
  },
} as const;

export const NETWORK = "sepolia"; // Current network

export const getContractConfig = () => CONTRACT_CONFIG[NETWORK];

export { ModelMergeStakingABI };

// Network configurations
export const SUPPORTED_CHAINS = {
  sepolia: {
    id: 11155111,
    name: "Sepolia",
    network: "sepolia",
    nativeCurrency: {
      name: "Sepolia ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ["https://sepolia.infura.io/v3/"],
      },
      public: {
        http: ["https://rpc.sepolia.org"],
      },
    },
    blockExplorers: {
      default: {
        name: "Etherscan",
        url: "https://sepolia.etherscan.io",
      },
    },
    testnet: true,
  },
} as const;
