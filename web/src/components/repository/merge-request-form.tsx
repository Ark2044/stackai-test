"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
import {
  GitMerge,
  Upload,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Info,
  FileText,
  Hash,
  Sparkles,
  Wallet,
  ArrowRight,
  Zap,
  Users,
  Trophy,
  Shield,
} from "lucide-react";
import { useContract } from "~/hooks/useContract";
import { useWallet } from "~/hooks/useWallet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { LoadingSpinner, LoadingOverlay } from "~/components/ui/loading-spinner";
import { cn } from "~/lib/utils";

interface ModelInfo {
  modelId: number;
  creator: string;
  modelURI: string;
  exists: boolean;
}

type ProcessingStep = "idle" | "uploading" | "creating" | "confirming" | "complete";

export function MergeRequestForm() {
  const { contract, isLoading: contractLoading, initializeContract } = useContract();
  const { address, isConnected, connect } = useWallet();

  // Form state
  const [baseModelId, setBaseModelId] = useState("");
  const [proposedModelId, setProposedModelId] = useState("");
  const [baseModelURI, setBaseModelURI] = useState("");
  const [proposedModelURI, setProposedModelURI] = useState("");
  const [newBaseModelURI, setNewBaseModelURI] = useState("");
  const [newProposedModelURI, setNewProposedModelURI] = useState("");

  // UI state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<ProcessingStep>("idle");
  const [txHash, setTxHash] = useState("");
  const [mergeRequestId, setMergeRequestId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Model verification
  const [baseModelInfo, setBaseModelInfo] = useState<ModelInfo | null>(null);
  const [proposedModelInfo, setProposedModelInfo] = useState<ModelInfo | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const resetForm = () => {
    setBaseModelId("");
    setProposedModelId("");
    setBaseModelURI("");
    setProposedModelURI("");
    setNewBaseModelURI("");
    setNewProposedModelURI("");
    setBaseModelInfo(null);
    setProposedModelInfo(null);
    setTxHash("");
    setMergeRequestId("");
    setError("");
    setSuccess("");
    setProcessingStep("idle");
  };

  const verifyModel = async (modelId: string): Promise<ModelInfo | null> => {
    if (!contract || !modelId) return null;

    try {
      const model = await contract.models?.(parseInt(modelId));
      if (!model) return null;
      return {
        modelId: Number(model.modelId),
        creator: model.creator,
        modelURI: model.modelURI,
        exists: model.exists,
      };
    } catch (error) {
      console.error("Error verifying model:", error);
      return null;
    }
  };

  const handleVerifyModels = async () => {
    if (!baseModelId || !proposedModelId) {
      setError("Please enter both model IDs");
      return;
    }

    setIsVerifying(true);
    setError("");
    setBaseModelInfo(null);
    setProposedModelInfo(null);

    try {
      const [baseInfo, proposedInfo] = await Promise.all([
        verifyModel(baseModelId),
        verifyModel(proposedModelId),
      ]);

      if (!baseInfo?.exists) {
        setError(`Base model ID ${baseModelId} does not exist on-chain`);
        setIsVerifying(false);
        return;
      }

      if (!proposedInfo?.exists) {
        setError(`Proposed model ID ${proposedModelId} does not exist on-chain`);
        setIsVerifying(false);
        return;
      }

      setBaseModelInfo(baseInfo);
      setProposedModelInfo(proposedInfo);
      setBaseModelURI(baseInfo.modelURI);
      setProposedModelURI(proposedInfo.modelURI);
    } catch (error: any) {
      setError(error.message || "Failed to verify models");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCreateMergeRequest = async () => {
    if (!contract) {
      setError("Contract not initialized");
      return;
    }

    if (!baseModelId || !proposedModelId) {
      setError("Please enter both model IDs");
      return;
    }

    if (!baseModelInfo || !proposedModelInfo) {
      setError("Please verify models first");
      return;
    }

    setIsProcessing(true);
    setError("");
    setSuccess("");
    setProcessingStep("creating");

    try {
      const tx = await contract.createMergeRequest!(
        parseInt(baseModelId),
        parseInt(proposedModelId)
      );

      setTxHash(tx.hash);
      setProcessingStep("confirming");

      const receipt = await tx.wait();

      // Extract mergeId from event logs
      const mergeRequestedEvent = receipt.logs.find((log: any) => {
        try {
          const parsed = contract?.interface.parseLog(log);
          return parsed?.name === "MergeRequested";
        } catch {
          return false;
        }  });

      if (mergeRequestedEvent) {
        const parsed = contract?.interface.parseLog(mergeRequestedEvent);
        const mergeId = parsed?.args?.mergeId?.toString();
        setMergeRequestId(mergeId);
      }

      setProcessingStep("complete");
      setSuccess(
        `Merge request created successfully! ${
          mergeRequestId ? `Merge ID: ${mergeRequestId}` : ""
        }`
      );

      // Reset form after 3 seconds
      setTimeout(() => {
        resetForm();
      }, 5000);
    } catch (error: any) {
      console.error("Error creating merge request:", error);
      setError(error.message || "Failed to create merge request");
      setProcessingStep("idle");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateWithNewModels = async () => {
    if (!contract) {
      setError("Contract not initialized");
      return;
    }

    if (!newBaseModelURI || !newProposedModelURI) {
      setError("Please enter both model URIs");
      return;
    }

    setIsProcessing(true);
    setError("");
    setSuccess("");
    setProcessingStep("uploading");

    try {
      // Create base model
      const baseTx = await contract.createModel!(newBaseModelURI);
      setTxHash(baseTx.hash);
      const baseReceipt = await baseTx.wait();

      // Extract baseModelId from event
      const baseModelEvent = baseReceipt.logs.find((log: any) => {
        try {
          const parsed = contract?.interface.parseLog(log);
          return parsed?.name === "ModelCreated";
        } catch {
          return false;
        }
      });

      let createdBaseModelId = "";
      if (baseModelEvent) {
        const parsed = contract?.interface.parseLog(baseModelEvent);
        createdBaseModelId = parsed?.args?.modelId?.toString();
      }

      setProcessingStep("creating");

      // Create proposed model
      const proposedTx = await contract.createModel!(newProposedModelURI);
      const proposedReceipt = await proposedTx.wait();

      // Extract proposedModelId from event
      const proposedModelEvent = proposedReceipt.logs.find((log: any) => {
        try {
          const parsed = contract?.interface.parseLog(log);
          return parsed?.name === "ModelCreated";
        } catch {
          return false;
        }
      });

      let createdProposedModelId = "";
      if (proposedModelEvent) {
        const parsed = contract?.interface.parseLog(proposedModelEvent);
        createdProposedModelId = parsed?.args?.modelId?.toString();
      }

      if (!createdBaseModelId || !createdProposedModelId) {
        throw new Error("Failed to extract model IDs from events");
      }

      // Create merge request
      const mergeTx = await contract.createMergeRequest!(
        createdBaseModelId,
        createdProposedModelId
      );

      setTxHash(mergeTx.hash);
      setProcessingStep("confirming");

      const mergeReceipt = await mergeTx.wait();

      // Extract mergeId from event
      const mergeRequestedEvent = mergeReceipt.logs.find((log: any) => {
        try {
          const parsed = contract?.interface.parseLog(log);
          return parsed?.name === "MergeRequested";
        } catch {
          return false;
        }
      });

      if (mergeRequestedEvent) {
        const parsed = contract?.interface.parseLog(mergeRequestedEvent);
        const mergeId = parsed?.args?.mergeId?.toString();
        setMergeRequestId(mergeId);
      }

      setProcessingStep("complete");
      setSuccess(
        `Models created and merge request submitted! Base Model ID: ${createdBaseModelId}, Proposed Model ID: ${createdProposedModelId}${
          mergeRequestId ? `, Merge ID: ${mergeRequestId}` : ""
        }`
      );

      // Reset form after 5 seconds
      setTimeout(() => {
        resetForm();
      }, 7000);
    } catch (error: any) {
      console.error("Error creating models and merge request:", error);
      setError(error.message || "Failed to create models and merge request");
      setProcessingStep("idle");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="container-responsive py-12">
        <div className="max-w-2xl mx-auto">
          <div className="card-glass rounded-2xl overflow-hidden">
            <div className="p-8 border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                  <GitMerge className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    Request Model Merge
                    <Sparkles className="h-5 w-5 text-accent" />
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Connect your wallet to create a merge request
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="flex flex-col items-center text-center py-8">
                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 to-accent/30 blur-lg animate-pulse"></div>
                  <div className="relative p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                    <Wallet className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Wallet Required</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                  Please connect your wallet to create merge requests and interact
                  with the blockchain.
                </p>
                <Button 
                  onClick={connect} 
                  className="h-12 px-8 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-semibold shadow-lg shadow-primary/25"
                >
                  <Wallet className="mr-2 h-5 w-5" />
                  Connect Wallet
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-responsive py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Blockchain Powered</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Request Model Merge</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create a merge request to combine two models. Validators will stake
            tokens to vote on whether the merge should be accepted.
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="existing" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-14 p-1.5 rounded-xl bg-muted/50 backdrop-blur-sm border border-border/50">
            <TabsTrigger 
              value="existing"
              className="rounded-lg h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <Hash className="h-4 w-4 mr-2" />
              Use Existing Models
            </TabsTrigger>
            <TabsTrigger 
              value="new"
              className="rounded-lg h-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload New Models
            </TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="mt-6 space-y-6">
            <div className="card-glass rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Hash className="h-5 w-5 text-primary" />
                  Select Existing Models
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter the on-chain model IDs to create a merge request
                </p>
              </div>
              <div className="p-6 space-y-6">
                {/* Info Banner */}
                <div className="rounded-xl p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                  <div className="flex gap-3">
                    <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-600 dark:text-blue-400 mb-1">How it works</p>
                      <p className="text-muted-foreground">
                        The base model is the original model (Mx). The proposed model
                        contains changes you want to merge in. Both models must exist
                        on-chain before creating a merge request.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Model Inputs */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="baseModelId" className="text-sm font-medium">
                      Base Model ID (Mx)
                    </Label>
                    <Input
                      id="baseModelId"
                      type="number"
                      placeholder="Enter base model ID"
                      value={baseModelId}
                      onChange={(e) => setBaseModelId(e.target.value)}
                      disabled={isProcessing}
                      className="h-12 rounded-xl border-border/50 bg-background/50 focus:border-primary/50 focus:ring-primary/20"
                    />
                    {baseModelInfo && (
                      <div className="card-elegant rounded-xl p-4 space-y-2">
                        <div className="flex items-center gap-2 text-emerald-500">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-sm font-medium">Model verified</span>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p className="truncate">URI: {baseModelInfo.modelURI}</p>
                          <p className="truncate">
                            Creator: {baseModelInfo.creator.slice(0, 6)}...
                            {baseModelInfo.creator.slice(-4)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="proposedModelId" className="text-sm font-medium">
                      Proposed Model ID (My)
                    </Label>
                    <Input
                      id="proposedModelId"
                      type="number"
                      placeholder="Enter proposed model ID"
                      value={proposedModelId}
                      onChange={(e) => setProposedModelId(e.target.value)}
                      disabled={isProcessing}
                      className="h-12 rounded-xl border-border/50 bg-background/50 focus:border-primary/50 focus:ring-primary/20"
                    />
                    {proposedModelInfo && (
                      <div className="card-elegant rounded-xl p-4 space-y-2">
                        <div className="flex items-center gap-2 text-emerald-500">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-sm font-medium">Model verified</span>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p className="truncate">URI: {proposedModelInfo.modelURI}</p>
                          <p className="truncate">
                            Creator: {proposedModelInfo.creator.slice(0, 6)}...
                            {proposedModelInfo.creator.slice(-4)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl p-4 bg-gradient-to-r from-rose-500/10 to-red-500/10 border border-rose-500/30">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-rose-500" />
                      <div>
                        <p className="font-medium text-rose-600 dark:text-rose-400">Error</p>
                        <p className="text-sm text-muted-foreground">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="rounded-xl p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-emerald-600 dark:text-emerald-400">Success</p>
                        <p className="text-sm text-muted-foreground">{success}</p>
                        {txHash && (
                          <a
                            href={`https://sepolia.etherscan.io/tx/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                          >
                            View transaction on Etherscan
                            <ArrowRight className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {processingStep !== "idle" && processingStep !== "complete" && (
                  <div className="rounded-xl p-4 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-5 w-5 text-primary animate-spin" />
                      <div>
                        <p className="font-medium">Processing</p>
                        <p className="text-sm text-muted-foreground">
                          {processingStep === "creating" &&
                            "Creating merge request..."}
                          {processingStep === "confirming" &&
                            "Waiting for confirmation..."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={handleVerifyModels}
                    disabled={
                      isProcessing ||
                      isVerifying ||
                      !baseModelId ||
                      !proposedModelId
                    }
                    variant="outline"
                    className="flex-1 h-12 rounded-xl border-border/50 hover:bg-primary/5 hover:border-primary/50"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Verify Models
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleCreateMergeRequest}
                    disabled={
                      isProcessing ||
                      !baseModelInfo ||
                      !proposedModelInfo ||
                      processingStep === "complete"
                    }
                    className="flex-1 h-12 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-semibold shadow-lg shadow-primary/25"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <GitMerge className="mr-2 h-4 w-4" />
                        Create Merge Request
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="new" className="mt-6 space-y-6">
            <div className="card-glass rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-border/50 bg-gradient-to-r from-accent/5 to-primary/5">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Upload className="h-5 w-5 text-accent" />
                  Upload New Models
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Create new models on-chain and submit a merge request in one go
                </p>
              </div>
              <div className="p-6 space-y-6">
                {/* Info Banner */}
                <div className="rounded-xl p-4 bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20">
                  <div className="flex gap-3">
                    <Info className="h-5 w-5 text-violet-500 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-violet-600 dark:text-violet-400 mb-1">About Model URIs</p>
                      <p className="text-muted-foreground">
                        Enter IPFS hashes or URLs pointing to your model files. In
                        production, these would typically be IPFS CIDs like
                        &quot;QmX...&quot; or &quot;ipfs://QmX...&quot;
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="space-y-3">
                    <Label htmlFor="newBaseModelURI" className="text-sm font-medium">
                      Base Model URI (IPFS Hash/URL)
                    </Label>
                    <Input
                      id="newBaseModelURI"
                      type="text"
                      placeholder="e.g., QmX... or https://..."
                      value={newBaseModelURI}
                      onChange={(e) => setNewBaseModelURI(e.target.value)}
                      disabled={isProcessing}
                      className="h-12 rounded-xl border-border/50 bg-background/50 focus:border-primary/50 focus:ring-primary/20"
                    />
                    <p className="text-xs text-muted-foreground">
                      This is the original model (Mx) that will serve as the base
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="newProposedModelURI" className="text-sm font-medium">
                      Proposed Model URI (IPFS Hash/URL)
                    </Label>
                    <Input
                      id="newProposedModelURI"
                      type="text"
                      placeholder="e.g., QmY... or https://..."
                      value={newProposedModelURI}
                      onChange={(e) => setNewProposedModelURI(e.target.value)}
                      disabled={isProcessing}
                      className="h-12 rounded-xl border-border/50 bg-background/50 focus:border-primary/50 focus:ring-primary/20"
                    />
                    <p className="text-xs text-muted-foreground">
                      This model contains the changes you want to merge (My)
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl p-4 bg-gradient-to-r from-rose-500/10 to-red-500/10 border border-rose-500/30">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-rose-500" />
                      <div>
                        <p className="font-medium text-rose-600 dark:text-rose-400">Error</p>
                        <p className="text-sm text-muted-foreground">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="rounded-xl p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-emerald-600 dark:text-emerald-400">Success</p>
                        <p className="text-sm text-muted-foreground">{success}</p>
                        {txHash && (
                          <a
                            href={`https://sepolia.etherscan.io/tx/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                          >
                            View transaction on Etherscan
                            <ArrowRight className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {processingStep !== "idle" && processingStep !== "complete" && (
                  <div className="rounded-xl p-4 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-5 w-5 text-primary animate-spin" />
                      <div>
                        <p className="font-medium">Processing</p>
                        <p className="text-sm text-muted-foreground">
                          {processingStep === "uploading" &&
                            "Creating base model on-chain..."}
                          {processingStep === "creating" &&
                            "Creating proposed model on-chain..."}
                          {processingStep === "confirming" &&
                            "Creating merge request..."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleCreateWithNewModels}
                  disabled={
                    isProcessing ||
                    !newBaseModelURI ||
                    !newProposedModelURI ||
                    processingStep === "complete"
                  }
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-accent to-primary hover:opacity-90 text-white font-semibold shadow-lg shadow-accent/25"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Create Models & Merge Request
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* What happens next */}
        <div className="card-glass rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border/50">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              What happens next?
            </h2>
          </div>
          <div className="p-6">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  step: 1,
                  icon: GitMerge,
                  color: "from-cyan-500 to-teal-500",
                  text: "Your merge request is recorded on the blockchain and assigned a unique Merge ID"
                },
                {
                  step: 2,
                  icon: Users,
                  color: "from-violet-500 to-purple-500",
                  text: "Validators can stake tokens to vote on whether to accept or reject the merge"
                },
                {
                  step: 3,
                  icon: Shield,
                  color: "from-amber-500 to-orange-500",
                  text: "Once 100 validators have voted, the merge is finalized based on the majority vote"
                },
                {
                  step: 4,
                  icon: Trophy,
                  color: "from-emerald-500 to-green-500",
                  text: "Validators on the winning side receive rewards, while those on the losing side receive penalties"
                }
              ].map((item) => (
                <div key={item.step} className="card-elegant rounded-xl p-4 flex gap-4 group hover:border-primary/30 transition-colors">
                  <div className={cn(
                    "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0",
                    item.color
                  )}>
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Step {item.step}</p>
                    <p className="text-sm">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
