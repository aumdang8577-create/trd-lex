import type { Metadata } from "next";
import PropertyDetailPage from "./PropertyDetailPageClient";
import api from "@/lib/api";
import type { Listing } from "@/types";

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  let listing: Listing | null = null;
  try {
    listing = await api.getListingById(id);
  } catch (err) {
    console.warn(`[SEO] Could not fetch remote listing ${id} for metadata generation:`, err);
  }

  // Define default fallback meta if listing is not found or API fails
  const province = listing?.contract?.province || "ประเทศไทย";
  const district = listing?.contract?.district || "ทำเลศักยภาพ";
  const contractNumber = listing?.contract?.contract_number || id;
  const askingPrice = listing?.asking_price
    ? `ราคาเสนอโอน ฿${listing.asking_price.toLocaleString("th-TH")}`
    : "ราคาเสนอโอนสิทธิ์ที่ราชพัสดุ";

  const title = listing
    ? `โอนสิทธิ์เช่าที่ราชพัสดุ อ.${district} จ.${province} (${contractNumber}) | TRD-LEX`
    : `รายละเอียดประกาศโอนสิทธิ์ที่ราชพัสดุ (${id}) | TRD-LEX`;

  const rawDescription = listing?.description || `ประกาศเสนอโอนสิทธิการเช่าที่ราชพัสดุ อ.${district} จ.${province} ${askingPrice} ผ่านการตรวจสอบทะเบียนสิทธิ์จากกรมธนารักษ์`;
  const description = rawDescription.length > 155 ? `${rawDescription.slice(0, 155)}...` : rawDescription;

  // Use primary image or fallback default OG image
  const ogImageUrl = (listing?.image_urls && listing.image_urls.length > 0 && listing.image_urls[0])
    ? listing.image_urls[0]
    : "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&h=630&q=80";

  const pageUrl = `https://trd-lex.go.th/listings/${id}`;

  return {
    title,
    description,
    keywords: [
      "โอนสิทธิการเช่า",
      "ที่ราชพัสดุ",
      `ที่ดิน${province}`,
      `เช่าที่ดิน${district}`,
      "กรมธนารักษ์",
      "TRD-LEX",
      contractNumber,
    ],
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "TRD-LEX | แพลตฟอร์มเปลี่ยนมือสิทธิการเช่าที่ราชพัสดุ",
      locale: "th_TH",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `ภาพทำเลศักยภาพที่ราชพัสดุ อ.${district} จ.${province}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function Page({ params }: PageProps) {
  return <PropertyDetailPage params={params} />;
}
