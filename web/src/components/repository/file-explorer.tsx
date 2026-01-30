"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  File,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  FileText,
  ImageIcon,
  Code,
  Settings,
  Package,
} from "lucide-react";

interface FileItem {
  name: string;
  type: "file" | "folder";
  size?: string;
  lastModified: string;
  lastCommit: string;
  children?: FileItem[];
}

const mockFiles: FileItem[] = [
  {
    name: "src",
    type: "folder",
    lastModified: "2 hours ago",
    lastCommit: "feat: add new component library",
    children: [
      {
        name: "components",
        type: "folder",
        lastModified: "2 hours ago",
        lastCommit: "feat: add button variants",
        children: [
          {
            name: "ui",
            type: "folder",
            lastModified: "2 hours ago",
            lastCommit: "feat: add shadcn components",
            children: [
              {
                name: "button.tsx",
                type: "file",
                size: "2.1 KB",
                lastModified: "2 hours ago",
                lastCommit: "feat: add button variants",
              },
              {
                name: "card.tsx",
                type: "file",
                size: "1.8 KB",
                lastModified: "3 hours ago",
                lastCommit: "feat: add card component",
              },
              {
                name: "input.tsx",
                type: "file",
                size: "1.5 KB",
                lastModified: "1 day ago",
                lastCommit: "feat: add input component",
              },
            ],
          },
          {
            name: "header.tsx",
            type: "file",
            size: "3.2 KB",
            lastModified: "1 day ago",
            lastCommit: "feat: add responsive header",
          },
          {
            name: "footer.tsx",
            type: "file",
            size: "1.9 KB",
            lastModified: "2 days ago",
            lastCommit: "feat: add footer component",
          },
        ],
      },
      {
        name: "hooks",
        type: "folder",
        lastModified: "3 days ago",
        lastCommit: "feat: add custom hooks",
        children: [
          {
            name: "use-theme.ts",
            type: "file",
            size: "1.2 KB",
            lastModified: "3 days ago",
            lastCommit: "feat: add theme hook",
          },
          {
            name: "use-local-storage.ts",
            type: "file",
            size: "0.8 KB",
            lastModified: "1 week ago",
            lastCommit: "feat: add localStorage hook",
          },
        ],
      },
      {
        name: "utils.ts",
        type: "file",
        size: "2.5 KB",
        lastModified: "1 week ago",
        lastCommit: "feat: add utility functions",
      },
      {
        name: "types.ts",
        type: "file",
        size: "1.1 KB",
        lastModified: "1 week ago",
        lastCommit: "feat: add TypeScript types",
      },
    ],
  },
  {
    name: "public",
    type: "folder",
    lastModified: "1 week ago",
    lastCommit: "feat: add static assets",
    children: [
      {
        name: "favicon.ico",
        type: "file",
        size: "4.2 KB",
        lastModified: "1 week ago",
        lastCommit: "feat: add favicon",
      },
      {
        name: "logo.svg",
        type: "file",
        size: "2.8 KB",
        lastModified: "1 week ago",
        lastCommit: "feat: add logo",
      },
    ],
  },
  {
    name: "package.json",
    type: "file",
    size: "1.8 KB",
    lastModified: "2 days ago",
    lastCommit: "chore: update dependencies",
  },
  {
    name: "README.md",
    type: "file",
    size: "3.5 KB",
    lastModified: "1 week ago",
    lastCommit: "docs: update README",
  },
  {
    name: "tsconfig.json",
    type: "file",
    size: "0.9 KB",
    lastModified: "2 weeks ago",
    lastCommit: "feat: configure TypeScript",
  },
  {
    name: ".gitignore",
    type: "file",
    size: "0.5 KB",
    lastModified: "2 weeks ago",
    lastCommit: "feat: add gitignore",
  },
];

interface FileExplorerProps {
  branch: string;
}

export function FileExplorer({ branch }: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const getFileIcon = (fileName: string, type: string) => {
    if (type === "folder") {
      return expandedFolders.has(fileName) ? FolderOpen : Folder;
    }

    const extension = fileName.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "tsx":
      case "ts":
      case "js":
      case "jsx":
        return Code;
      case "json":
        return Settings;
      case "md":
        return FileText;
      case "png":
      case "jpg":
      case "jpeg":
      case "svg":
      case "ico":
        return ImageIcon;
      case "lock":
        return Package;
      default:
        return File;
    }
  };

  const renderFileTree = (files: FileItem[], depth = 0, parentPath = "") => {
    return files.map((file) => {
      const currentPath = parentPath ? `${parentPath}/${file.name}` : file.name;
      const isExpanded = expandedFolders.has(currentPath);
      const Icon = getFileIcon(file.name, file.type);

      return (
        <div key={currentPath}>
          <div
            className={`flex items-center space-x-2 py-2 px-3 hover:bg-muted/50 cursor-pointer group ${
              depth > 0 ? "ml-" + depth * 4 : ""
            }`}
            style={{ paddingLeft: `${12 + depth * 16}px` }}
            onClick={() => file.type === "folder" && toggleFolder(currentPath)}
          >
            {file.type === "folder" && (
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>
            )}
            {file.type === "file" && <div className="w-4" />}

            <Icon className="h-4 w-4 text-muted-foreground" />

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground hover:text-primary transition-colors truncate">
                  {file.name}
                </span>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="truncate max-w-48">{file.lastCommit}</span>
                  <span className="whitespace-nowrap">{file.lastModified}</span>
                  {file.size && (
                    <span className="whitespace-nowrap">{file.size}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {file.type === "folder" && isExpanded && file.children && (
            <div>{renderFileTree(file.children, depth + 1, currentPath)}</div>
          )}
        </div>
      );
    });
  };

  return <div className="text-sm">{renderFileTree(mockFiles)}</div>;
}
