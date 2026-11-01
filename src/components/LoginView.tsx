import React, { useState } from 'react';
import {
  Lock,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertTriangle,
  ArrowRight,
  Building2
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      // Validate credentials requested by user:
      // Username=Admin, Password=Admin@042583130
      const trimmedUser = username.trim();
      const trimmedPass = password.trim();

      if (
        (trimmedUser.toLowerCase() === 'admin') &&
        trimmedPass === 'Admin@042583130'
      ) {
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setErrorMessage('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 flex flex-col justify-between p-4 sm:p-6 text-slate-100 font-['Sarabun',sans-serif]">
      {/* Top Bar Branding */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between py-2 text-xs text-emerald-200/80">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-300" />
          <span>ระบบสารสนเทศราชการความปลอดภัยสูง (Government Secure Gateway)</span>
        </div>
        <div className="hidden sm:block text-slate-400">
          เทศบาลตำบลพระซอง อำเภอนาแก จังหวัดนครพนม
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto my-auto py-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle glow background */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Logo & Seal Header */}
          <div className="text-center mb-6">
            <div className="w-24 h-24 mx-auto mb-3.5 p-1 bg-white rounded-full shadow-xl border-2 border-amber-400/80 flex items-center justify-center overflow-hidden ring-4 ring-white/10">
              <img
                src="/assets/aistudio/S__11100249_e2fbf4d1.jpg"
                alt="ตราเทศบาลตำบลพระซอง"
                className="w-full h-full object-contain rounded-full"
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[11px] font-bold mb-2">
              <Building2 className="w-3 h-3" />
              <span>เทศบาลตำบลพระซอง อ.นาแก จ.นครพนม</span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
              ระบบต่อใบอนุญาตประกอบกิจการ
            </h2>
            <p className="text-xs text-emerald-200/90 mt-0.5">
              ที่เป็นอันตรายต่อสุขภาพ • กองสาธารณสุขและสิ่งแวดล้อม
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5 animate-shake">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1.5">
                ชื่อผู้ใช้งาน (Username)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-300/70">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ชื่อผู้ใช้งาน"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-emerald-700/60 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1.5">
                รหัสผ่าน (Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-300/70">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="รหัสผ่าน"
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-900/60 border border-emerald-700/60 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
              <span>จำกัดสิทธิ์เฉพาะเจ้าหน้าที่ที่ได้รับอนุญาตเท่านั้น</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-[0.99] text-slate-950 font-bold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>เข้าสู่ระบบจัดการ (Sign In)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-4 border-t border-white/10 text-center text-[11px] text-slate-400 leading-relaxed">
            <p className="flex items-center justify-center gap-1.5 text-emerald-300/80 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="font-semibold">ระบบยืนยันตัวตนเจ้าพนักงานสาธารณสุข</span>
            </p>
            <p>เพื่อความปลอดภัยของข้อมูลสถานประกอบการและประวัติราชการ</p>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="max-w-7xl mx-auto w-full text-center py-2 text-xs text-slate-500">
        <p>กองสาธารณสุขและสิ่งแวดล้อม ร่วมกับ งานเทคโนโลยีสารสนเทศ เทศบาลตำบลพระซอง</p>
      </div>
    </div>
  );
};
