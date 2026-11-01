import React, { useState, useEffect } from 'react';
import { Business, InspectionResult } from '../types';
import { getLicenseStatus, formatThaiDate } from '../utils/thaiDate';
import {
  FileSignature,
  Store,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Camera,
  Coins,
  Calendar,
  UserCheck,
  ClipboardCheck,
  ArrowRight,
  ShieldAlert,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';

interface RenewInspectionViewProps {
  businesses: Business[];
  selectedBusinessId: string;
  onSelectBusinessId: (id: string) => void;
  onSaveRenewal: (
    businessId: string,
    inspectionDate: string,
    inspectorName: string,
    result: InspectionResult,
    notes: string,
    photoUrl?: string,
    checklist?: {
      cleanliness: boolean;
      wasteManagement: boolean;
      airAndNoise: boolean;
      fireSafety: boolean;
    }
  ) => void;
}

export const RenewInspectionView: React.FC<RenewInspectionViewProps> = ({
  businesses,
  selectedBusinessId,
  onSelectBusinessId,
  onSaveRenewal
}) => {
  const [inspectDate, setInspectDate] = useState(new Date().toISOString().split('T')[0]);
  const [inspectorName, setInspectorName] = useState('นายสมชาย บริบาล (นักวิชาการสาธารณสุขชำนาญการ)');
  const [inspectResult, setInspectResult] = useState<InspectionResult>('PASS');
  const [notes, setNotes] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Health checklist state
  const [checklist, setChecklist] = useState({
    cleanliness: true,
    wasteManagement: true,
    airAndNoise: true,
    fireSafety: true
  });

  const selectedBusiness = businesses.find((b) => b.id === selectedBusinessId);
  const statusInfo = selectedBusiness ? getLicenseStatus(selectedBusiness.expDate) : null;

  // Calculate fees
  const baseFee = selectedBusiness ? Number(selectedBusiness.fee) || 0 : 0;
  const isOverdue = statusInfo?.status === 'EXPIRED';
  const fine = isOverdue ? baseFee * 0.2 : 0; // 20% fine for overdue renewal
  const totalPayable = baseFee + fine;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBusiness) return;

    if (inspectResult === 'FAIL') {
      alert('⚠️ สถานที่ประเมินไม่ผ่านเกณฑ์มาตรฐานสุขลักษณะ ไม่สามารถบันทึกต่ออายุใบอนุญาตได้ กรุณาระบุข้อปรับปรุงให้ผู้ประกอบการแก้ไข');
      return;
    }

    onSaveRenewal(
      selectedBusiness.id,
      inspectDate,
      inspectorName,
      inspectResult,
      notes,
      photoPreview || undefined,
      checklist
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <FileSignature className="w-6 h-6 text-emerald-600" />
          <span>ยื่นต่ออายุใบอนุญาต & บันทึกผลการตรวจสุขลักษณะ (อป.1)</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          ประเมินตรวจสุขลักษณะสถานที่ประกอบกิจการ คำนวณค่าธรรมเนียมและค่าปรับ และบันทึกต่ออายุ 1 ปี
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step 1: Select Business Panel */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">
              1
            </span>
            <span>เลือกสถานประกอบการ</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              เลือกร้านค้าที่ต้องการต่ออายุ
            </label>
            <select
              value={selectedBusinessId}
              onChange={(e) => onSelectBusinessId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">-- เลือกร้านค้า / สถานประกอบการ --</option>
              {businesses.map((b) => {
                const st = getLicenseStatus(b.expDate);
                return (
                  <option key={b.id} value={b.id}>
                    {b.licenseNo} - {b.shopName} ({b.ownerName}) [{st.label}]
                  </option>
                );
              })}
            </select>
          </div>

          {/* Selected Business Card */}
          {selectedBusiness && statusInfo ? (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-start border-b border-slate-200 pb-2.5">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{selectedBusiness.shopName}</h4>
                  <p className="text-xs text-emerald-800 font-semibold">{selectedBusiness.licenseNo}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusInfo.badgeClass}`}>
                  {statusInfo.label}
                </span>
              </div>

              <div className="space-y-1.5 text-slate-600">
                <p>
                  <strong className="text-slate-800">ผู้ขออนุญาต:</strong> {selectedBusiness.ownerName}
                </p>
                <p>
                  <strong className="text-slate-800">บัตร ปชช.:</strong> {selectedBusiness.idCard}
                </p>
                <p>
                  <strong className="text-slate-800">เบอร์โทรศัพท์:</strong> {selectedBusiness.phone}
                </p>
                <p>
                  <strong className="text-slate-800">ประเภท:</strong> {selectedBusiness.category}
                </p>
                <p>
                  <strong className="text-slate-800">ที่ตั้ง:</strong> {selectedBusiness.address}{' '}
                  {selectedBusiness.village}
                </p>
                <p>
                  <strong className="text-slate-800">วันหมดอายุเดิม:</strong>{' '}
                  <span className={`font-bold ${statusInfo.status === 'EXPIRED' ? 'text-rose-600' : 'text-amber-600'}`}>
                    {formatThaiDate(selectedBusiness.expDate)}
                  </span>
                </p>
                <p>
                  <strong className="text-slate-800">อัตราค่าธรรมเนียมเดิม:</strong>{' '}
                  <span className="font-bold text-emerald-800">
                    {selectedBusiness.fee.toLocaleString('th-TH')} บาท/ปี
                  </span>
                </p>
              </div>

              {isOverdue && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
                  <span>
                    ใบอนุญาตหมดอายุแล้ว ระบบคิดค่าปรับชำระล่าช้า 20% ตามระเบียบข้อบังคับเทศบาล
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
              <Store className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs">กรุณาเลือกร้านค้าเพื่อเริ่มบันทึกการต่ออายุ</p>
            </div>
          )}
        </div>

        {/* Step 2: Inspection & Calculation Form */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            <h3 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">
                2
              </span>
              <span>รายละเอียดการตรวจสุขลักษณะ & สรุปค่าธรรมเนียม</span>
            </h3>

            {/* Officer & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>วันที่ตรวจประเมินสุขลักษณะ</span>
                </label>
                <input
                  type="date"
                  required
                  value={inspectDate}
                  onChange={(e) => setInspectDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ชื่อเจ้าพนักงานผู้ตรวจประเมิน</span>
                </label>
                <input
                  type="text"
                  required
                  value={inspectorName}
                  onChange={(e) => setInspectorName(e.target.value)}
                  placeholder="ระบุชื่อเจ้าพนักงานสาธารณสุข"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Practical Checklist */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
              <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ClipboardCheck className="w-4 h-4 text-emerald-600" />
                <span>รายการตรวจสอบสุขลักษณะทางกายภาพ (Checklist)</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-slate-700">
                <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 cursor-pointer hover:bg-emerald-50/50">
                  <input
                    type="checkbox"
                    checked={checklist.cleanliness}
                    onChange={(e) => setChecklist({ ...checklist, cleanliness: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span>1. ความสะอาด เป็นระเบียบ การระบายอากาศ</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 cursor-pointer hover:bg-emerald-50/50">
                  <input
                    type="checkbox"
                    checked={checklist.wasteManagement}
                    onChange={(e) => setChecklist({ ...checklist, wasteManagement: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span>2. การบำบัดน้ำเสีย & บ่อดักไขมัน/ตะกอน</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 cursor-pointer hover:bg-emerald-50/50">
                  <input
                    type="checkbox"
                    checked={checklist.airAndNoise}
                    onChange={(e) => setChecklist({ ...checklist, airAndNoise: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span>3. การป้องกันกลิ่น ควัน ฝุ่น เสียงรบกวน</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 cursor-pointer hover:bg-emerald-50/50">
                  <input
                    type="checkbox"
                    checked={checklist.fireSafety}
                    onChange={(e) => setChecklist({ ...checklist, fireSafety: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span>4. อุปกรณ์ความปลอดภัย & ถังดับเพลิงพร้อมใช้</span>
                </label>
              </div>
            </div>

            {/* Inspection Evaluation Radio */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                ผลการตรวจประเมินสุขลักษณะสถานที่ <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label
                  className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                    inspectResult === 'PASS'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-400/20'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="inspectResult"
                    value="PASS"
                    checked={inspectResult === 'PASS'}
                    onChange={() => setInspectResult('PASS')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <div className="text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>ผ่านเกณฑ์มาตรฐาน</span>
                    </div>
                    <div className="text-[10px] text-slate-500">พร้อมออกใบอนุญาต 1 ปี</div>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                    inspectResult === 'PASS_COND'
                      ? 'bg-amber-50 border-amber-400 text-amber-900 ring-2 ring-amber-400/20'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="inspectResult"
                    value="PASS_COND"
                    checked={inspectResult === 'PASS_COND'}
                    onChange={() => setInspectResult('PASS_COND')}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <div>
                    <div className="text-xs font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>ผ่านแบบมีเงื่อนไข</span>
                    </div>
                    <div className="text-[10px] text-slate-500">ปรับปรุงภายใน 30 วัน</div>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                    inspectResult === 'FAIL'
                      ? 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-400/20'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="inspectResult"
                    value="FAIL"
                    checked={inspectResult === 'FAIL'}
                    onChange={() => setInspectResult('FAIL')}
                    className="text-rose-600 focus:ring-rose-500"
                  />
                  <div>
                    <div className="text-xs font-bold flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>ไม่ผ่านเกณฑ์</span>
                    </div>
                    <div className="text-[10px] text-slate-500">ไม่อนุญาตให้ต่ออายุ</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Suggestions & Photo Upload */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ข้อเสนอแนะ / รายละเอียดที่ต้องปรับปรุง
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="ระบุข้อแนะนำเพิ่มเติม เช่น ติดตั้งถังดับเพลิงเพิ่ม, ล้างบ่อดักไขมันทุกสัปดาห์..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ภาพถ่ายการตรวจประเมินสถานที่
                </label>
                {photoPreview ? (
                  <div className="relative border border-slate-200 rounded-xl overflow-hidden h-[86px] flex items-center justify-between p-2 bg-slate-50">
                    <img
                      src={photoPreview}
                      alt="Inspection preview"
                      className="h-full w-24 object-cover rounded-lg border border-slate-300"
                    />
                    <div className="flex-1 px-3 text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>แนบรูปถ่ายเรียบร้อย</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPhotoPreview(null)}
                      className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs"
                      title="ลบรูปภาพ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-emerald-50/30 transition text-center h-[86px]">
                    <Camera className="w-5 h-5 text-slate-400 mb-1" />
                    <span className="text-xs text-slate-600 font-medium">คลิกเพื่ออัปโหลดภาพตรวจสถานที่</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Calculation Card */}
            <div className="bg-gradient-to-r from-slate-50 to-emerald-50/40 p-4 rounded-2xl border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-emerald-600" />
                  <span>คำนวณยอดเงินค่าธรรมเนียมที่ต้องชำระ</span>
                </span>
                <span className="text-[11px] text-slate-500">
                  * คิดค่าปรับ 20% หากชำระหลังวันหมดอายุ
                </span>
              </div>

              <div className="flex justify-between text-xs sm:text-sm text-slate-700">
                <span>ค่าธรรมเนียมต่ออายุใบอนุญาต (1 ปี):</span>
                <span className="font-mono font-semibold">
                  {baseFee.toLocaleString('th-TH', { minimumFractionDigits: 2 })} บาท
                </span>
              </div>

              <div className="flex justify-between text-xs sm:text-sm text-rose-600">
                <span>ค่าปรับกรณีชำระล่าช้า (20%):</span>
                <span className="font-mono font-semibold">
                  {fine.toLocaleString('th-TH', { minimumFractionDigits: 2 })} บาท
                </span>
              </div>

              <div className="flex justify-between text-sm sm:text-base font-bold text-slate-900 border-t border-slate-300/80 pt-2">
                <span>รวมยอดสุทธิที่ต้องชำระ:</span>
                <span className="text-emerald-800 text-lg sm:text-xl font-mono">
                  {totalPayable.toLocaleString('th-TH', { minimumFractionDigits: 2 })} บาท
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="submit"
                disabled={!selectedBusiness}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold shadow-md transition flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>บันทึกการต่ออายุ & ออกใบเสร็จ</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
