import React, { useState } from 'react';
import { Business } from '../types';
import { getLicenseStatus, formatThaiDate } from '../utils/thaiDate';
import { BUSINESS_CATEGORIES, PHRA_SONG_VILLAGES } from '../data/constants';
import {
  Search,
  Plus,
  RotateCcw,
  Edit3,
  RefreshCw,
  Trash2,
  Eye,
  Store,
  MapPin,
  Calendar,
  AlertCircle,
  FileText,
  Printer
} from 'lucide-react';

interface BusinessRegisterViewProps {
  businesses: Business[];
  onOpenAddModal: () => void;
  onOpenEditModal: (business: Business) => void;
  onDeleteBusiness: (id: string) => void;
  onSelectBusinessForRenew: (businessId: string) => void;
  onSelectBusinessForPrint: (businessId: string, docType?: 'license' | 'receipt' | 'notice') => void;
  onResetSampleData: () => void;
  selectedVillageFilter?: string;
  setSelectedVillageFilter?: (v: string) => void;
}

export const BusinessRegisterView: React.FC<BusinessRegisterViewProps> = ({
  businesses,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteBusiness,
  onSelectBusinessForRenew,
  onSelectBusinessForPrint,
  onResetSampleData,
  selectedVillageFilter,
  setSelectedVillageFilter
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [villageFilter, setVillageFilter] = useState(selectedVillageFilter || 'ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewDetailBusiness, setViewDetailBusiness] = useState<Business | null>(null);

  // Sync external village filter if provided
  const activeVillage = selectedVillageFilter !== undefined ? selectedVillageFilter : villageFilter;

  const handleVillageChange = (val: string) => {
    setVillageFilter(val);
    if (setSelectedVillageFilter) {
      setSelectedVillageFilter(val);
    }
  };

  const filteredBusinesses = businesses.filter((b) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      b.shopName.toLowerCase().includes(term) ||
      b.ownerName.toLowerCase().includes(term) ||
      b.licenseNo.toLowerCase().includes(term) ||
      b.idCard.includes(term) ||
      b.phone.includes(term);

    const matchCat = categoryFilter === 'ALL' || b.category === categoryFilter;
    const matchVil = activeVillage === 'ALL' || b.village === activeVillage;

    const st = getLicenseStatus(b.expDate);
    const matchStatus = statusFilter === 'ALL' || st.status === statusFilter;

    return matchSearch && matchCat && matchVil && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Store className="w-6 h-6 text-emerald-600" />
            <span>ทะเบียนผู้ประกอบการกิจการที่เป็นอันตรายต่อสุขภาพ</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            จัดการข้อมูลสถานประกอบการ ตรวจสอบวันหมดอายุ และประวัติการออกใบอนุญาตในเขต ทต.พระซอง
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenAddModal}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>ลงทะเบียนกิจการใหม่</span>
          </button>
          <button
            onClick={onResetSampleData}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-2.5 rounded-xl text-xs sm:text-sm transition flex items-center gap-1.5"
            title="รีเซ็ตกลับเป็นข้อมูลตัวอย่างตั้งต้น"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>รีเซ็ตข้อมูลตัวอย่าง</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            ค้นหา (ชื่อร้าน / ผู้ขอ / เลขใบอนุญาต / บัตร ปชช.)
          </label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="พิมพ์คำค้นหา..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            ประเภทกิจการ (13 กลุ่มอาชีพ)
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">-- ทุกประเภทกิจการ --</option>
            {BUSINESS_CATEGORIES.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            หมู่ที่ (ต.พระซอง หมู่ 1 - 16)
          </label>
          <select
            value={activeVillage}
            onChange={(e) => handleVillageChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">-- ทุกหมู่ (หมู่ 1 - 16) --</option>
            {PHRA_SONG_VILLAGES.map((v, idx) => (
              <option key={idx} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            สถานะใบอนุญาต
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">-- ทุกสถานะ --</option>
            <option value="ACTIVE">ปกติ (ยังไม่หมดอายุ)</option>
            <option value="EXPIRING">ใกล้หมดอายุ (ภายใน 60 วัน)</option>
            <option value="EXPIRED">หมดอายุแล้ว (Overdue)</option>
          </select>
        </div>
      </div>

      {/* Results Count & Badges */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 px-1">
        <span>
          แสดงผลลัพธ์ <strong className="text-slate-800">{filteredBusinesses.length}</strong> จากทั้งหมด{' '}
          {businesses.length} แห่ง
        </span>
        {(searchTerm || categoryFilter !== 'ALL' || activeVillage !== 'ALL' || statusFilter !== 'ALL') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('ALL');
              handleVillageChange('ALL');
              setStatusFilter('ALL');
            }}
            className="text-emerald-700 hover:text-emerald-900 font-semibold underline"
          >
            ล้างตัวกรองทั้งหมด
          </button>
        )}
      </div>

      {/* Business Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-600 bg-slate-50 uppercase border-b border-slate-200 font-bold">
              <tr>
                <th className="py-3.5 px-4">เลขที่ใบอนุญาต</th>
                <th className="py-3.5 px-4">ชื่อสถานประกอบการ / ผู้ขอ</th>
                <th className="py-3.5 px-4">ประเภทกิจการ</th>
                <th className="py-3.5 px-4">ที่อยู่ / หมู่บ้าน</th>
                <th className="py-3.5 px-4">วันหมดอายุ</th>
                <th className="py-3.5 px-4 text-center">สถานะ</th>
                <th className="py-3.5 px-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBusinesses.map((b) => {
                const st = getLicenseStatus(b.expDate);
                return (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition border-b border-slate-100">
                    <td className="py-3.5 px-4 font-bold text-emerald-900 whitespace-nowrap">
                      {b.licenseNo}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{b.shopName}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        ผู้ขอ: {b.ownerName} • โทร. {b.phone}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-700 max-w-[200px]">
                      <span className="line-clamp-2" title={b.category}>
                        {b.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      <div>{b.address}</div>
                      <div className="font-semibold text-slate-700">{b.village}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold whitespace-nowrap">
                      <div>{formatThaiDate(b.expDate)}</div>
                      <div className="text-[11px] text-slate-400 font-normal">
                        ค่าธรรมเนียม: {b.fee.toLocaleString('th-TH')} บ./ปี
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${st.badgeClass}`}
                      >
                        {st.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setViewDetailBusiness(b)}
                          className="p-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs transition"
                          title="ดูรายละเอียดทั้งหมด"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onSelectBusinessForRenew(b.id)}
                          className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition flex items-center gap-1 border border-emerald-200"
                          title="ยื่นต่ออายุใบอนุญาต"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>ต่ออายุ</span>
                        </button>
                        <button
                          onClick={() => onOpenEditModal(b)}
                          className="p-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-xs transition border border-amber-200"
                          title="แก้ไขข้อมูล"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteBusiness(b.id)}
                          className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs transition border border-rose-200"
                          title="ลบข้อมูล"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredBusinesses.length === 0 && (
          <div className="p-12 text-center text-slate-400">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-base font-semibold text-slate-600">ไม่พบข้อมูลสถานประกอบการตรงตามเงื่อนไข</p>
            <p className="text-xs text-slate-400 mt-1">ลองเปลี่ยนคำค้นหา หรือเลือกตัวกรองประเภทอื่น</p>
          </div>
        )}
      </div>

      {/* Business Detail Modal */}
      {viewDetailBusiness && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Store className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-lg">{viewDetailBusiness.shopName}</h3>
              </div>
              <button
                onClick={() => setViewDetailBusiness(null)}
                className="text-emerald-200 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-xs text-slate-500">เลขที่ใบอนุญาต:</span>
                  <p className="font-bold text-emerald-800 text-base">{viewDetailBusiness.licenseNo}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">สถานะปัจจุบัน:</span>
                  <p>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        getLicenseStatus(viewDetailBusiness.expDate).badgeClass
                      }`}
                    >
                      {getLicenseStatus(viewDetailBusiness.expDate).label}
                    </span>
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">ชื่อผู้ขออนุญาต:</span>
                  <p className="font-semibold text-slate-800">{viewDetailBusiness.ownerName}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">เลขประจำตัวประชาชน:</span>
                  <p className="font-mono text-slate-800">{viewDetailBusiness.idCard}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">เบอร์โทรศัพท์:</span>
                  <p className="text-slate-800">{viewDetailBusiness.phone}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">LINE ID:</span>
                  <p className="text-emerald-700 font-semibold">{viewDetailBusiness.lineId || '-'}</p>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-500">ประเภทกิจการ:</span>
                <p className="font-medium text-slate-800 bg-slate-100 p-2.5 rounded-lg mt-1">
                  {viewDetailBusiness.category}
                </p>
              </div>

              <div>
                <span className="text-xs text-slate-500">สถานที่ตั้ง:</span>
                <p className="text-slate-800 mt-1">
                  {viewDetailBusiness.address} {viewDetailBusiness.village} ต.พระซอง อ.นาแก จ.นครพนม
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500">วันที่ออกใบอนุญาต:</span>
                  <p className="font-semibold mt-0.5">{formatThaiDate(viewDetailBusiness.issueDate)}</p>
                </div>
                <div>
                  <span className="text-slate-500">วันหมดอายุ:</span>
                  <p className="font-bold text-rose-600 mt-0.5">{formatThaiDate(viewDetailBusiness.expDate)}</p>
                </div>
                <div>
                  <span className="text-slate-500">อัตราค่าธรรมเนียม:</span>
                  <p className="font-bold text-emerald-800 mt-0.5">
                    {viewDetailBusiness.fee.toLocaleString('th-TH')} บาท/ปี
                  </p>
                </div>
              </div>

              {viewDetailBusiness.notes && (
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900">
                  <span className="font-bold">บันทึกตรวจสุขลักษณะล่าสุด: </span>
                  {viewDetailBusiness.notes}
                </div>
              )}

              {/* Action shortcuts */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-end gap-2">
                <button
                  onClick={() => {
                    onSelectBusinessForPrint(viewDetailBusiness.id, 'license');
                    setViewDetailBusiness(null);
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>พิมพ์ใบอนุญาต</span>
                </button>
                <button
                  onClick={() => {
                    onSelectBusinessForPrint(viewDetailBusiness.id, 'receipt');
                    setViewDetailBusiness(null);
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>พิมพ์ใบเสร็จ</span>
                </button>
                <button
                  onClick={() => {
                    onSelectBusinessForRenew(viewDetailBusiness.id);
                    setViewDetailBusiness(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>ดำเนินการต่ออายุ</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
