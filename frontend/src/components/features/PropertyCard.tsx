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
  buildingType?: string | null;
  usableAreaSqm?: number | null;
  zoning?: string | null;
}

export default function PropertyCard({
  id,
  price,
  province,
  district,
  landArea,
  imageUrl,
  isVerified,
  buildingType,
  usableAreaSqm,
  zoning,
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
          <div className="w-full">
            <h3 className="text-trd-primary font-bold text-lg leading-tight">
              {district}, {province}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              พื้นที่ที่ดิน {landArea} ตารางวา
            </p>
            {buildingType && (
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="bg-trd-primary/10 text-trd-primary text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                  🏢 {buildingType}
                </span>
                {usableAreaSqm && usableAreaSqm > 0 ? (
                  <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded">
                    📐 พื้นที่ใช้สอย {usableAreaSqm} ตร.ม.
                  </span>
                ) : null}
              </div>
            )}
            {zoning && (
              <div className="mt-2 text-xs flex items-center gap-1.5 flex-wrap">
                <span className="text-gray-400 font-medium">ผังเมือง:</span>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                  zoning.includes('สีแดง') ? 'bg-red-50 text-red-600 border border-red-200' :
                  zoning.includes('สีเหลือง') ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                  zoning.includes('สีส้ม') ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                  zoning.includes('สีม่วง') ? 'bg-purple-50 text-purple-600 border border-purple-200' :
                  'bg-green-50 text-green-700 border border-green-200'
                }`}>
                  {zoning}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ราคา */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-1">ค่าตอบแทนการโอนสิทธิ</p>
            <p className="text-xl font-bold text-trd-secondary">
              {formatCurrency(price)}
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
