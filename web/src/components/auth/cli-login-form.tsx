"use client";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import LoadingSpinner from "./LoadingSpinner";
import { authCLI } from "~/app/api/manageCLI";

interface LoginFormProps extends React.ComponentPropsWithoutRef<"div"> {
  sessionId: string;
}

export function LoginForm({ sessionId, className, ...props }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    redirect: false,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const res = await authCLI({
      sessionId,
      email: formData.email,
      password: formData.password,
    });

    if (res == 403) {
      toast("Invalid Credentials", {
        description: "Try again in sometime",
      });
      setLoading(false);
    } else {
      toast("Login Successful", {
        description: "Return to your terminal",
      });
      setLoading(false);
      //   router.push("/");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          {/* <CardDescription>
            Login with your Apple or Google account
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    onChange={(e) => {
                      setFormData((prevState) => ({
                        ...prevState,
                        email: e.target.value,
                      }));
                    }}
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    onChange={(e) => {
                      setFormData((prevState) => ({
                        ...prevState,
                        password: e.target.value,
                      }));
                    }}
                    placeholder="*******"
                    id="password"
                    type="password"
                    required
                  />
                </div>
                <Button
                  disabled={formData.email == "" || formData.password == ""}
                  type="submit"
                  className="w-full cursor-pointer bg-white disabled:opacity-50"
                >
                  Login
                  {loading ? <LoadingSpinner /> : <></>}
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
