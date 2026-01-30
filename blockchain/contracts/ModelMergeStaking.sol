// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract ModelMergeStaking is ERC20, Ownable, ReentrancyGuard, Pausable {

    // ERC20 Token settings
    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 10**18; // 1 million tokens
    uint256 public constant MAX_SUPPLY = 10_000_000 * 10**18; // 10 million tokens

    // ✅ Added Ownable(msg.sender)
    constructor() ERC20("ModelMergeToken", "MMT") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY); // mint initial supply to deployer
    }

    struct Model {
        uint256 modelId;       // unique model ID
        address creator;       // user who uploaded 
        string modelURI;       //IPFS hash of model 
        bool exists; //by default false,if someone wants to check if it models exists or not it helps
    }

    struct MergeRequest {
        uint256 mergeId;       // unique merge request ID
        uint256 baseModelId;   // MX(original)
        uint256 proposedModelId; //  (proposed to merge)
        uint256 totalStaked;   // total tokens staked on this merge
        uint256 yesVotes;      // validators supporting merge
        uint256 noVotes;       // validators rejecting merge
        bool finalized;        // if merge finalized
        bool merged;           // merge outcome (true = merged)
    }

    struct StakeInfo {
        uint256 amount; // amount staked
        bool claim;     
        bool hasStaked;//avoids double staking ,check if a validator has already staked on given mergeid
    }

    uint256 public nextModelId;
    uint256 public nextMergeId;
    uint256 public constant VALIDATOR_LIMIT = 100; // total validator votes required to finalize

    mapping(uint256 => Model) public models;         //retrive model details by its id      
    mapping(uint256 => MergeRequest) public mergeRequests; //retrieve merge details by its id
    mapping(uint256 => mapping(address => StakeInfo)) public validatorStakes; // validatorStakes[mergeId][validatorAddress] → StakeInfo
    mapping(uint256 => address[]) public mergeValidators; // stores all validator addresses who staked in this merge
    mapping(address => int256) public validatorRewards; //  net reward/penalty (can be negative)
    mapping(uint256 => uint256[]) public modelToMerges;    //merge id's array where a particular model was used eg:-modelid[1]=[10,11,2] 

    event ModelCreated(uint256 indexed modelId, address indexed creator, string modelURI);
    event MergeRequested(uint256 indexed mergeId, uint256 indexed baseModelId, uint256 indexed proposedModelId);
    event ModelStaked(address indexed validator, uint256 indexed mergeId, uint256 amount, bool claim);
    event MergeFinalized(uint256 indexed mergeId, bool accepted); // added to log merge result
    event ValidatorRewarded(address indexed validator, int256 reward); // logs reward or penalty
    event TokensMinted(address indexed to, uint256 amount); // logs minting
    event ContractPaused(address indexed by);
    event ContractUnpaused(address indexed by);
    event EmergencyWithdraw(address indexed to, uint256 amount);

    // Pause/Unpause functions for emergency situations
    function pause() external onlyOwner {
        _pause();
        emit ContractPaused(msg.sender);
    }

    function unpause() external onlyOwner {
        _unpause();
        emit ContractUnpaused(msg.sender);
    }

    // Emergency withdraw function (only when paused)
    function emergencyWithdraw(address to, uint256 amount) external onlyOwner whenPaused {
        require(to != address(0), "Invalid address");
        require(amount <= balanceOf(address(this)), "Insufficient contract balance");
        _transfer(address(this), to, amount);
        emit EmergencyWithdraw(to, amount);
    }

    //  Allow owner to mint new tokens (up to max supply)
    function mintTokens(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    function createModel(string memory modelURI) external whenNotPaused returns (uint256) {
        require(bytes(modelURI).length > 0, "Model URI cannot be empty");
        uint256 modelId = ++nextModelId;
        models[modelId] = Model({
            modelId: modelId,
            creator: msg.sender,
            modelURI: modelURI,
            exists: true
        });

        emit ModelCreated(modelId, msg.sender, modelURI);
        return modelId;
    }

    function createMergeRequest(uint256 baseModelId, uint256 proposedModelId) external whenNotPaused returns (uint256) {
        require(models[baseModelId].exists, "Base model not found");
        require(models[proposedModelId].exists, "Proposed model not found");

        uint256 mergeId = ++nextMergeId;

        mergeRequests[mergeId] = MergeRequest({
            mergeId: mergeId,
            baseModelId: baseModelId,
            proposedModelId: proposedModelId,
            totalStaked: 0,
            yesVotes: 0,
            noVotes: 0,
            finalized: false,
            merged: false
        });

        modelToMerges[baseModelId].push(mergeId);
        modelToMerges[proposedModelId].push(mergeId);

        emit MergeRequested(mergeId, baseModelId, proposedModelId);
        return mergeId;
    }

    function stakeOnMerge(uint256 mergeId, uint256 amount, bool claim) external nonReentrant whenNotPaused {
        require(amount > 0, "Stake amount must be > 0");

        MergeRequest storage merge = mergeRequests[mergeId];
        require(!merge.finalized, "Merge already finalized");

        StakeInfo storage stake = validatorStakes[mergeId][msg.sender];
        require(!stake.hasStaked, "Already staked");

        // ✅ transfer tokens to contract
        _transfer(msg.sender, address(this), amount);

        stake.amount = amount;
        stake.claim = claim;
        stake.hasStaked = true;

        // store validator address for iteration later
        mergeValidators[mergeId].push(msg.sender);

        merge.totalStaked += amount;
        if (claim) merge.yesVotes++;
        else merge.noVotes++;

        emit ModelStaked(msg.sender, mergeId, amount, claim);

        //  Auto-finalize when 100 validators have voted
        finalizeIfComplete(mergeId);
    }

    // internal function that checks if 100 validators voted and finalizes result
    function finalizeIfComplete(uint256 mergeId) internal {
        MergeRequest storage merge = mergeRequests[mergeId];
        uint256 totalVotes = merge.yesVotes + merge.noVotes;

        if (totalVotes == VALIDATOR_LIMIT && !merge.finalized) {
            merge.finalized = true;
            merge.merged = (merge.yesVotes > merge.noVotes); // if yes > no → accepted, else rejected

            emit MergeFinalized(mergeId, merge.merged);

            //  After finalization, apply rewards or penalties
            distributeRewards(mergeId, merge.merged);
        }
    }

    // reward/penalty distribution
    function distributeRewards(uint256 mergeId, bool mergeAccepted) internal nonReentrant {
        address[] memory validators = mergeValidators[mergeId];

        for (uint256 i = 0; i < validators.length; i++) {
            address validator = validators[i];
            StakeInfo memory stake = validatorStakes[mergeId][validator];

            bool votedCorrectly = (stake.claim == mergeAccepted);
            int256 rewardOrPenalty = calculateReward(stake.amount, votedCorrectly);

            validatorRewards[validator] += rewardOrPenalty;

            if (rewardOrPenalty > 0) {
                //  transfer reward tokens
                _transfer(address(this), validator, uint256(rewardOrPenalty));
            } else {
                //  keep penalty tokens in contract
                // nothing to transfer
            }

            emit ValidatorRewarded(validator, rewardOrPenalty);
        }
    }

    //  function that calculates reward or penalty per validator
    function calculateReward(uint256 amount, bool votedCorrectly) internal pure returns (int256) {
        if (votedCorrectly) {
            // 15% reward
            return int256((amount * 15) / 100);
        } else {
            // -25% penalty
            return -int256((amount * 25) / 100);
        }
    }

    function getMergesForModel(uint256 modelId) external view returns (uint256[] memory) {
        return modelToMerges[modelId];
    }

    function getStakeInfo(uint256 mergeId, address validator)
        external
        view
        returns (uint256 amount, bool claim, bool hasStaked)
    {
        StakeInfo memory s = validatorStakes[mergeId][validator];
        return (s.amount, s.claim, s.hasStaked);
    }
}

