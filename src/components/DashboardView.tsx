import React from 'react';
import { Business } from '../types';
import { getLicenseStatus } from '../utils/thaiDate';
import { PHRA_SONG_VILLAGES, BUSINESS_CATEGORIES } from '../data/constants';
import {
  AlertTriangle,
  Store,
  ShieldCheck,
  Hourglass,
  BadgeAlert,
  Coins,
  ArrowRight,
  PlusCircle,
  FileCheck2,
  MessageCircle,
  BarChart3,
  PieChart as PieChartIcon,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { TabType } from './Header';

interface DashboardViewProps {
  businesses: Business[];
  onNavigateTab: (tab: TabType) => void;
  onOpenAddModal: () => void;
  onSelectBusinessForRenew: (businessId: string) => void;
  onFilterByVillage?: (village: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  businesses,
  onNavigateTab,
  onOpenAddModal,
  onSelectBusinessForRenew,
  onFilterByVillage
}) => {
  // Statistics calculations
  let activeCount = 0;
  let expiringCount = 0;
  let expiredCount = 0;
  let totalRevenue = 0;

  businesses.forEach((b) => {
    const st = getLicenseStatus(b.expDate);
    if (st.status === 'ACTIVE') activeCount++;
    else if (st.status === 'EXPIRING') expiringCount++;
    else if (st.status === 'EXPIRED') expiredCount++;
    totalRevenue += Number(b.fee) || 0;
  });

  const totalCount = businesses.length;
  const needsAttentionCount = expiringCount + expiredCount;

  // Category statistics for the bar chart
  const categoryStats = BUSINESS_CATEGORIES.map((cat) => {
    const count = businesses.filter((b) => b.category === cat).length;
    // Short label for neat chart display
    const split = cat.split('.');
    const shortLabel = split.length > 1 ? `${split[0]}.${split[1].slice(0, 10)}...` : cat;
    return { fullName: cat, shortLabel, count };
  });

  const maxCatCount = Math.max(...categoryStats.map((c) => c.count), 1);

  // Status breakdown percentages
  const activePercent = totalCount ? Math.round((activeCount / totalCount) * 100) : 0;
  const expiringPercent = totalCount ? Math.round((expiringCount / totalCount) * 100) : 0;
  const expiredPercent = totalCount ? Math.round((expiredCount / totalCount) * 100) : 0;

  // Village statistics
  const villageStats = PHRA_SONG_VILLAGES.map((v) => {
    const items = businesses.filter((b) => b.village === v);
    let act = 0;
    let exping = 0;
    let expd = 0;
    items.forEach((b) => {
      const st = getLicenseStatus(b.expDate);
      if (st.status === 'ACTIVE') act++;
      else if (st.status === 'EXPIRING') exping++;
      else if (st.status === 'EXPIRED') expd++;
    });
    return {
      village: v,
      total: items.length,
      active: act,
      expiring: exping,
      expired: expd
    };
  }).filter((v) => v.total > 0);

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      {needsAttentionCount > 0 && (
        <div className="bg-amber-50/90 border-l-4 border-amber-500 p-4 sm:p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="font-bold text-amber-900 text-sm sm:text-base">
                แจ้งเตือนใบอนุญาตใกล้หมดอายุ & เกินกำหนด!
              </h4>
              <p className="text-xs sm:text-sm text-amber-800 mt-0.5">
                มีใบอนุญาตใกล้หมดอายุ (ภายใน 60 วัน){' '}
                <span className="font-bold text-amber-900 underline">{expiringCount} ราย</span> และหมดอายุแล้ว{' '}
                <span className="font-bold text-rose-700 underline">{expiredCount} ราย</span>{' '}
                กรุณาส่งหนังสือแจ้งเตือนหรือส่ง LINE แจ้งเตือนผู้ประกอบการ
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('notifications')}
            className="text-xs bg-amber-600 hover:bg-amber-700 text-white font-semibold px-4 py-2 rounded-xl transition shadow-sm flex items-center gap-1.5 whitespace-nowrap self-end sm:self-center"
          >
            <span>ดูรายการแจ้งเตือนทั้งหมด</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Stats 5-column Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                ใบอนุญาตทั้งหมด
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalCount}</h3>
              <p className="text-[11px] text-slate-400 mt-1">ในเขตเทศบาลตำบลพระซอง</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Active */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                สถานะปกติ
              </p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">{activeCount}</h3>
              <p className="text-[11px] text-emerald-600/90 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> ยังไม่หมดอายุ ({activePercent}%)
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Expiring */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                ใกล้หมดอายุ
              </p>
              <h3 className="text-2xl font-bold text-amber-500 mt-1">{expiringCount}</h3>
              <p className="text-[11px] text-amber-600/90 mt-1 flex items-center gap-1">
                <Hourglass className="w-3 h-3" /> ภายใน 30-60 วัน
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
              <Hourglass className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Expired */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                หมดอายุแล้ว
              </p>
              <h3 className="text-2xl font-bold text-rose-600 mt-1">{expiredCount}</h3>
              <p className="text-[11px] text-rose-600/90 mt-1 flex items-center gap-1">
                <BadgeAlert className="w-3 h-3" /> ต้องต่ออายุทันที (มีค่าปรับ)
              </p>
            </div>
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
              <BadgeAlert className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                รายได้ค่าธรรมเนียมรวม
              </p>
              <h3 className="text-2xl font-bold text-teal-800 mt-1">
                {totalRevenue.toLocaleString('th-TH')} ฿
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">ปีงบประมาณปัจจุบัน</p>
            </div>
            <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center">
              <Coins className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Bar Chart */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <span>จำนวนกิจการแยกตามประเภท (13 กลุ่มอาชีพตาม พ.ร.บ. สาธารณสุข)</span>
            </h3>
            <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
              รวม {totalCount} กิจการ
            </span>
          </div>

          <div className="space-y-2.5 my-2">
            {categoryStats.map((item, idx) => {
              const pct = Math.round((item.count / maxCatCount) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-700">
                    <span className="font-medium truncate max-w-[280px] sm:max-w-[420px]" title={item.fullName}>
                      {item.fullName}
                    </span>
                    <span className="font-bold text-emerald-800 pl-2">
                      {item.count} แห่ง
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                      style={{ width: `${item.count > 0 ? Math.max(pct, 5) : 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Doughnut Breakdown */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-emerald-600" />
              <span>สัดส่วนสถานะใบอนุญาต</span>
            </h3>
          </div>

          <div className="flex flex-col items-center justify-center my-4">
            {/* SVG Donut Chart */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                {/* Background circle */}
                <path
                  className="text-slate-100"
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Active circle */}
                <path
                  className="text-emerald-500 transition-all duration-700"
                  strokeDasharray={`${activePercent}, 100`}
                  strokeWidth="3.8"
                  stroke="currentColor"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Expiring circle */}
                <path
                  className="text-amber-500 transition-all duration-700"
                  strokeDasharray={`${expiringPercent}, 100`}
                  strokeDashoffset={`-${activePercent}`}
                  strokeWidth="3.8"
                  stroke="currentColor"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Expired circle */}
                <path
                  className="text-rose-500 transition-all duration-700"
                  strokeDasharray={`${expiredPercent}, 100`}
                  strokeDashoffset={`-${activePercent + expiringPercent}`}
                  strokeWidth="3.8"
                  stroke="currentColor"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-extrabold text-slate-800">{totalCount}</span>
                <span className="text-[11px] text-slate-400 font-medium">ใบอนุญาต</span>
              </div>
            </div>

            {/* Legend */}
            <div className="w-full space-y-2 mt-4 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/60 text-emerald-900 border border-emerald-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0" />
                  <span>ปกติ (ยังไม่หมดอายุ)</span>
                </div>
                <span className="font-bold">{activeCount} ราย ({activePercent}%)</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50/60 text-amber-900 border border-amber-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0" />
                  <span>ใกล้หมดอายุ (≤ 60 วัน)</span>
                </div>
                <span className="font-bold">{expiringCount} ราย ({expiringPercent}%)</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-rose-50/60 text-rose-900 border border-rose-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 flex-shrink-0" />
                  <span>หมดอายุแล้ว (Overdue)</span>
                </div>
                <span className="font-bold">{expiredCount} ราย ({expiredPercent}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Village Distribution & Quick Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Village Summary Table */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>สรุปจำนวนสถานประกอบการแยกตามหมู่ (หมู่ 1 - 16 ต.พระซอง)</span>
            </h3>
            <button
              onClick={() => onNavigateTab('businesses')}
              className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold flex items-center gap-1"
            >
              <span>ดูข้อมูลทั้งหมด</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50/90 uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">หมู่ที่</th>
                  <th className="py-2.5 px-3 text-center">กิจการทั้งหมด</th>
                  <th className="py-2.5 px-3 text-center">ปกติ</th>
                  <th className="py-2.5 px-3 text-center">ใกล้หมดอายุ</th>
                  <th className="py-2.5 px-3 text-center">หมดอายุ</th>
                  <th className="py-2.5 px-3 text-center">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {villageStats.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      {item.village}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                      {item.total}
                    </td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 font-semibold">
                      {item.active}
                    </td>
                    <td className="py-2.5 px-3 text-center text-amber-600 font-semibold">
                      {item.expiring}
                    </td>
                    <td className="py-2.5 px-3 text-center text-rose-600 font-semibold">
                      {item.expired}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => {
                          if (onFilterByVillage) onFilterByVillage(item.village);
                          onNavigateTab('businesses');
                        }}
                        className="text-xs bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-medium px-2 py-1 rounded-lg transition"
                      >
                        กรองดูร้าน
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Action Panel */}
        <div className="bg-gradient-to-br from-emerald-800 to-teal-950 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
          <div>
            <div className="inline-block px-3 py-1 bg-amber-400 text-slate-900 rounded-full text-xs font-bold mb-3 shadow-sm">
              เมนูคำสั่งด่วน
            </div>
            <h3 className="text-xl font-bold mb-2">ทำรายการด่วน</h3>
            <p className="text-emerald-200 text-xs sm:text-sm mb-6 leading-relaxed">
              ดำเนินการด้านทะเบียน ตรวจประเมินสุขลักษณะ และเอกสารทางราชการได้อย่างรวดเร็ว
            </p>

            <div className="space-y-3">
              <button
                onClick={onOpenAddModal}
                className="w-full py-3 px-4 bg-white text-emerald-950 hover:bg-emerald-50 rounded-xl font-bold text-sm shadow-md transition flex items-center justify-between group"
              >
                <span className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-emerald-600" />
                  <span>ลงทะเบียนสถานประกอบการใหม่</span>
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigateTab('renew')}
                className="w-full py-3 px-4 bg-emerald-700/70 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition flex items-center justify-between border border-emerald-500/40 group"
              >
                <span className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-amber-300" />
                  <span>บันทึกการต่ออายุ / ตรวจสุขลักษณะ</span>
                </span>
                <ChevronRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigateTab('notifications')}
                className="w-full py-3 px-4 bg-emerald-700/70 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition flex items-center justify-between border border-emerald-500/40 group"
              >
                <span className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-300" />
                  <span>ส่งการแจ้งเตือน LINE / SMS</span>
                </span>
                <ChevronRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigateTab('documents')}
                className="w-full py-3 px-4 bg-emerald-700/70 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition flex items-center justify-between border border-emerald-500/40 group"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span>พิมพ์ใบอนุญาต & ใบเสร็จรับเงิน</span>
                </span>
                <ChevronRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-emerald-700/50 text-xs text-emerald-200/90 flex items-center justify-between">
            <span>เทศบาลตำบลพระซอง อ.นาแก</span>
            <span>โทร. 042-599-123</span>
          </div>
        </div>
      </div>
    </div>
  );
};
