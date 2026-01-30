"use client";

import { useState } from "react";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Star,
  GitFork,
  Clock,
  MoreHorizontal,
  Lock,
  Globe,
  GitBranch,
} from "lucide-react";
import Link from "next/link";
import type { Repository } from "@prisma/client";

interface MyRepository {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  updatedAt: string;
  defaultBranch: string;
}

const mockRepositories: MyRepository[] = [
  {
    id: "1",
    name: "awesome-react-components",
    description:
      "A collection of awesome React components for modern web applications",
    isPrivate: false,
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 1247,
    forks: 89,
    updatedAt: "2 hours ago",
    defaultBranch: "main",
  },
  {
    id: "2",
    name: "personal-portfolio",
    description:
      "My personal portfolio website built with Next.js and Tailwind CSS",
    isPrivate: true,
    language: "JavaScript",
    languageColor: "#f1e05a",
    stars: 23,
    forks: 4,
    updatedAt: "1 day ago",
    defaultBranch: "main",
  },
  {
    id: "3",
    name: "api-gateway-service",
    description:
      "Microservices API gateway with authentication and rate limiting",
    isPrivate: false,
    language: "Python",
    languageColor: "#3572A5",
    stars: 456,
    forks: 67,
    updatedAt: "3 days ago",
    defaultBranch: "develop",
  },
  {
    id: "4",
    name: "mobile-expense-tracker",
    description:
      "React Native app for tracking personal expenses with charts and analytics",
    isPrivate: false,
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 789,
    forks: 123,
    updatedAt: "5 days ago",
    defaultBranch: "main",
  },
  {
    id: "5",
    name: "docker-compose-templates",
    description:
      "Collection of Docker Compose templates for common development setups",
    isPrivate: false,
    language: "Shell",
    languageColor: "#89e051",
    stars: 234,
    forks: 45,
    updatedAt: "1 week ago",
    defaultBranch: "master",
  },
  {
    id: "6",
    name: "machine-learning-experiments",
    description:
      "Various ML experiments and model implementations using TensorFlow and PyTorch",
    isPrivate: true,
    language: "Python",
    languageColor: "#3572A5",
    stars: 12,
    forks: 2,
    updatedAt: "2 weeks ago",
    defaultBranch: "main",
  },
];

export function RepositoryList({
  searchQuery,
  repos,
}: {
  searchQuery: string;
  repos: Repository[];
}) {
  const [repositories] = useState<MyRepository[]>(mockRepositories);

  const filteredRepositories = repositories.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {repos.map((repo) => {
        const randomElement: MyRepository =
          mockRepositories[
            Math.floor(Math.random() * mockRepositories.length)
          ]!;

        return (
          <Card
            key={repo.id}
            className="p-6 bg-card border-border hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <Link href={`/repo/johndoe/${repo.name}`}>
                    <h3 className="text-lg font-semibold text-primary hover:underline cursor-pointer">
                      {repo.name}
                    </h3>
                  </Link>
                  {repo.isPublic ? (
                    <Badge
                      variant="secondary"
                      className="bg-secondary text-secondary-foreground"
                    >
                      <Lock className="h-3 w-3 mr-1" />
                      Private
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-border text-muted-foreground"
                    >
                      <Globe className="h-3 w-3 mr-1" />
                      Public
                    </Badge>
                  )}
                </div>

                <p className="text-muted-foreground mb-4 text-pretty">
                  {repo.desc}
                </p>

                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: randomElement.languageColor }}
                    />
                    <span>{randomElement.language}</span>
                  </div>

                  <button className="flex items-center space-x-1 hover:text-foreground transition-colors">
                    <Star className="h-4 w-4" />
                    <span>{randomElement.stars}</span>
                  </button>

                  <button className="flex items-center space-x-1 hover:text-foreground transition-colors">
                    <GitFork className="h-4 w-4" />
                    <span>{randomElement.forks}</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Updated {randomElement.updatedAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border bg-transparent"
                >
                  <Star className="h-4 w-4 mr-1" />
                  Star
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-popover border-border"
                  >
                    <DropdownMenuItem className="text-popover-foreground">
                      <GitBranch className="h-4 w-4 mr-2" />
                      View branches
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-popover-foreground">
                      <GitFork className="h-4 w-4 mr-2" />
                      Fork repository
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-popover-foreground">
                      Settings
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </Card>
        );
      })}
      {filteredRepositories.map((repo) => (
        <Card
          key={repo.id}
          className="p-6 bg-card border-border hover:border-primary/50 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <Link href={`/repo/johndoe/${repo.name}`}>
                  <h3 className="text-lg font-semibold text-primary hover:underline cursor-pointer">
                    {repo.name}
                  </h3>
                </Link>
                {repo.isPrivate ? (
                  <Badge
                    variant="secondary"
                    className="bg-secondary text-secondary-foreground"
                  >
                    <Lock className="h-3 w-3 mr-1" />
                    Private
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-border text-muted-foreground"
                  >
                    <Globe className="h-3 w-3 mr-1" />
                    Public
                  </Badge>
                )}
              </div>

              <p className="text-muted-foreground mb-4 text-pretty">
                {repo.description}
              </p>

              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: repo.languageColor }}
                  />
                  <span>{repo.language}</span>
                </div>

                <button className="flex items-center space-x-1 hover:text-foreground transition-colors">
                  <Star className="h-4 w-4" />
                  <span>{repo.stars}</span>
                </button>

                <button className="flex items-center space-x-1 hover:text-foreground transition-colors">
                  <GitFork className="h-4 w-4" />
                  <span>{repo.forks}</span>
                </button>

                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Updated {repo.updatedAt}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                className="border-border bg-transparent"
              >
                <Star className="h-4 w-4 mr-1" />
                Star
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-popover border-border"
                >
                  <DropdownMenuItem className="text-popover-foreground">
                    <GitBranch className="h-4 w-4 mr-2" />
                    View branches
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-popover-foreground">
                    <GitFork className="h-4 w-4 mr-2" />
                    Fork repository
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-popover-foreground">
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>
      ))}

      {filteredRepositories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No repositories found</p>
          <p className="text-muted-foreground">
            Try adjusting your search query
          </p>
        </div>
      )}
    </div>
  );
}
