"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Book,
  Star,
  GitFork,
  Eye,
  Code,
  ChevronDown,
  Download,
  ArrowLeft,
  GitBranch,
  Clock,
  Globe,
  Lock,
  Sparkles,
  FolderGit2,
  Settings,
  Shield,
  Activity,
  BarChart3,
} from "lucide-react";
import { FileExplorer } from "~/components/repository/file-explorer";
import { cn } from "~/lib/utils";
import Link from "next/link";

interface RepositoryViewProps {
  owner: string;
  name: string;
}

// Mock repository data
const mockRepo = {
  id: "1",
  name: "awesome-react-components",
  description:
    "A collection of awesome React components for modern web applications",
  isPrivate: false,
  language: "TypeScript",
  languageColor: "#3178c6",
  stars: 1247,
  forks: 89,
  watchers: 156,
  defaultBranch: "main",
  updatedAt: "2 hours ago",
  owner: {
    name: "johndoe",
    avatar: "/diverse-user-avatars.png",
  },
};

export function RepositoryView({ owner, name }: RepositoryViewProps) {
  const [currentBranch, setCurrentBranch] = useState(mockRepo.defaultBranch);
  const [activeTab, setActiveTab] = useState("code");

  const navTabs = [
    { id: "code", label: "Code", icon: Code, active: true },
    { id: "issues", label: "Issues", icon: Activity, count: 12 },
    { id: "pulls", label: "Pull requests", icon: GitFork, count: 3 },
    { id: "actions", label: "Actions", icon: Activity },
    { id: "security", label: "Security", icon: Shield },
    { id: "insights", label: "Insights", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb w-[600px] h-[600px] bg-primary/20 -top-40 -left-40"></div>
        <div className="orb w-[500px] h-[500px] bg-accent/15 top-1/3 -right-32 animation-delay-2000"></div>
      </div>
      <div className="fixed inset-0 gradient-mesh opacity-30 pointer-events-none"></div>
      <div className="fixed inset-0 dot-pattern pointer-events-none"></div>

      {/* Repository Header */}
      <div className="relative z-10 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              {/* Breadcrumb */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                  <FolderGit2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6 ring-2 ring-primary/20">
                    <AvatarImage src={mockRepo.owner.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {mockRepo.owner.name[0]!.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Link href={`/${owner}`} className="text-primary hover:underline font-medium">
                    {owner}
                  </Link>
                  <span className="text-muted-foreground">/</span>
                  <h1 className="text-xl font-bold">{name}</h1>
                  {mockRepo.isPrivate ? (
                    <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                      <Lock className="h-3 w-3 mr-1" />
                      Private
                    </Badge>
                  ) : (
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                      <Globe className="h-3 w-3 mr-1" />
                      Public
                    </Badge>
                  )}
                </div>
              </div>

              <p className="text-muted-foreground mb-4 max-w-2xl">
                {mockRepo.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/30">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: mockRepo.languageColor }}
                  />
                  <span>{mockRepo.language}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Updated {mockRepo.updatedAt}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-xl border-border/50 hover:border-primary/50 hover:bg-primary/5">
                <Eye className="h-4 w-4 mr-2" />
                Watch
                <Badge className="ml-2 bg-muted/50 text-muted-foreground border-0">{mockRepo.watchers}</Badge>
              </Button>

              <Button variant="outline" size="sm" className="rounded-xl border-border/50 hover:border-amber-500/50 hover:bg-amber-500/5">
                <Star className="h-4 w-4 mr-2 text-amber-500" />
                Star
                <Badge className="ml-2 bg-amber-500/10 text-amber-500 border-0">{mockRepo.stars}</Badge>
              </Button>

              <Button variant="outline" size="sm" className="rounded-xl border-border/50 hover:border-primary/50 hover:bg-primary/5">
                <GitFork className="h-4 w-4 mr-2" />
                Fork
                <Badge className="ml-2 bg-muted/50 text-muted-foreground border-0">{mockRepo.forks}</Badge>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white shadow-lg shadow-primary/25">
                    <Download className="h-4 w-4 mr-2" />
                    Code
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl border-border/50">
                  <DropdownMenuItem className="rounded-lg">Download ZIP</DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg">Clone with HTTPS</DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg">Clone with SSH</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Repository Navigation */}
      <div className="relative z-10 border-b border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 overflow-x-auto py-2">
            {navTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {tab.count && (
                  <Badge className={cn(
                    "text-xs",
                    activeTab === tab.id
                      ? "bg-white/20 text-white border-0"
                      : "bg-muted/50 text-muted-foreground border-0"
                  )}>
                    {tab.count}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* File Explorer */}
          <div className="flex-1">
            <div className="card-glass rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
                <div className="flex items-center space-x-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="rounded-xl border-border/50 hover:border-primary/50">
                        <GitBranch className="h-4 w-4 mr-2 text-primary" />
                        {currentBranch}
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="rounded-xl border-border/50">
                      <DropdownMenuItem className="rounded-lg" onClick={() => setCurrentBranch("main")}>
                        main
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg" onClick={() => setCurrentBranch("develop")}>
                        develop
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-lg" onClick={() => setCurrentBranch("feature/new-ui")}>
                        feature/new-ui
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">42</span> commits
                </div>
              </div>

              <FileExplorer branch={currentBranch} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80 space-y-6">
            {/* About */}
            <div className="card-glass rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
                <h3 className="font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  About
                </h3>
              </div>
              <div className="p-5">
                <p className="text-muted-foreground text-sm mb-5">
                  {mockRepo.description}
                </p>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: mockRepo.languageColor }}
                    />
                    <span className="font-medium">{mockRepo.language}</span>
                  </div>

                  <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted/30 transition-colors">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Star className="h-4 w-4 text-amber-500" /> Stars
                    </span>
                    <span className="font-semibold">{mockRepo.stars}</span>
                  </div>

                  <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted/30 transition-colors">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Eye className="h-4 w-4" /> Watching
                    </span>
                    <span className="font-semibold">{mockRepo.watchers}</span>
                  </div>

                  <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted/30 transition-colors">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <GitFork className="h-4 w-4" /> Forks
                    </span>
                    <span className="font-semibold">{mockRepo.forks}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Releases */}
            <div className="card-glass rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Releases</h3>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 rounded-lg">
                    View all
                  </Button>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30">
                  <div>
                    <div className="font-semibold">v2.1.0</div>
                    <div className="text-xs text-muted-foreground">Released 2 days ago</div>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30">
                    Latest
                  </Badge>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="card-glass rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-border/50">
                <h3 className="font-semibold">Languages</h3>
              </div>
              <div className="p-5">
                {/* Language Bar */}
                <div className="h-2.5 rounded-full overflow-hidden flex mb-4">
                  <div className="bg-blue-500" style={{ width: "78.2%" }} />
                  <div className="bg-amber-500" style={{ width: "15.8%" }} />
                  <div className="bg-rose-500" style={{ width: "6%" }} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span>TypeScript</span>
                    </div>
                    <span className="text-muted-foreground text-sm font-medium">78.2%</span>
                  </div>

                  <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <span>JavaScript</span>
                    </div>
                    <span className="text-muted-foreground text-sm font-medium">15.8%</span>
                  </div>

                  <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500" />
                      <span>CSS</span>
                    </div>
                    <span className="text-muted-foreground text-sm font-medium">6.0%</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
