import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

interface PropertyCardProps {
  id: string;
  price: number;
  province: string;
  district: string;
  landArea: number;
  imageUrl: string;
  isVerified: boolean; // มาจากสถานะ Smart Validation
}

export default function PropertyCard({
  id,
  price,
  province,
  district,
  landArea,
  imageUrl,
  isVerified,
}: PropertyCardProps) {
  return (
    <div className="group relative bg-white rounded-xl border border-trd-border overflow-hidden shadow-card hover:shadow-lg transition-shadow duration-300 flex flex-col">
      
      {/* รูปภาพและ Badge แสดงสถานะ */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image 
          src={imageUrl} 
          alt={`ที่ราชพัสดุ ${district} ${province}`} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {isVerified && (
          <div className="absolute top-3 left-3 bg-status-valid text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            ตรวจสอบสัญญาแล้ว
          </div>
        )}
      </div>

      {/* ข้อมูลรายละเอียด */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-trd-primary font-bold text-lg leading-tight">
              {district}, {province}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              พื้นที่ {landArea} ตารางวา
            </p>
          </div>
        </div>

        {/* ราคา */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-1">ค่าตอบแทนการโอนสิทธิ</p>
            <p className="text-xl font-bold text-trd-secondary">
              ฿{formatCurrency(price)}
            </p>
          </div>
          
          <a
            href={`/listings/${id}`}
            className="bg-trd-primary hover:bg-opacity-90 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
          >
            ดูรายละเอียด
          </a>
        </div>
      </div>
    </div>
  );
}
