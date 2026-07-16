"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card, { CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [thaidId, setThaidId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (thaidId.length !== 13) {
      setError("เลขบัตรประชาชนจำลอง ThaID ต้องมี 13 หลัก");
      setLoading(false);
      return;
    }

    try {
      const response = await api.login({ thaid_id: thaidId });
      setSuccess(true);
      // Redirect or state update (in mock we just show login success)
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "การเข้าสู่ระบบผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-trd-surface">
      <Card className="w-full max-w-md overflow-hidden">
        <CardHeader className="text-center bg-trd-primary text-white py-8">
          <div className="w-12 h-12 bg-trd-secondary rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
            <span className="text-trd-primary-dark font-bold text-xl">🛡️</span>
          </div>
          <h2 className="text-xl font-bold">เข้าสู่ระบบด้วย ThaID</h2>
          <p className="text-xs text-white/80 mt-1">
            ระบบจำลองการเข้าสู่ระบบเพื่อตรวจสอบสิทธิ์สัญญาราชพัสดุ
          </p>
        </CardHeader>

        <CardContent className="pt-8">
          {error && (
            <div className="bg-status-invalid/10 border border-status-invalid/20 text-status-invalid rounded-lg p-3 text-sm mb-6 flex items-center gap-2">
              <span>⚠️</span>
              {error}
            </div>
          )}

          {success && (
            <div className="bg-status-valid/10 border border-status-valid/20 text-status-valid rounded-lg p-3 text-sm mb-6 flex items-center gap-2">
              <span>✅</span>
              เข้าสู่ระบบสำเร็จ! กำลังนำคุณกลับหน้าหลัก...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="เลขประจำตัวประชาชน (ThaID)"
              placeholder="กรอกเลข 13 หลักของบัญชีทดสอบ"
              value={thaidId}
              onChange={(e) => setThaidId(e.target.value.replace(/\D/g, ""))}
              maxLength={13}
              required
              disabled={loading || success}
              helperText="บัญชีสำหรับทดสอบ: 1123456789012 (สมชาย), 2123456789012 (สมหญิง) หรือ 9123456789012 (แอดมิน)"
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 mt-4"
              isLoading={loading || success}
            >
              ยืนยันการเข้าสู่ระบบ
            </Button>
          </form>
        </CardContent>

        <CardFooter className="bg-gray-50 flex flex-col gap-2 items-center justify-center text-xs text-gray-400">
          <span>ความมั่นคงปลอดภัยระดับเดียวกับกรมธนารักษ์และกรมการปกครอง</span>
          <Link href="/register" className="text-trd-primary underline hover:text-trd-primary-light">
            สมัครสมาชิกใหม่ / ตรวจสอบสิทธิ์สัญญาเช่าก่อนลงประกาศ
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
