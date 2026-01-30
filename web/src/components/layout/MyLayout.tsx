"use client";
import {
  CalendarFold,
  GitMerge,
  Home,
  PackageOpen,
  PanelLeft,
  User2,
  UserCircle2,
  Users2,
  ChevronDown,
  Layers,
  Menu,
  X,
  FolderGit2,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { Input } from "~/components/ui/input";
import { Search, Book } from "lucide-react";
import { cn } from "~/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetClose } from "~/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import type { User } from "@prisma/client";
import { ModeToggle } from "./ModeToggle";
import { usePathname } from "next/navigation";
import { useUser } from "../auth/AuthComponent";
import { useAuth } from "~/hooks/useAuth";
import { WalletConnectButton } from "../betting/wallet-connect-button";

const Navbar = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [links, setLinks] = useState([
    { title: "Home", href: "/", icon: <Home className="h-5 w-5" /> },
    { title: "Dashboard", href: "/dashboard", icon: <PackageOpen className="h-5 w-5" /> },
    { title: "Models", href: "/validators/models", icon: <Layers className="h-5 w-5" /> },
    { title: "Repo", href: "/repo/demo/model-gpt-vision", icon: <FolderGit2 className="h-5 w-5" /> },
    { title: "Merge", href: "/merge", icon: <GitMerge className="h-5 w-5" /> },
  ]);
  const { user } = useUser();
  const { logout } = useAuth();

  // Track scroll for header blur effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Desktop & Tablet Header */}
      <header className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        scrolled 
          ? "bg-background/70 backdrop-blur-2xl border-b border-border/50 shadow-sm" 
          : "bg-transparent"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <div className="flex items-center space-x-8 lg:space-x-12">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/30 blur-xl group-hover:bg-primary/40 transition-all duration-500 rounded-full" />
                  <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                    <Book className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                <span className="text-xl font-bold text-foreground tracking-tight hidden sm:block">
                  Model<span className="text-gradient">Merge</span>
                </span>
              </Link>
              
              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-1">
                {links.slice(1).map((link) => (
                  <NavLink key={link.href} href={link.href} active={pathname === link.href}>
                    {link.title}
                  </NavLink>
                ))}
              </nav>
            </div>
            
            {/* Right Side Actions */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              {/* Search - Desktop only */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-48 lg:w-64 h-10 bg-muted/30 border-border/50 focus:border-primary/50 focus:bg-background/80 transition-all rounded-xl backdrop-blur-sm"
                />
              </div>
              
              <ModeToggle />
              
              {user ? (
                <>
                  <WalletConnectButton />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-xl hover:bg-primary/10 transition-all duration-300 border border-transparent hover:border-primary/20">
                        {user.image ? (
                          <Image
                            src={user.image}
                            height={36}
                            width={36}
                            className="rounded-lg object-cover"
                            alt={user.name!}
                          />
                        ) : (
                          <UserCircle2 className="h-5 w-5" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 border-border/50 bg-card/95 backdrop-blur-xl">
                      <DropdownMenuLabel className="px-3 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                            {user.image ? (
                              <Image
                                src={user.image}
                                height={40}
                                width={40}
                                className="rounded-lg object-cover"
                                alt={user.name!}
                              />
                            ) : (
                              <UserCircle2 className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div className="flex flex-col space-y-0.5">
                            <p className="text-sm font-semibold">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[150px]">{user.email}</p>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="my-2" />
                      <Link href={`/profile/${user.id}`}>
                        <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2.5 focus:bg-primary/10">
                          <UserCircle2 className="mr-3 h-4 w-4 text-primary" />
                          Profile
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/dashboard">
                        <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2.5 focus:bg-primary/10">
                          <PackageOpen className="mr-3 h-4 w-4 text-primary" />
                          Dashboard
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator className="my-2" />
                      <DropdownMenuItem
                        onClick={logout}
                        className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 rounded-xl px-3 py-2.5"
                      >
                        Sign Out & Disconnect
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Link href="/login">
                  <Button className="gradient-primary text-white hover:opacity-95 shadow-md hover:shadow-lg rounded-xl px-6 transition-all duration-300">
                    Sign In
                  </Button>
                </Link>
              )}
              
              {/* Mobile Menu Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden rounded-xl hover:bg-primary/10 border border-transparent hover:border-primary/20">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-80 p-0 border-l-border/50 bg-background/95 backdrop-blur-2xl">
                  <div className="flex flex-col h-full">
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border/50">
                      <Link href="/" className="flex items-center space-x-2">
                        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                          <Book className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-lg font-bold">
                          Model<span className="text-gradient">Merge</span>
                        </span>
                      </Link>
                    </div>
                    
                    {/* Mobile Search */}
                    <div className="p-4 border-b border-border/50">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 h-11 bg-muted/30 border-border/50 rounded-xl"
                        />
                      </div>
                    </div>
                    
                    {/* Mobile Navigation */}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                      {links.map((link) => (
                        <SheetClose asChild key={link.href}>
                          <Link
                            href={link.href}
                            className={cn(
                              "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300",
                              pathname === link.href 
                                ? "bg-primary/10 text-primary font-medium border border-primary/20" 
                                : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <div className={cn(
                              "flex items-center justify-center w-10 h-10 rounded-xl transition-all",
                              pathname === link.href 
                                ? "bg-primary/20" 
                                : "bg-muted/50"
                            )}>
                              {link.icon}
                            </div>
                            <span className="text-base">{link.title}</span>
                          </Link>
                        </SheetClose>
                      ))}
                    </nav>
                    
                    {/* Mobile User Section */}
                    <div className="p-4 border-t border-border/50 mt-auto">
                      {user ? (
                        <div className="space-y-4">
                          <Link href={`/profile/${user.id}`}>
                            <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                                {user.image ? (
                                  <Image
                                    src={user.image}
                                    height={48}
                                    width={48}
                                    className="rounded-xl object-cover"
                                    alt={user.name!}
                                  />
                                ) : (
                                  <UserCircle2 className="h-6 w-6 text-primary" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold truncate">{user.name}</p>
                                <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                              </div>
                            </div>
                          </Link>
                          <Button
                            onClick={logout}
                            variant="destructive"
                            className="w-full h-12 rounded-xl"
                          >
                            Sign Out & Disconnect
                          </Button>
                        </div>
                      ) : (
                        <Link href="/login" className="block">
                          <Button className="w-full h-12 gradient-primary text-white rounded-xl">
                            Sign In
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="flex w-full flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </>
  );
};

export default Navbar;

// Navigation Link Component
function NavLink({ 
  href, 
  active, 
  children 
}: { 
  href: string; 
  active: boolean; 
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative group",
        active
          ? "text-primary bg-primary/10 border border-primary/20"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      )}
    >
      <span className="relative z-10">{children}</span>
      {active && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-primary via-accent to-primary rounded-full" />
      )}
      {!active && (
        <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </Link>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <div>
        <a
          ref={ref}
          className={cn(
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-xl p-3 leading-none no-underline transition-colors outline-none select-none",
            className
          )}
          {...props}
        >
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </a>
      </div>
    </li>
  );
});
ListItem.displayName = "ListItem";
