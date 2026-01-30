"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

const navigation = [
  { name: "Dashboard", href: "/" },
  { name: "Models", href: "/models" },
  { name: "Merge Request", href: "/merge" },
  { name: "Staking", href: "/staking" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <Card className="border-b rounded-none">
      <nav className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-8">
          <h1 className="text-xl font-semibold">Validator Network</h1>
          <div className="flex space-x-1">
            {navigation.map((item) => (
              <Button
                key={item.name}
                variant={pathname === item.href ? "default" : "ghost"}
                asChild
              >
                <Link href={item.href}>{item.name}</Link>
              </Button>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground">
            Connected: 0x1234...5678
          </div>
        </div>
      </nav>
    </Card>
  );
}
