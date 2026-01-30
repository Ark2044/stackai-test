"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "~/components/ui/button";

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  // Prevent rendering on server
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {resolvedTheme === "dark" ? (
        <Button onClick={() => setTheme("light")} variant={"outline"}>
          <Sun size={16} aria-hidden="true" />
        </Button>
      ) : (
        <Button onClick={() => setTheme("dark")} variant={"outline"}>
          <Moon size={16} aria-hidden="true" />
        </Button>
      )}
    </>
  );
}
