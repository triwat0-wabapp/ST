import React from 'react';
import { Business } from '../types';
import { BUSINESS_CATEGORIES, PHRA_SONG_VILLAGES } from '../data/constants';
import { getLicenseStatus } from '../utils/thaiDate';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Coins,
  TrendingUp,
  Store,
  MapPin
} from 'lucide-react';

interface ReportsViewProps {
  businesses: Business[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ businesses }) => {
  // Category Breakdown Calculations
  let grandCount = 0;
  let grandFee = 0;
  let grandFine = 0;

  const categoryRows = BUSINESS_CATEGORIES.map((cat) => {
    const list = businesses.filter((b) => b.category === cat);
    let feeSum = 0;
    let fineSum = 0;

    list.forEach((b) => {
      const fee = Number(b.fee) || 0;
      const st = getLicenseStatus(b.expDate);
      const fine = st.status === 'EXPIRED' ? fee * 0.2 : 0;
      feeSum += fee;
      fineSum += fine;
    });

    const net = feeSum + fineSum;
    grandCount += list.length;
    grandFee += feeSum;
    grandFine += fineSum;

    return {
      category: cat,
      count: list.length,
      fee: feeSum,
      fine: fineSum,
      net
    };
  }).filter((r) => r.count > 0);

  const grandNet = grandFee + grandFine;

  // Village Revenue Summary
  const villageRows = PHRA_SONG_VILLAGES.map((v) => {
    const list = businesses.filter((b) => b.village === v);
    let feeSum = 0;
    let fineSum = 0;
    list.forEach((b) => {
      const fee = Number(b.fee) || 0;
      const st = getLicenseStatus(b.expDate);
      const fine = st.status === 'EXPIRED' ? fee * 0.2 : 0;
      feeSum += fee;
      fineSum += fine;
    });
    return {
      village: v,
      count: list.length,
      net: feeSum + fineSum
    };
  }).filter((r) => r.count > 0);

  // Export to CSV with UTF-8 BOM
  const handleExportCSV = () => {
    let csv = '\uFEFF'; // UTF-8 BOM
    csv += 'เลขที่ใบอนุญาต,ชื่อสถานประกอบการ,ผู้ขออนุญาต,เลขบัตรประชาชน,เบอร์โทร,LINE ID,ประเภทกิจการ,ที่อยู่,หมู่บ้าน,วันออกใบอนุญาต,วันหมดอายุ,ค่าธรรมเนียม(บาท),สถานะ\n';

    businesses.forEach((b) => {
      const st = getLicenseStatus(b.expDate);
      const row = [
        `"${b.licenseNo}"`,
        `"${b.shopName.replace(/"/g, '""')}"`,
        `"${b.ownerName.replace(/"/g, '""')}"`,
        `"${b.idCard}"`,
        `"${b.phone}"`,
        `"${b.lineId || '-'}"`,
        `"${b.category.replace(/"/g, '""')}"`,
        `"${b.address.replace(/"/g, '""')}"`,
        `"${b.village}"`,
        `"${b.issueDate}"`,
        `"${b.expDate}"`,
        `"${b.fee}"`,
        `"${st.label}"`
      ];
      csv += row.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `รายงานทะเบียนผู้ประกอบการ_ทต.พระซอง_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
            <span>รายงานสรุปการจัดเก็บค่าธรรมเนียม & สถิติกิจการ</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            สรุปข้อมูลรายรับและสถิติแยกตามประเภทกิจการ สำหรับผู้บริหาร กองสาธารณสุขและสิ่งแวดล้อม
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>ส่งออกข้อมูล (Excel / CSV)</span>
          </button>
        </div>
      </div>

      {/* 3 Summary metric pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">จำนวนกิจการทั้งหมด</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{grandCount} แห่ง</h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Store className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">ค่าปรับชำระล่าช้าสะสม</p>
            <h3 className="text-2xl font-bold text-rose-600 mt-1">
              {grandFine.toLocaleString('th-TH', { minimumFractionDigits: 2 })} ฿
            </h3>
          </div>
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">รายได้รับรวมสุทธิ</p>
            <h3 className="text-2xl font-bold text-emerald-800 mt-1">
              {grandNet.toLocaleString('th-TH', { minimumFractionDigits: 2 })} ฿
            </h3>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <Coins className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Category Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-xs sm:text-sm">
            รายงานการจัดเก็บรายได้ค่าธรรมเนียม จำแนกตาม 13 ประเภทกิจการ (เทศบาลตำบลพระซอง)
          </h3>
          <span className="text-xs text-slate-500">ปีงบประมาณ พ.ศ. 2567-2570</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-600 bg-slate-100 uppercase border-b border-slate-200 font-bold">
              <tr>
                <th className="py-3.5 px-4">ประเภทกิจการ</th>
                <th className="py-3.5 px-4 text-center">จำนวนกิจการ</th>
                <th className="py-3.5 px-4 text-right">ค่าธรรมเนียมรวม (บาท)</th>
                <th className="py-3.5 px-4 text-right">ค่าปรับล่าช้า (บาท)</th>
                <th className="py-3.5 px-4 text-right">รายได้รับรวมสุทธิ (บาท)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categoryRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{row.category}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-700">{row.count}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-700">
                    {row.fee.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-rose-600">
                    {row.fine.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-800">
                    {row.net.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
              <tr>
                <td className="py-3.5 px-4 text-base">รวมทั้งสิ้น</td>
                <td className="py-3.5 px-4 text-center text-base">{grandCount}</td>
                <td className="py-3.5 px-4 text-right font-mono">
                  {grandFee.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-rose-600">
                  {grandFine.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-emerald-900 text-lg">
                  {grandNet.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Village Distribution Summary Grid */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80">
        <h3 className="font-bold text-slate-800 text-sm sm:text-base mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span>รายได้ค่าธรรมเนียมแยกตามหมู่ (หมู่ 1 - 16 ต.พระซอง)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
          {villageRows.map((vr, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <p className="font-semibold text-slate-800">{vr.village}</p>
                <p className="text-[11px] text-slate-500">{vr.count} กิจการ</p>
              </div>
              <span className="font-mono font-bold text-emerald-800">
                {vr.net.toLocaleString('th-TH')} ฿
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
