import React, { useState } from 'react';
import { Business } from '../types';
import { formatThaiDate, formatThaiFullDate, getLicenseStatus, thaiBahtText } from '../utils/thaiDate';
import {
  Printer,
  FileText,
  FileCheck2,
  Award,
  Eye,
  UserCheck
} from 'lucide-react';

export type DocumentType = 'license' | 'receipt' | 'notice';

interface DocumentsPrintViewProps {
  businesses: Business[];
  selectedBusinessId: string;
  onSelectBusinessId: (id: string) => void;
  initialDocType?: DocumentType;
}

export const DocumentsPrintView: React.FC<DocumentsPrintViewProps> = ({
  businesses,
  selectedBusinessId,
  onSelectBusinessId,
  initialDocType = 'license'
}) => {
  const [docType, setDocType] = useState<DocumentType>(initialDocType);
  const [receiptOfficerName, setReceiptOfficerName] = useState('นายไตรวรรธก์ ทองยืน');
  const [receiptOfficerPosition, setReceiptOfficerPosition] = useState('ผู้ช่วยเจ้าพนักงานจัดเก็บรายได้');

  const selectedBiz =
    businesses.find((b) => b.id === selectedBusinessId) ||
    (businesses.length > 0 ? businesses[0] : null);

  const handlePrint = () => {
    window.print();
  };

  const statusInfo = selectedBiz ? getLicenseStatus(selectedBiz.expDate) : null;
  const baseFee = selectedBiz ? Number(selectedBiz.fee) || 0 : 0;
  const fine = statusInfo?.status === 'EXPIRED' ? baseFee * 0.2 : 0;
  const totalAmount = baseFee + fine;

  const todayStr = new Date().toISOString().split('T')[0];
  const thaiFullToday = formatThaiFullDate(todayStr);

  return (
    <div className="space-y-6">
      {/* Top Controls Header (no-print) */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 no-print flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Printer className="w-6 h-6 text-emerald-600" />
            <span>ศูนย์พิมพ์เอกสารราชการ & ใบเสร็จรับเงิน (Official Documents)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            เลือกพิมพ์ใบอนุญาตประกอบกิจการ (อป.2) ใบเสร็จรับเงิน หรือหนังสือแจ้งเตือนตามมาตรฐานราชการ
          </p>
        </div>

        <button
          onClick={handlePrint}
          disabled={!selectedBiz}
          className="bg-slate-900 hover:bg-black disabled:bg-slate-300 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition flex items-center gap-2 self-start md:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>สั่งพิมพ์เอกสารนี้ (A4)</span>
        </button>
      </div>

      {/* Select Document & Business Controls (no-print) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 no-print">
        {/* Document Type 1: License */}
        <div
          onClick={() => setDocType('license')}
          className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
            docType === 'license'
              ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-2.5">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">1. ใบอนุญาตประกอบกิจการ (อป.2)</h4>
            <p className="text-xs text-slate-500 mt-1">
              แบบใบอนุญาตฉบับจริงพร้อมตราครุฑ กรอบราชการ และลายเซ็นนายกเทศมนตรี
            </p>
          </div>
          <span
            className={`mt-3 text-xs font-semibold ${
              docType === 'license' ? 'text-emerald-700 font-bold' : 'text-slate-400'
            }`}
          >
            {docType === 'license' ? '✓ กำลังเลือกหน้านี้' : 'คลิกเพื่อเลือก'}
          </span>
        </div>

        {/* Document Type 2: Receipt */}
        <div
          onClick={() => setDocType('receipt')}
          className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
            docType === 'receipt'
              ? 'bg-teal-50/70 border-teal-500 ring-2 ring-teal-500/20 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold mb-2.5">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">2. ใบเสร็จรับเงิน (ทต.พระซอง)</h4>
            <p className="text-xs text-slate-500 mt-1">
              ใบเสร็จรับเงินค่าธรรมเนียมและค่าปรับ พร้อมแปลงตัวเลขเป็นตัวหนังสือภาษาไทย
            </p>
          </div>
          <span
            className={`mt-3 text-xs font-semibold ${
              docType === 'receipt' ? 'text-teal-700 font-bold' : 'text-slate-400'
            }`}
          >
            {docType === 'receipt' ? '✓ กำลังเลือกหน้านี้' : 'คลิกเพื่อเลือก'}
          </span>
        </div>

        {/* Document Type 3: Notice Letter */}
        <div
          onClick={() => setDocType('notice')}
          className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
            docType === 'notice'
              ? 'bg-amber-50/70 border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-2.5">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">3. หนังสือแจ้งเตือนต่ออายุ</h4>
            <p className="text-xs text-slate-500 mt-1">
              หนังสือราชการภายนอกของเทศบาลตำบลพระซอง ตราครุฑ แจ้งเตือนก่อนหมดอายุ
            </p>
          </div>
          <span
            className={`mt-3 text-xs font-semibold ${
              docType === 'notice' ? 'text-amber-700 font-bold' : 'text-slate-400'
            }`}
          >
            {docType === 'notice' ? '✓ กำลังเลือกหน้านี้' : 'คลิกเพื่อเลือก'}
          </span>
        </div>
      </div>

      {/* Target Business Selector Toolbar (no-print) */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 no-print flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-auto flex-1 flex items-center gap-2">
          <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
            เลือกสถานประกอบการที่ต้องการพิมพ์:
          </label>
          <select
            value={selectedBiz?.id || ''}
            onChange={(e) => onSelectBusinessId(e.target.value)}
            className="w-full sm:max-w-md p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 font-medium"
          >
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.licenseNo} - {b.shopName} ({b.ownerName})
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-1.5 self-end sm:self-center">
          <Eye className="w-3.5 h-3.5 text-slate-400" />
          <span>แสดงตัวอย่างตามขนาด A4 มาตรฐาน (210 x 297 mm)</span>
        </div>
      </div>

      {/* Receipt Officer Toolbar (no-print) */}
      {docType === 'receipt' && (
        <div className="bg-teal-50/80 border border-teal-200/90 p-3.5 rounded-2xl no-print flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-sm">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-teal-700" />
            <span className="font-bold text-teal-950">ข้อมูลผู้ออกใบเสร็จรับเงิน (ลงนามท้ายใบเสร็จ):</span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
              <span className="text-slate-600 font-medium">ชื่อ-สกุล:</span>
              <input
                type="text"
                value={receiptOfficerName}
                onChange={(e) => setReceiptOfficerName(e.target.value)}
                className="p-1.5 px-2.5 bg-white border border-teal-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-teal-500 shadow-sm"
              />
            </div>
            <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
              <span className="text-slate-600 font-medium">ตำแหน่ง:</span>
              <input
                type="text"
                value={receiptOfficerPosition}
                onChange={(e) => setReceiptOfficerPosition(e.target.value)}
                className="p-1.5 px-2.5 bg-white border border-teal-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-teal-500 shadow-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= DOCUMENT PREVIEW AREA (Web Preview + Print Container) ================= */}
      {selectedBiz ? (
        <div className="bg-slate-200/80 p-3 sm:p-8 rounded-2xl flex justify-center overflow-x-auto min-h-[600px] border border-slate-300/80 shadow-inner">
          {/* ================= 1. LICENSE CERTIFICATE (อป.2) ================= */}
          {docType === 'license' && (
            <div className="print-only-target bg-white p-8 sm:p-12 border-4 border-emerald-950 w-[210mm] min-h-[297mm] mx-auto text-slate-900 relative shadow-2xl flex flex-col justify-between font-['Sarabun',sans-serif] box-border">
              {/* Inner Decorative Double Border */}
              <div className="border-2 border-emerald-800 p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  {/* Top Municipality Emblem */}
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 mx-auto mb-3 flex items-center justify-center">
                      <img
                        src="/assets/aistudio/S__11100249_e2fbf4d1.jpg"
                        alt="ตราสัญลักษณ์เทศบาลตำบลพระซอง"
                        className="w-full h-full object-contain rounded-full shadow-md border-2 border-amber-200/80"
                      />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-slate-900">
                      ใบอนุญาต
                    </h2>
                    <p className="text-lg sm:text-xl font-bold text-slate-800 mt-0.5">
                      ประกอบกิจการที่เป็นอันตรายต่อสุขภาพ
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      ตามพระราชบัญญัติการสาธารณสุข พ.ศ. 2535 และข้อบัญญัติเทศบาลตำบลพระซอง
                    </p>
                  </div>

                  {/* License Reference Numbers */}
                  <div className="flex justify-between text-xs sm:text-sm font-semibold mb-6 border-b-2 border-slate-300 pb-2.5">
                    <span>เล่มที่: 01</span>
                    <span>
                      เลขที่ใบอนุญาต:{' '}
                      <strong className="text-emerald-900 font-bold text-base">
                        {selectedBiz.licenseNo}
                      </strong>
                    </span>
                  </div>

                  {/* Body Text */}
                  <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-900 text-justify">
                    <p className="indent-8">
                      เจ้าพนักงานท้องถิ่น เทศบาลตำบลพระซอง อำเภอนาแก จังหวัดนครพนม อนุญาตให้{' '}
                      <strong className="text-lg font-bold border-b border-dotted border-slate-700 px-2 text-emerald-950">
                        {selectedBiz.ownerName}
                      </strong>{' '}
                      เลขประจำตัวประชาชน <span className="font-mono font-bold tracking-wider">{selectedBiz.idCard}</span>
                    </p>
                    <p>
                      เป็นผู้ประกอบกิจการ ณ สถานประกอบการชื่อ{' '}
                      <strong className="text-lg font-bold border-b border-dotted border-slate-700 px-2 text-emerald-950">
                        {selectedBiz.shopName}
                      </strong>
                    </p>
                    <p>
                      ประเภทกิจการ{' '}
                      <strong className="border-b border-dotted border-slate-700 px-2 font-bold">
                        {selectedBiz.category}
                      </strong>
                    </p>
                    <p>
                      ตั้งอยู่ ณ เลขที่{' '}
                      <span className="border-b border-dotted border-slate-700 px-2 font-medium">
                        {selectedBiz.address}
                      </span>{' '}
                      <span className="border-b border-dotted border-slate-700 px-2 font-semibold">
                        {selectedBiz.village}
                      </span>{' '}
                      ตำบลพระซอง อำเภอนาแก จังหวัดนครพนม
                    </p>
                    <p className="indent-8">
                      โดยต้องปฏิบัติตามหลักเกณฑ์ วิธีการ และเงื่อนไขที่กฎหมายว่าด้วยการสาธารณสุข เทศบัญญัติเทศบาลตำบลพระซอง และคำสั่งของเจ้าพนักงานท้องถิ่นกำหนดไว้อย่างเคร่งครัด
                    </p>
                  </div>

                  {/* Metadata Box */}
                  <div className="mt-8 bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 text-xs sm:text-sm">
                    <p className="font-bold text-emerald-950 mb-2">เงื่อนไขและอายุใบอนุญาต:</p>
                    <div className="grid grid-cols-2 gap-2 text-slate-700">
                      <p>
                        • วันที่ออกใบอนุญาต:{' '}
                        <strong>{formatThaiDate(selectedBiz.issueDate)}</strong>
                      </p>
                      <p>
                        • วันหมดอายุ:{' '}
                        <strong className="text-rose-700">
                          {formatThaiDate(selectedBiz.expDate)}
                        </strong>
                      </p>
                      <p>
                        • ค่าธรรมเนียมใบอนุญาต:{' '}
                        <strong>{selectedBiz.fee.toLocaleString('th-TH')} บาท/ปี</strong>
                      </p>
                      <p>
                        • ผลการประเมินสุขลักษณะ:{' '}
                        <strong className="text-emerald-800">ผ่านเกณฑ์มาตรฐาน อป.1</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Signatures */}
                <div className="mt-12 text-center text-sm">
                  <p className="mb-10 text-slate-800">
                    ออกให้ ณ วันที่ {thaiFullToday}
                  </p>
                  <div className="inline-block w-72 text-center border-t border-slate-500 pt-2.5">
                    <p className="font-bold text-base text-slate-900">(นายกเทศมนตรีตำบลพระซอง)</p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      เจ้าพนักงานท้องถิ่น เทศบาลตำบลพระซอง
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 2. MUNICIPALITY RECEIPT ================= */}
          {docType === 'receipt' && (
            <div className="print-only-target bg-white p-8 sm:p-12 border border-slate-300 w-[210mm] min-h-[297mm] mx-auto text-slate-900 relative shadow-2xl flex flex-col justify-between font-['Sarabun',sans-serif] box-border">
              <div>
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-2 flex items-center justify-center">
                    <img
                      src="/assets/aistudio/S__11100249_e2fbf4d1.jpg"
                      alt="ตราสัญลักษณ์เทศบาลตำบลพระซอง"
                      className="w-full h-full object-contain rounded-full shadow-sm border border-amber-200"
                    />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">ใบเสร็จรับเงิน</h2>
                  <h3 className="text-lg font-semibold text-slate-800">
                    เทศบาลตำบลพระซอง อำเภอนาแก จังหวัดนครพนม
                  </h3>
                  <p className="text-xs text-slate-500">
                    กองสาธารณสุขและสิ่งแวดล้อม / งานจัดเก็บรายได้ กองคลัง
                  </p>
                </div>

                {/* Reference Numbers */}
                <div className="flex justify-between text-xs sm:text-sm mb-6 border-b border-slate-300 pb-2.5">
                  <div>
                    <p>
                      <strong>เล่มที่:</strong> 67/08
                    </p>
                    <p>
                      <strong>เลขที่:</strong> 0429
                    </p>
                  </div>
                  <div className="text-right">
                    <p>
                      <strong>วันที่:</strong> {thaiFullToday}
                    </p>
                  </div>
                </div>

                {/* Payer info */}
                <div className="text-xs sm:text-sm space-y-1.5 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p>
                    <strong>ได้รับเงินจาก:</strong> {selectedBiz.ownerName}
                  </p>
                  <p>
                    <strong>สถานประกอบการ:</strong> {selectedBiz.shopName}
                  </p>
                  <p>
                    <strong>ที่อยู่:</strong> {selectedBiz.address} {selectedBiz.village} ต.พระซอง อ.นาแก จ.นครพนม
                  </p>
                  <p>
                    <strong>อ้างอิงใบอนุญาตเลขที่:</strong> {selectedBiz.licenseNo}
                  </p>
                </div>

                {/* Items Table */}
                <table className="w-full text-xs sm:text-sm border-collapse border border-slate-300 mb-6">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 text-center font-bold">
                      <th className="border border-slate-300 p-2.5 w-12">ลำดับ</th>
                      <th className="border border-slate-300 p-2.5 text-left">รายการชำระเงิน</th>
                      <th className="border border-slate-300 p-2.5 w-36 text-right">จำนวนเงิน (บาท)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 p-2.5 text-center">1</td>
                      <td className="border border-slate-300 p-2.5">
                        ค่าธรรมเนียมต่ออายุใบอนุญาตประกอบกิจการที่เป็นอันตรายต่อสุขภาพ (1 ปี)
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          ประเภท: {selectedBiz.category}
                        </div>
                      </td>
                      <td className="border border-slate-300 p-2.5 text-right font-mono font-semibold">
                        {baseFee.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                    {fine > 0 && (
                      <tr>
                        <td className="border border-slate-300 p-2.5 text-center">2</td>
                        <td className="border border-slate-300 p-2.5 text-rose-700">
                          ค่าปรับการยื่นต่ออายุใบอนุญาตล่าช้าเกินกำหนด (ร้อยละ 20)
                        </td>
                        <td className="border border-slate-300 p-2.5 text-right font-mono font-semibold text-rose-700">
                          {fine.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="font-bold bg-slate-50">
                      <td colSpan={2} className="border border-slate-300 p-2.5 text-right">
                        รวมเงินทั้งสิ้น (บาท):
                      </td>
                      <td className="border border-slate-300 p-2.5 text-right font-mono text-emerald-900 text-base">
                        {totalAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>

                {/* Baht Text */}
                <div className="p-3 bg-slate-100 rounded-xl text-xs sm:text-sm font-semibold border border-slate-300 text-slate-800">
                  <span>(จำนวนเงินตัวอักษร: {thaiBahtText(totalAmount)})</span>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 text-center text-xs sm:text-sm pt-12 border-t border-slate-200 mt-12">
                <div>
                  <p className="mb-12 text-slate-600">ลงชื่อ..........................................................ผู้ชำระเงิน</p>
                  <p className="font-semibold text-slate-900">({selectedBiz.ownerName})</p>
                </div>
                <div>
                  <p className="mb-12 text-slate-600">ลงชื่อ..........................................................ผู้รับเงิน/ผู้ออกใบเสร็จ</p>
                  <p className="font-bold text-slate-900 text-sm">({receiptOfficerName})</p>
                  <p className="text-xs text-slate-700 font-medium mt-0.5">{receiptOfficerPosition}</p>
                  <p className="text-xs text-slate-500 mt-0.5">กองคลัง เทศบาลตำบลพระซอง</p>
                </div>
              </div>
            </div>
          )}

          {/* ================= 3. NOTICE LETTER ================= */}
          {docType === 'notice' && (
            <div className="print-only-target bg-white p-10 sm:p-14 border border-slate-300 w-[210mm] min-h-[297mm] mx-auto text-slate-900 relative shadow-2xl flex flex-col justify-between font-['Sarabun',sans-serif] text-xs sm:text-sm leading-relaxed box-border">
              <div>
                {/* Garuda Emblem (ตราครุฑ) */}
                <div className="text-center mb-6">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-2 flex items-center justify-center">
                    <img
                      src="/assets/aistudio/482457_10200601494981789_1825578775_n_2013f95f.jpg"
                      alt="ตราครุฑ"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Official Letter Header */}
                <div className="flex justify-between items-start mb-6 text-xs sm:text-sm">
                  <div>
                    <p>ที่ นพ 53804/ว. 102</p>
                  </div>
                  <div className="text-right">
                    <p>สำนักงานเทศบาลตำบลพระซอง</p>
                    <p>อำเภอนาแก จังหวัดนครพนม 48130</p>
                  </div>
                </div>

                <div className="text-center my-5 font-semibold text-sm">
                  <p>{thaiFullToday}</p>
                </div>

                <div className="space-y-1.5 mb-6 text-xs sm:text-sm">
                  <p>
                    <strong>เรื่อง</strong> แจ้งเตือนให้ดำเนินการต่ออายุใบอนุญาตประกอบกิจการที่เป็นอันตรายต่อสุขภาพ
                  </p>
                  <p>
                    <strong>เรียน</strong> คุณ{selectedBiz.ownerName} (ผู้รับใบอนุญาตสถานประกอบการ "{selectedBiz.shopName}")
                  </p>
                </div>

                {/* Letter Body */}
                <div className="space-y-4 indent-8 text-justify leading-relaxed">
                  <p>
                    ตามที่ท่านได้รับใบอนุญาตประกอบกิจการที่เป็นอันตรายต่อสุขภาพ ประเภท{' '}
                    <strong>{selectedBiz.category}</strong> ณ สถานที่ตั้งเลขที่ {selectedBiz.address}{' '}
                    {selectedBiz.village} ตำบลพระซอง อำเภอนาแก จังหวัดนครพนม ตามใบอนุญาตเลขที่{' '}
                    <strong>{selectedBiz.licenseNo}</strong> นั้น
                  </p>
                  <p>
                    เทศบาลตำบลพระซอง ขอเรียนให้ท่านทราบว่า ใบอนุญาตประกอบกิจการของท่านจะสิ้นอายุลงในวันที่{' '}
                    <strong className="text-rose-700 underline font-bold">
                      {formatThaiDate(selectedBiz.expDate)}
                    </strong>{' '}
                    เพื่อให้การประกอบกิจการของท่านเป็นไปอย่างถูกต้องตาม พระราชบัญญัติการสาธารณสุข พ.ศ. 2535
                    และเทศบัญญัติเทศบาลตำบลพระซอง เรื่อง การควบคุมกิจการที่เป็นอันตรายต่อสุขภาพ
                  </p>
                  <p>
                    จึงขอให้ท่านดำเนินการยื่นคำขอต่ออายุใบอนุญาต ณ กองสาธารณสุขและสิ่งแวดล้อม
                    สำนักงานเทศบาลตำบลพระซอง ในวันและเวลาราชการ ก่อนวันสิ้นอายุของใบอนุญาตดังกล่าว
                    ทั้งนี้ หากพ้นกำหนดวันสิ้นอายุใบอนุญาตแล้ว ท่านจะต้องชำระค่าปรับตามกฎหมายเพิ่มเติมในอัตราร้อยละ
                    20 ของค่าธรรมเนียม และอาจมีความผิดฐานประกอบกิจการโดยไม่ได้รับอนุญาตตามกฎหมาย
                  </p>
                  <p>จึงเรียนมาเพื่อโปรดทราบและดำเนินการต่อไป</p>
                </div>
              </div>

              {/* Letter Sign-off */}
              <div className="text-center mt-12">
                <div className="inline-block w-72 text-center border-t border-slate-400 pt-2">
                  <p className="font-bold text-slate-900">(นายกเทศมนตรีตำบลพระซอง)</p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    เจ้าพนักงานท้องถิ่น เทศบาลตำบลพระซอง
                  </p>
                </div>
                <div className="text-left text-xs text-slate-500 mt-8 border-t border-slate-200 pt-2">
                  <p>กองสาธารณสุขและสิ่งแวดล้อม</p>
                  <p>โทร. 042-599-123 ต่อ 104</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
          <p>ไม่มีข้อมูลสถานประกอบการ กรุณาเลือกสถานประกอบการก่อน</p>
        </div>
      )}
    </div>
  );
};
