import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile - ModelMerge",
  description: "View your validator profile, stats, and achievements",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
