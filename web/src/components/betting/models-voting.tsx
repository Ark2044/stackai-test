"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import { Input } from "~/components/ui/input";
import { TokenStaking } from "./token-staking";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import {
  Brain,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Download,
  Eye,
  Wallet,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Layers,
  Zap,
  Filter,
  Grid3X3,
} from "lucide-react";
import { useWallet } from "~/hooks/useWallet";
import { cn } from "~/lib/utils";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalTrigger,
  SubmitModal,
} from "../shared/animated-modal";

interface MLModel {
  id: string;
  mergeId?: number; // Add mergeId for blockchain integration
  name: string;
  version: string;
  description: string;
  category: "NLP" | "Computer Vision" | "Audio" | "Multimodal";
  status: "pending" | "approved" | "rejected";
  submittedBy: string;
  submissionDate: string;
  votingDeadline: string;
  accuracy: number;
  modelSize: string;
  yesVotes: number;
  noVotes: number;
  totalVotes: number;
  userVote?: "yes" | "no" | "abstain";
  stakingPower: number;
}

export function ModelsVoting() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { address } = useWallet();

  const models: MLModel[] = [
    {
      id: "1",
      mergeId: 1, // Blockchain merge ID
      name: "GPT-Vision-Pro",
      version: "v2.1",
      description:
        "Advanced multimodal language model with enhanced vision capabilities for image understanding and generation.",
      category: "Multimodal",
      status: "pending",
      submittedBy: "0x1234...5678",
      submissionDate: "2024-01-10",
      votingDeadline: "2024-01-17",
      accuracy: 94.2,
      modelSize: "7.5B",
      yesVotes: 1247,
      noVotes: 234,
      totalVotes: 1481,
      stakingPower: 67.8,
    },
    {
      id: "2",
      mergeId: 2, // Blockchain merge ID
      name: "BERT-NLP-Enhanced",
      version: "v3.0",
      description:
        "Improved BERT model with better context understanding and reduced computational requirements.",
      category: "NLP",
      status: "pending",
      submittedBy: "0x9876...4321",
      submissionDate: "2024-01-08",
      votingDeadline: "2024-01-15",
      accuracy: 91.7,
      modelSize: "340M",
      yesVotes: 892,
      noVotes: 456,
      totalVotes: 1348,
      stakingPower: 45.2,
    },
    {
      id: "3",
      name: "ResNet-Vision-Ultra",
      version: "v1.5",
      description:
        "High-performance computer vision model optimized for real-time image classification and object detection.",
      category: "Computer Vision",
      status: "approved",
      submittedBy: "0x5555...7777",
      submissionDate: "2024-01-05",
      votingDeadline: "2024-01-12",
      accuracy: 96.1,
      modelSize: "2.3B",
      yesVotes: 1567,
      noVotes: 234,
      totalVotes: 1801,
      userVote: "yes",
      stakingPower: 78.9,
    },
    {
      id: "4",
      name: "Whisper-Audio-Pro",
      version: "v2.0",
      description:
        "State-of-the-art speech recognition model with multilingual support and noise reduction.",
      category: "Audio",
      status: "rejected",
      submittedBy: "0x3333...9999",
      submissionDate: "2024-01-03",
      votingDeadline: "2024-01-10",
      accuracy: 87.3,
      modelSize: "1.2B",
      yesVotes: 345,
      noVotes: 1123,
      totalVotes: 1468,
      userVote: "no",
      stakingPower: 23.5,
    },
  ];

  const handleVote = (modelId: string, vote: "yes" | "no" | "abstain") => {
    console.log(`Voting ${vote} on model ${modelId}`);
    // Implement voting logic here
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "approved":
        return <CheckCircle className="h-4 w-4 text-accent" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-primary/10 text-primary border-primary/20";
      case "approved":
        return "bg-accent/10 text-accent border-accent/20";
      case "rejected":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getCategoryIcon = (category: string) => {
    return <Brain className="h-4 w-4" />;
  };

  const filteredModels = models.filter((model) => {
    const matchesSearch =
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || model.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container-responsive py-8 sm:py-10 relative z-10">
      {/* Header Section */}
      <div className="mb-10 animate-fade-in-up">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary border border-primary/20 mb-5">
              <Brain className="h-4 w-4" />
              <span>Model Validation</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              <span className="text-gradient">ML Models</span>
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed max-w-2xl">
              Vote on submitted models to determine if they improve upon previous versions and earn rewards.
            </p>
          </div>
          
          {/* Stats Summary */}
          <div className="flex flex-wrap gap-4">
            {[
              { label: "Active Models", value: "4", icon: Layers },
              { label: "Total Stakes", value: "12.5K", icon: Zap },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3 rounded-xl bg-card/50 backdrop-blur-xl border border-border/50">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info Banner */}
      {!address ? (
        <div className="mb-8 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          <div className="rounded-xl p-5 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 shrink-0">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-1">Connect Your Wallet</h3>
                <p className="text-sm text-muted-foreground">
                  Connect your MetaMask wallet to start staking on model merges. Click the wallet button in the navbar to get started.
                </p>
              </div>
              <Button className="h-11 px-6 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-semibold shadow-lg shadow-primary/25 shrink-0">
                Connect Wallet
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-8 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          <div className="rounded-xl p-5 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/20 shrink-0">
                <TrendingUp className="h-6 w-6 text-emerald-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-4 w-4 text-emerald-500" />
                  <h3 className="font-semibold text-emerald-600 dark:text-emerald-400">Ready to Stake</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Win <span className="font-bold text-emerald-500">+15%</span> on correct predictions, lose <span className="font-bold text-rose-500">-25%</span> on incorrect ones. Click Approve or Reject to place your stake!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-8 flex flex-col lg:flex-row gap-4 animate-fade-in-up" style={{animationDelay: '0.15s'}}>
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search models by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 rounded-xl border-border/50 bg-background/50 focus:border-primary/50 focus:ring-primary/20"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 mr-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground hidden sm:inline">Filter:</span>
          </div>
          {["all", "NLP", "Computer Vision", "Audio", "Multimodal"].map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              size="sm"
              className={cn(
                "rounded-xl h-10 px-4 transition-all duration-300",
                selectedCategory === category 
                  ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25" 
                  : "border-border/50 hover:border-primary/50 hover:bg-primary/5"
              )}
            >
              {category === "all" ? "All" : category === "Computer Vision" ? "Vision" : category}
            </Button>
          ))}
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid gap-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
        {filteredModels.map((model, index) => (
          <div 
            key={model.id} 
            className="group card-glass rounded-2xl overflow-hidden"
            style={{animationDelay: `${0.25 + index * 0.05}s`}}
          >
            {/* Card Header */}
            <div className="p-6 pb-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Model Icon */}
                    <div className={cn(
                      "flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 group-hover:scale-110",
                      model.status === "pending" && "bg-gradient-to-br from-primary/20 to-accent/20",
                      model.status === "approved" && "bg-gradient-to-br from-emerald-500/20 to-green-500/20",
                      model.status === "rejected" && "bg-gradient-to-br from-rose-500/20 to-red-500/20"
                    )}>
                      <Brain className={cn(
                        "h-6 w-6",
                        model.status === "pending" && "text-primary",
                        model.status === "approved" && "text-emerald-500",
                        model.status === "rejected" && "text-rose-500"
                      )} />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">{model.name}</h3>
                        <Badge variant="outline" className="rounded-lg bg-muted/50 font-mono text-xs">
                          {model.version}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge className={cn("rounded-lg text-xs", getStatusColor(model.status))}>
                          {getStatusIcon(model.status)}
                          <span className="ml-1.5 capitalize">{model.status}</span>
                        </Badge>
                        <Badge variant="secondary" className="rounded-lg text-xs bg-secondary/50">
                          {getCategoryIcon(model.category)}
                          <span className="ml-1.5">{model.category}</span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground max-w-3xl leading-relaxed">
                    {model.description}
                  </p>
                </div>
                
                {/* Action Buttons */}
                {model.status === "pending" && (
                  <div className="flex flex-wrap gap-2 shrink-0">
                    <Modal>
                      <ModalTrigger
                        className="group/btn cursor-pointer bg-gradient-to-r from-emerald-500 to-green-500 hover:opacity-90 text-white flex h-11 items-center gap-2 px-5 text-sm shadow-lg shadow-emerald-500/25 rounded-xl font-semibold transition-all hover:shadow-xl hover:scale-105"
                      >
                        <ThumbsUp className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                        Approve
                      </ModalTrigger>
                      <ModalBody>
                        <ModalContent className="overflow-auto">
                          <TokenStaking 
                            mergeId={model.mergeId} 
                            prediction={true}
                          />
                        </ModalContent>
                      </ModalBody>
                    </Modal>
                    <Modal>
                      <ModalTrigger
                        className="group/btn cursor-pointer bg-gradient-to-r from-rose-500 to-red-500 hover:opacity-90 text-white flex h-11 items-center gap-2 px-5 text-sm shadow-lg shadow-rose-500/25 rounded-xl font-semibold transition-all hover:shadow-xl hover:scale-105"
                      >
                        <ThumbsDown className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                        Reject
                      </ModalTrigger>
                      <ModalBody>
                        <ModalContent className="overflow-auto">
                          <TokenStaking 
                            mergeId={model.mergeId} 
                            prediction={false}
                          />
                        </ModalContent>
                      </ModalBody>
                    </Modal>
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-2 hover:border-muted-foreground/30 hover:bg-muted/50 font-semibold">
                      <Minus className="h-4 w-4 mr-2" />
                      Abstain
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Card Content */}
            <div className="px-6 pb-6">
              <div className="space-y-5">
                {/* Model Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {[
                    ...(model.mergeId ? [{ label: "Merge ID", value: `#${model.mergeId}`, icon: Grid3X3 }] : []),
                    { label: "Accuracy", value: `${model.accuracy}%`, icon: TrendingUp },
                    { label: "Size", value: model.modelSize, icon: Layers },
                    { label: "Submitted by", value: model.submittedBy, mono: true },
                    { label: "Deadline", value: new Date(model.votingDeadline).toLocaleDateString(), icon: Clock },
                  ].map((stat, i) => (
                    <div key={i} className="px-4 py-3 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-all">
                      <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                      <p className={cn("font-semibold text-sm truncate", stat.mono && "font-mono text-xs")}>
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Voting Progress */}
                <div className="rounded-xl border border-border/50 overflow-hidden">
                  <div className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border/50">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold">Voting Progress</span>
                      <span className="text-muted-foreground px-3 py-1 rounded-full bg-muted/50 text-xs font-medium">
                        {model.totalVotes.toLocaleString()} total votes
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-border/50">
                    <div className="p-4 bg-gradient-to-br from-emerald-500/5 to-green-500/5">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-emerald-500 font-semibold flex items-center gap-2">
                          <ThumbsUp className="h-4 w-4" />
                          Approve
                        </span>
                        <span className="font-bold">{model.yesVotes.toLocaleString()}</span>
                      </div>
                      <div className="relative h-2.5 rounded-full bg-emerald-500/10 overflow-hidden">
                        <div 
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-500"
                          style={{ width: `${(model.yesVotes / model.totalVotes) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-emerald-500/70 mt-1">{((model.yesVotes / model.totalVotes) * 100).toFixed(1)}%</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-rose-500/5 to-red-500/5">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-rose-500 font-semibold flex items-center gap-2">
                          <ThumbsDown className="h-4 w-4" />
                          Reject
                        </span>
                        <span className="font-bold">{model.noVotes.toLocaleString()}</span>
                      </div>
                      <div className="relative h-2.5 rounded-full bg-rose-500/10 overflow-hidden">
                        <div 
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-rose-500 to-red-500 rounded-full transition-all duration-500"
                          style={{ width: `${(model.noVotes / model.totalVotes) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-rose-500/70 mt-1">{((model.noVotes / model.totalVotes) * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-1">
                  <Button variant="outline" size="sm" className="rounded-xl border-2 hover:border-primary/50 hover:bg-primary/5 h-10 px-4">
                    <Eye className="h-4 w-4 mr-2 text-primary" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-xl border-2 hover:border-primary/50 hover:bg-primary/5 h-10 px-4">
                    <Download className="h-4 w-4 mr-2 text-primary" />
                    Download Model
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Bottom Accent Line */}
            <div className={cn(
              "h-1 bg-gradient-to-r",
              model.status === "pending" && "from-primary via-accent to-primary",
              model.status === "approved" && "from-emerald-500 via-green-500 to-emerald-500",
              model.status === "rejected" && "from-rose-500 via-red-500 to-rose-500"
            )} />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredModels.length === 0 && (
        <div className="text-center py-20 animate-fade-in">
          <div className="flex items-center justify-center w-24 h-24 mx-auto rounded-3xl bg-muted/50 mb-6">
            <Brain className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-bold mb-3">No Models Found</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Try adjusting your search query or filter criteria to find the models you&apos;re looking for.
          </p>
          <Button 
            variant="outline" 
            onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
            className="rounded-xl"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
