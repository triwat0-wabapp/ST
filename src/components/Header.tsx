import React from 'react';
import {
  PieChart,
  Store,
  FileSignature,
  Bell,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  LogOut
} from 'lucide-react';

export type TabType = 'dashboard' | 'businesses' | 'renew' | 'notifications' | 'documents' | 'reports';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  expiringOrExpiredCount: number;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  expiringOrExpiredCount,
  onLogout
}) => {
  const navItems = [
    { id: 'dashboard' as TabType, label: 'แดชบอร์ดภาพรวม', icon: PieChart },
    { id: 'businesses' as TabType, label: 'ทะเบียนผู้ประกอบการ', icon: Store },
    { id: 'renew' as TabType, label: 'ยื่นต่ออายุ / ตรวจสุขลักษณะ', icon: FileSignature },
    {
      id: 'notifications' as TabType,
      label: 'แจ้งเตือนหมดอายุ & LINE',
      icon: Bell,
      badge: expiringOrExpiredCount
    },
    { id: 'documents' as TabType, label: 'พิมพ์เอกสาร / ออกใบเสร็จ', icon: Printer },
    { id: 'reports' as TabType, label: 'รายงานสรุป', icon: FileSpreadsheet }
  ];

  return (
    <header className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white shadow-xl no-print border-b border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-1 border-2 border-amber-400 shadow-lg flex-shrink-0 overflow-hidden">
              <img
                src="/assets/aistudio/S__11100249_e2fbf4d1.jpg"
                alt="ตราสัญลักษณ์เทศบาลตำบลพระซอง"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-amber-400/90 text-slate-950 text-xs font-bold px-3 py-0.5 rounded-full mb-1 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-900" />
                ระบบบริการราชการดิจิทัล (Smart Municipality)
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                ระบบบริหารจัดการและต่อใบอนุญาตประกอบกิจการที่เป็นอันตรายต่อสุขภาพ
              </h1>
              <p className="text-emerald-200 text-xs sm:text-sm font-light flex items-center justify-center md:justify-start gap-1.5 mt-0.5">
                <span>กองสาธารณสุขและสิ่งแวดล้อม</span>
                <span>•</span>
                <span>เทศบาลตำบลพระซอง อำเภอนาแก จังหวัดนครพนม</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-md border border-white/15 shadow-sm">
              <div className="text-right text-xs">
                <p className="text-emerald-200">เข้าสู่ระบบโดย</p>
                <p className="font-semibold text-white">Admin (เจ้าพนักงานสาธารณสุข)</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-emerald-950 font-bold flex items-center justify-center border-2 border-white shadow text-xs">
                Admin
              </div>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                className="px-3 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 hover:text-white rounded-2xl border border-rose-400/30 transition shadow-sm flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                title="ออกจากระบบ"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ออกจากระบบ</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-emerald-950/80 border-t border-emerald-800/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1.5 overflow-x-auto py-2 text-sm font-medium scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap text-xs sm:text-sm font-medium relative ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md ring-1 ring-emerald-400/40 font-semibold'
                      : 'text-emerald-100/90 hover:bg-emerald-800/60 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-300'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-1 bg-rose-500 text-white text-[11px] px-2 py-0.5 rounded-full font-bold shadow-sm animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
};
