import React, { useState, useEffect } from 'react';
import { Business } from '../types';
import { BUSINESS_CATEGORIES, PHRA_SONG_VILLAGES } from '../data/constants';
import { Store, X, Save, AlertCircle } from 'lucide-react';

interface ModalBusinessProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (businessData: Business) => void;
  editingBusiness: Business | null;
  totalBusinessesCount: number;
}

export const ModalBusiness: React.FC<ModalBusinessProps> = ({
  isOpen,
  onClose,
  onSave,
  editingBusiness,
  totalBusinessesCount
}) => {
  const [formData, setFormData] = useState<Partial<Business>>({
    licenseNo: '',
    shopName: '',
    ownerName: '',
    idCard: '',
    phone: '',
    lineId: '',
    category: '',
    address: '',
    village: PHRA_SONG_VILLAGES[0],
    issueDate: '',
    expDate: '',
    fee: 1000,
    notes: ''
  });

  const [idCardError, setIdCardError] = useState('');

  useEffect(() => {
    if (editingBusiness) {
      setFormData({ ...editingBusiness });
      setIdCardError('');
    } else {
      // Auto generate license draft
      const currentYearTwoDigits = (new Date().getFullYear() + 543).toString().substring(2);
      const nextNum = String(totalBusinessesCount + 1).padStart(3, '0');

      const todayStr = new Date().toISOString().split('T')[0];
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      const nextYearStr = nextYear.toISOString().split('T')[0];

      setFormData({
        licenseNo: `พซ. ${currentYearTwoDigits}/${nextNum}`,
        shopName: '',
        ownerName: '',
        idCard: '',
        phone: '',
        lineId: '',
        category: BUSINESS_CATEGORIES[0],
        address: '',
        village: PHRA_SONG_VILLAGES[0],
        issueDate: todayStr,
        expDate: nextYearStr,
        fee: 1000,
        notes: ''
      });
      setIdCardError('');
    }
  }, [editingBusiness, isOpen, totalBusinessesCount]);

  if (!isOpen) return null;

  const handleIdCardChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 13);
    setFormData((prev) => ({ ...prev, idCard: cleaned }));
    if (cleaned.length > 0 && cleaned.length !== 13) {
      setIdCardError('เลขประจำตัวประชาชนต้องมีครบ 13 หลัก');
    } else {
      setIdCardError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.idCard || formData.idCard.length !== 13) {
      setIdCardError('กรุณากรอกเลขประจำตัวประชาชน 13 หลักให้ถูกต้อง');
      return;
    }

    const newBusiness: Business = {
      id: editingBusiness ? editingBusiness.id : `biz-${Date.now()}`,
      licenseNo: formData.licenseNo || 'พซ. 67/999',
      shopName: formData.shopName || '',
      ownerName: formData.ownerName || '',
      idCard: formData.idCard || '',
      phone: formData.phone || '',
      lineId: formData.lineId || '',
      category: formData.category || BUSINESS_CATEGORIES[0],
      address: formData.address || '',
      village: formData.village || PHRA_SONG_VILLAGES[0],
      issueDate: formData.issueDate || new Date().toISOString().split('T')[0],
      expDate: formData.expDate || new Date().toISOString().split('T')[0],
      fee: Number(formData.fee) || 0,
      lastInspected: editingBusiness ? editingBusiness.lastInspected : formData.issueDate || '',
      inspectStatus: editingBusiness ? editingBusiness.inspectStatus : 'PASS',
      notes: formData.notes || '',
      inspectionHistory: editingBusiness?.inspectionHistory || [],
      paymentHistory: editingBusiness?.paymentHistory || []
    };

    onSave(newBusiness);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-lg">
              {editingBusiness ? 'แก้ไขข้อมูลสถานประกอบการ' : 'ลงทะเบียนสถานประกอบการใหม่'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                เลขที่ใบอนุญาต <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.licenseNo || ''}
                onChange={(e) => setFormData({ ...formData, licenseNo: e.target.value })}
                placeholder="เช่น พซ. 67/011"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 font-semibold text-emerald-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ชื่อสถานประกอบการ / ร้าน <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.shopName || ''}
                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                placeholder="ระบุชื่อร้าน เช่น ร้านพระซองการค้า"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ชื่อ-สกุล ผู้ขออนุญาต <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.ownerName || ''}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                placeholder="เช่น นายสมหมาย มั่นคง"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                เลขประจำตัวประชาชน (13 หลัก) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.idCard || ''}
                onChange={(e) => handleIdCardChange(e.target.value)}
                placeholder="1350XXXXXXXXX"
                className={`w-full p-2.5 bg-slate-50 border rounded-xl text-sm font-mono focus:ring-2 focus:ring-emerald-500 ${
                  idCardError ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200'
                }`}
              />
              {idCardError && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {idCardError}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                เบอร์โทรศัพท์ติดต่อ <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="08X-XXX-XXXX"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                LINE ID (สำหรับระบบแจ้งเตือนอัตโนมัติ)
              </label>
              <input
                type="text"
                value={formData.lineId || ''}
                onChange={(e) => setFormData({ ...formData, lineId: e.target.value })}
                placeholder="เช่น line_id หรือเบอร์โทร"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ประเภทกิจการที่เป็นอันตรายต่อสุขภาพ (พ.ร.บ. สาธารณสุข) <span className="text-rose-500">*</span>
            </label>
            <select
              required
              value={formData.category || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
            >
              {BUSINESS_CATEGORIES.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ที่ตั้งสถานประกอบการ / บ้านเลขที่ / ถนน <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="เช่น 15/1 ถ.นาแก-พระซอง"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                หมู่ที่ (ต.พระซอง) <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={formData.village || PHRA_SONG_VILLAGES[0]}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
              >
                {PHRA_SONG_VILLAGES.map((v, idx) => (
                  <option key={idx} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                วันที่ออกใบอนุญาตครั้งแรก <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.issueDate || ''}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                วันหมดอายุใบอนุญาต <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.expDate || ''}
                onChange={(e) => setFormData({ ...formData, expDate: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                อัตราค่าธรรมเนียม (บาท/ปี) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="50"
                required
                value={formData.fee || 0}
                onChange={(e) => setFormData({ ...formData, fee: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              หมายเหตุ / ข้อมูลสุขลักษณะเพิ่มเติม
            </label>
            <textarea
              rows={2}
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="บันทึกข้อมูลเพิ่มเติม หรือเงื่อนไขเฉพาะของกิจการ..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-100 transition"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกข้อมูล</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
