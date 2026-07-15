"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card, { CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import api from "@/lib/api";

export default function RegisterPage() {
  const [contractNumber, setContractNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [validatedData, setValidatedData] = useState<any>(null);

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setValidatedData(null);
    setLoading(true);

    if (!contractNumber) {
      setError("กรุณากรอกเลขที่สัญญาเช่าราชพัสดุ");
      setLoading(false);
      return;
    }

    try {
      const response = await api.validateContract({ contract_number: contractNumber });
      if (response.is_valid && response.contract_data) {
        setValidatedData(response.contract_data);
        setSuccessMsg(response.message);
      } else {
        setError(response.message || "สัญญาเช่านี้ไม่ผ่านการตรวจสอบ");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการตรวจสอบสัญญาเช่า");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-trd-surface">
      <Card className="w-full max-w-lg overflow-hidden">
        <CardHeader className="text-center bg-trd-primary text-white py-8">
          <div className="w-12 h-12 bg-trd-secondary rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
            <span className="text-trd-primary-dark font-bold text-xl">📄</span>
          </div>
          <h2 className="text-xl font-bold">ตรวจสอบสัญญาเช่าที่ราชพัสดุ</h2>
          <p className="text-xs text-white/80 mt-1">
            ลงทะเบียนยืนยันสัญญากับฐานข้อมูลของกรมธนารักษ์ (Smart Validation)
          </p>
        </CardHeader>

        <CardContent className="pt-8">
          {error && (
            <div className="bg-status-invalid/10 border border-status-invalid/20 text-status-invalid rounded-lg p-3 text-sm mb-6">
              ⚠️ {error}
            </div>
          )}

          {successMsg && (
            <div className="bg-status-valid/10 border border-status-valid/20 text-status-valid rounded-lg p-3 text-sm mb-6">
              🎉 {successMsg}
            </div>
          )}

          {/* Verification Form */}
          {!validatedData ? (
            <form onSubmit={handleValidate} className="space-y-6">
              <Input
                label="เลขที่สัญญาเช่าที่ราชพัสดุ"
                placeholder="ระบุรหัสสัญญาเช่าของคุณ"
                value={contractNumber}
                onChange={(e) => setContractNumber(e.target.value)}
                required
                disabled={loading}
                helperText="สัญญาเช่าแนะนำสำหรับทดสอบระบบ: TRD-66-001 (กรุงเทพฯ) หรือ TRD-66-002 (ชลบุรี)"
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full py-3 mt-4"
                isLoading={loading}
              >
                ตรวจสอบสถานะสัญญา
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-50 border border-trd-border rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-semibold text-trd-primary border-b border-trd-border/50 pb-2">
                  📋 ข้อมูลสัญญาเช่าที่ระบบตรวจพบ
                </h3>
                <div className="grid grid-cols-2 gap-y-2 text-xs">
                  <span className="text-gray-400">เลขที่สัญญา:</span>
                  <span className="font-semibold text-gray-800">{validatedData.contract_number}</span>
                  <span className="text-gray-400">ทะเบียนที่ราชพัสดุเลขที่:</span>
                  <span className="font-semibold text-gray-800">{validatedData.parcel_number}</span>
                  
                  <span className="text-gray-400">พื้นที่รวม:</span>
                  <span className="font-semibold text-gray-800">{validatedData.land_area_sqw} ตารางวา</span>
                  
                  <span className="text-gray-400">ที่ตั้ง:</span>
                  <span className="font-semibold text-gray-800">
                    {validatedData.sub_district} - {validatedData.district} - {validatedData.province}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setValidatedData(null)}
                  className="flex-1 py-3"
                >
                  ย้อนกลับ
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    window.location.href = "/login";
                  }}
                  className="flex-1 py-3"
                >
                  ลงชื่อเข้าใช้งาน
                </Button>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="bg-gray-50 flex items-center justify-center text-xs text-gray-400">
          <Link href="/login" className="text-trd-primary underline hover:text-trd-primary-light">
            มีสิทธิ์ในระบบและบัญชีใช้งานอยู่แล้ว? เข้าสู่ระบบที่นี่
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
