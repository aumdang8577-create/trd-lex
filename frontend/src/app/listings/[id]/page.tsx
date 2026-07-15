import PropertyDetailPage from "./PropertyDetailPageClient";

export async function generateStaticParams() {
  return [
    { id: "list-1" },
    { id: "list-2" },
    { id: "list-3" },
    { id: "list-4" },
    { id: "list-5" },
  ];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  return <PropertyDetailPage params={params} />;
}
