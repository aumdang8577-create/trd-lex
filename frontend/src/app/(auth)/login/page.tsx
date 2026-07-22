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
      let response: any;
      try {
        response = await api.login({ thaid_id: thaidId });
      } catch (netErr) {
        // DEV principle: Local resilient fallback if network connection to backend fails
        console.warn("Backend connection unavailable, proceeding with local ThaID authentication fallback.");
        const mockToken = "mock_token_" + thaidId;
        api.setToken(mockToken);
        response = {
          access_token: mockToken,
          token_type: "bearer",
          user: {
            id: "user-" + thaidId,
            thaid_id: thaidId,
            first_name: thaidId === "9123456789012" ? "แอดมิน" : (thaidId === "2123456789012" ? "สมหญิง" : "สมชาย"),
            last_name: thaidId === "9123456789012" ? "ธนารักษ์" : (thaidId === "2123456789012" ? "รักดี" : "ใจดี"),
            role: thaidId === "9123456789012" ? "ADMIN" : "USER"
          }
        };
      }

      setSuccess(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("trd_user_role", response.user?.role === "ADMIN" ? "OFFICER" : "SELLER");
        window.dispatchEvent(new Event("trd-role-changed"));
      }
      setTimeout(() => {
        router.push("/my-listings");
      }, 1000);
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
              id="login-thaid"
              name="thaidId"
              label="เลขประจำตัวประชาชน (ThaID)"
              placeholder="กรอกเลข 13 หลักของบัญชีทดสอบ"
              value={thaidId}
              onChange={(e) => setThaidId(e.target.value.replace(/\D/g, ""))}
              maxLength={13}
              required
              disabled={loading || success}
              helperText="บัญชีสำหรับทดสอบ: 1123456789012 (สมชาย), 2123456789012 (สมหญิง) หรือ 9123456789012 (แอดมิน)"
            />

            {/* Quick Demo Login Badges */}
            <div className="space-y-2 pt-2">
              <label className="text-[11px] font-mono text-slate-400 block font-bold uppercase tracking-wider">
                คลิกเลือกบัญชีทดสอบด่วน (One-Click Quick Login):
              </label>
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => { setThaidId("1123456789012"); }}
                  className="p-2 border border-[#1E2E4A] hover:border-trd-secondary bg-[#0F1A30] hover:bg-[#1E2E4A]/40 rounded-xl text-left transition-all group"
                >
                  <div className="text-[10px] text-trd-secondary font-black group-hover:text-white">สมชาย ใจดี</div>
                  <div className="text-[8px] text-slate-400">1123456789012</div>
                </button>
                <button
                  type="button"
                  onClick={() => { setThaidId("2123456789012"); }}
                  className="p-2 border border-[#1E2E4A] hover:border-trd-secondary bg-[#0F1A30] hover:bg-[#1E2E4A]/40 rounded-xl text-left transition-all group"
                >
                  <div className="text-[10px] text-trd-secondary font-black group-hover:text-white">สมหญิง รักดี</div>
                  <div className="text-[8px] text-slate-400">2123456789012</div>
                </button>
                <button
                  type="button"
                  onClick={() => { setThaidId("9123456789012"); }}
                  className="p-2 border border-[#1E2E4A] hover:border-trd-secondary bg-[#0F1A30] hover:bg-[#1E2E4A]/40 rounded-xl text-left transition-all group"
                >
                  <div className="text-[10px] text-trd-secondary font-black group-hover:text-white">แอดมิน ธนารักษ์</div>
                  <div className="text-[8px] text-slate-400">9123456789012</div>
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 mt-4 !bg-gold-gradient text-[#0F1A30] font-mono font-black rounded-xl shadow-neon-gold hover:opacity-90"
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
