"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Checkbox } from "~/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Lock, Globe, AlertCircle, Loader2 } from "lucide-react";
import { useUser } from "../auth/AuthComponent";
import { createRepo } from "~/app/api/manageRepo";
import type { Prisma } from "@prisma/client";
import { toast } from "sonner";

interface CreateRepositoryFormProps {
  onClose: () => void;
}

export function CreateRepositoryForm({ onClose }: CreateRepositoryFormProps) {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    isPublic: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const repoData: Prisma.RepositoryCreateInput = {
        ...formData,
        ownerId: user?.id as string,
      };
      await createRepo(repoData);
      toast.success("Repository Created Successfully");
      console.log("Creating repository:", repoData);
      onClose();
    } catch (error) {
      toast.error("Failed to create repository");
      console.error("Error creating repository:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-3">
      <div className="space-y-2">
        <Label htmlFor="repo-name" className="text-foreground">
          Repository name *
        </Label>
        <Input
          id="repo-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="my-awesome-project"
          className="bg-input border-border text-foreground"
          required
        />
        <p className="text-xs text-muted-foreground">
          Great repository names are short and memorable.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-foreground">
          Description (optional)
        </Label>
        <Textarea
          id="description"
          value={formData.desc}
          onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
          placeholder="A short description of your repository"
          className="bg-input border-border text-foreground resize-none"
          rows={3}
        />
      </div>

      <div className="space-y-3">
        <Label className="text-foreground">Visibility</Label>
        <RadioGroup
          value={formData.isPublic ? "public" : "private"}
          onValueChange={(value) =>
            setFormData({ ...formData, isPublic: value == "public" })
          }
          className="space-y-3"
        >
          <div className="flex items-start space-x-3 p-3 border border-border rounded-md">
            <RadioGroupItem value="public" id="public" className="mt-1" />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="public" className="font-medium text-foreground">
                  Public
                </Label>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Anyone on the internet can see this repository
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 border border-border rounded-md">
            <RadioGroupItem value="private" id="private" className="mt-1" />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <Label
                  htmlFor="private"
                  className="font-medium text-foreground"
                >
                  Private
                </Label>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                You choose who can see and commit to this repository
              </p>
            </div>
          </div>
        </RadioGroup>
      </div>

      <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-md">
        <AlertCircle className="h-4 w-4 text-warning" />
        <p className="text-sm text-muted-foreground">
          You are creating a repository in your personal account.
        </p>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
          className="border-border bg-transparent"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!formData.name || isSubmitting}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create repository"
          )}
        </Button>
      </div>
    </form>
  );
}
