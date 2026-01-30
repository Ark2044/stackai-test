"use client";
import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "~/components/auth/cli-login-form";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const params = useSearchParams();
  const router = useRouter();
  const sessionId = params.get("sessionId");

  if (!sessionId) {
    router.push("/login");
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          StackAI
        </a>
        <LoginForm sessionId={sessionId!} />
      </div>
    </div>
  );
}
