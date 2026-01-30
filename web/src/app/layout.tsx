import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import Providers from "~/components/Providers";
import { StoreProvider } from "~/components/providers/StoreProvider";
import { AuthGuard } from "~/components/providers/AuthGuard";
import { UserProvider } from "~/components/auth/AuthComponent";
import { Toaster } from "~/components/ui/sonner";
import MyLayout from "~/components/layout/MyLayout";
import { ThemeProvider } from "~/components/theme-provider";

export const metadata: Metadata = {
  title: "Model Merge Betting | Home",
  description: "Stake on AI model merges and earn rewards",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <body>
        <StoreProvider>
          <Providers>
            <UserProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <AuthGuard>
                  <MyLayout>{children}</MyLayout>
                  <Toaster />
                </AuthGuard>
              </ThemeProvider>
            </UserProvider>
          </Providers>
        </StoreProvider>
      </body>
    </html>
  );
}
