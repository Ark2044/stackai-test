"use client";

import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Search, Plus, Book } from "lucide-react";
import { CreateRepositoryForm } from "~/components/repository/create-repository-form";
import { RepositoryList } from "~/components/repository/repository-list";
import { useUser } from "../auth/AuthComponent";
import { getRepos } from "~/app/api/manageRepo";
import type { Repository } from "@prisma/client";
import { PageLoading } from "~/components/ui/loading-spinner";
// import { ThemeToggle } from "~/components/theme-toggle";

export function RepositoryDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchRepos();
    }
  }, [user]);

  const fetchRepos = async () => {
    if (user) {
      try {
        setIsLoading(true);
        const r = await getRepos(user.id);
        setRepos(r);
      } catch (error) {
        console.error("Error fetching repos:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return <PageLoading text="Loading repositories..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-80">
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center space-x-3 mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/user-profile-illustration.png" />
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-xl">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    johndoe
                  </h2>
                  <p className="text-muted-foreground">John Doe</p>
                </div>
              </div>

              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus className="h-4 w-4 mr-2" />
                    New
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-125  p-10 bg-card border-border">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">
                      Create a new repository
                    </DialogTitle>
                  </DialogHeader>
                  <div className="">
                    <CreateRepositoryForm
                      onClose={() => {
                        setIsCreateDialogOpen(false);
                        fetchRepos();
                      }}
                    />
                  </div>
                </DialogContent>
              </Dialog>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Repositories</span>
                  <span className="text-foreground font-medium">24</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Following</span>
                  <span className="text-foreground font-medium">12</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Followers</span>
                  <span className="text-foreground font-medium">156</span>
                </div>
              </div>
            </Card>
          </aside>

          {/* Repository List */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold text-foreground">
                Repositories
              </h1>
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border bg-transparent"
                    >
                      Type
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-popover border-border">
                    <DropdownMenuItem className="text-popover-foreground">
                      All
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-popover-foreground">
                      Public
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-popover-foreground">
                      Private
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-popover-foreground">
                      Forks
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border bg-transparent"
                    >
                      Language
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-popover border-border">
                    <DropdownMenuItem className="text-popover-foreground">
                      All
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-popover-foreground">
                      TypeScript
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-popover-foreground">
                      JavaScript
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-popover-foreground">
                      Python
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border bg-transparent"
                    >
                      Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-popover border-border">
                    <DropdownMenuItem className="text-popover-foreground">
                      Last updated
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-popover-foreground">
                      Name
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-popover-foreground">
                      Stars
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <RepositoryList repos={repos} searchQuery={searchQuery} />
          </div>
        </div>
      </main>
    </div>
  );
}
