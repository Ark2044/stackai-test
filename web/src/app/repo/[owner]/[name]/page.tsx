import { RepositoryView } from "~/components/repository/repository-view";
import type { Metadata } from "next";

interface RepositoryPageProps {
  params: {
    owner: string;
    name: string;
  };
}

export async function generateMetadata({ params }: RepositoryPageProps): Promise<Metadata> {
  // Decode URI components
  const owner = decodeURIComponent(params.owner);
  const name = decodeURIComponent(params.name);
  
  return {
    title: `${owner}/${name} - ModelMerge`,
    description: `View repository ${owner}/${name} on ModelMerge`,
  };
}

// Dynamic page with ISR - revalidate every 60 seconds
export const revalidate = 60;

export default function RepositoryPage({ params }: RepositoryPageProps) {
  return <RepositoryView owner={params.owner} name={params.name} />;
}
