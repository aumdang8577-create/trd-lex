import PropertyDetailPage from "./PropertyDetailPageClient";

export async function generateStaticParams() {
  return [
    { id: "list-1" },
    { id: "list-2" },
    { id: "list-3" },
    { id: "list-4" },
    { id: "list-5" },
    { id: "list-6" },
    { id: "list-7" },
    { id: "list-8" },
    { id: "list-9" },
    { id: "list-10" },
    { id: "list-11" },
    { id: "list-12" },
    { id: "list-13" },
    { id: "list-14" },
    { id: "list-15" },
    { id: "list-16" },
    { id: "list-17" },
    { id: "list-18" },
    { id: "list-19" },
    { id: "list-20" },
  ];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  return <PropertyDetailPage params={params} />;
}
