"use client";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "~/app/api/manageUser";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Loader2, Mail, Lock, User } from "lucide-react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const resUser = await createUser(formData);
      if (resUser) {
        const res = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });
        
        if (res?.ok) {
          // Wait a bit for session to be established
          await new Promise(resolve => setTimeout(resolve, 500));
          toast.success("Account created successfully!");
          router.push("/dashboard");
          router.refresh();
        } else if (res?.status == 401) {
          toast("Incorrect Credentials.");
          setLoading(false);
        } else {
          toast("Uh oh! Something went wrong.", {
            description: "Try again in sometime",
          });
          setLoading(false);
        }
      } else {
        toast.error("Failed to create account");
        setLoading(false);
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="relative z-10">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold">Join Us</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Name
                </Label>
                <Input
                  onChange={(e) => {
                    setFormData((prevState) => ({
                      ...prevState,
                      name: e.target.value,
                    }));
                  }}
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="relative z-10"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  Email
                </Label>
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
                  className="relative z-10"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" />
                    Password
                  </Label>
                </div>
                <Input
                  onChange={(e) => {
                    setFormData((prevState) => ({
                      ...prevState,
                      password: e.target.value,
                    }));
                  }}
                  placeholder="******"
                  id="password"
                  type="password"
                  required
                  className="relative z-10"
                />
              </div>
              <Button
                disabled={
                  formData.name == "" ||
                  formData.email == "" ||
                  formData.password == "" ||
                  loading
                }
                type="submit"
                className="w-full cursor-pointer gradient-primary text-white disabled:opacity-50 relative z-10"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </div>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4 text-primary cursor-pointer hover:text-primary/80 transition-colors">
                Login
              </Link>
            </div>
          </div>
        </form>
      </div>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary [&_a]:cursor-pointer">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
