import React, { useState } from 'react';
import { Business } from '../types';
import { getLicenseStatus, formatThaiDate } from '../utils/thaiDate';
import {
  Bell,
  MessageSquare,
  Send,
  Copy,
  Printer,
  Check,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';

interface NotificationsLineViewProps {
  businesses: Business[];
  onSelectBusinessForPrintNotice: (businessId: string) => void;
}

export const NotificationsLineView: React.FC<NotificationsLineViewProps> = ({
  businesses,
  onSelectBusinessForPrintNotice
}) => {
  const expiringList = businesses.filter((b) => {
    const st = getLicenseStatus(b.expDate);
    return st.status === 'EXPIRING' || st.status === 'EXPIRED';
  });

  const [selectedBusinessId, setSelectedBusinessId] = useState<string>(
    expiringList.length > 0 ? expiringList[0].id : ''
  );
  const [copied, setCopied] = useState(false);
  const [sentAlertSuccess, setSentAlertSuccess] = useState<string | null>(null);

  const selectedBiz =
    businesses.find((b) => b.id === selectedBusinessId) ||
    (expiringList.length > 0 ? expiringList[0] : businesses[0]);

  const selectedStatus = selectedBiz ? getLicenseStatus(selectedBiz.expDate) : null;

  // Generate LINE Message text
  const generateLineMessage = (b?: Business) => {
    if (!b) return '';
    const st = getLicenseStatus(b.expDate);
    const overdueText =
      st.status === 'EXPIRED'
        ? `⚠️ ใบอนุญาตของท่านหมดอายุแล้วตั้งแต่วันที่ ${formatThaiDate(b.expDate)} (เกินกำหนด ${Math.abs(
            st.days
          )} วัน) ขณะนี้มีค่าปรับชำระล่าช้า 20%`
        : `⚠️ ใบอนุญาตของท่านจะหมดอายุในวันที่ ${formatThaiDate(b.expDate)} (เหลือเวลาอีก ${st.days} วัน)`;

    return `🔔 [แจ้งเตือนต่ออายุใบอนุญาตประกอบกิจการ]
เทศบาลตำบลพระซอง อ.นาแก จ.นครพนม
----------------------------------------
เรียน: คุณ${b.ownerName}
สถานประกอบการ: ${b.shopName}
ใบอนุญาตเลขที่: ${b.licenseNo}
ประเภทกิจการ: ${b.category}

${overdueText}

กรุณาติดต่อยื่นขอต่ออายุใบอนุญาต ณ กองสาธารณสุขและสิ่งแวดล้อม เทศบาลตำบลพระซอง ในวันและเวลาราชการ

📞 สอบถามเพิ่มเติม โทร. 042-599-123`;
  };

  const handleCopy = () => {
    if (!selectedBiz) return;
    const text = generateLineMessage(selectedBiz);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateSend = (shopName: string) => {
    setSentAlertSuccess(`ส่งข้อความแจ้งเตือนผ่าน LINE Official Account ไปยัง "${shopName}" เรียบร้อยแล้ว`);
    setTimeout(() => setSentAlertSuccess(null), 3500);
  };

  const handleBulkSend = () => {
    setSentAlertSuccess(
      `ระบบส่งข้อความแจ้งเตือนผ่าน LINE OA อัตโนมัติไปยังผู้ประกอบการทั้งหมด ${expiringList.length} ราย เรียบร้อยแล้ว`
    );
    setTimeout(() => setSentAlertSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-500" />
            <span>ระบบแจ้งเตือนวันหมดอายุ & LINE Official Account</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            ติดตามสถานะใบอนุญาตที่ต้องต่ออายุ พร้อมช่องทางแจ้งเตือนทาง LINE, SMS และหนังสือราชการ
          </p>
        </div>

        <button
          onClick={handleBulkSend}
          disabled={expiringList.length === 0}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition flex items-center gap-2 self-start md:self-auto"
        >
          <Send className="w-4 h-4" />
          <span>ส่งแจ้งเตือน LINE ทั้งหมด ({expiringList.length} ราย)</span>
        </button>
      </div>

      {sentAlertSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl text-xs sm:text-sm text-emerald-800 flex items-center gap-2.5 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold">{sentAlertSuccess}</span>
        </div>
      )}

      {/* Expiring List Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-xs sm:text-sm">
            รายการใบอนุญาตที่ต้องติดตามต่ออายุ (ใกล้หมดอายุภายใน 60 วัน หรือหมดอายุแล้ว)
          </h3>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
            พบ {expiringList.length} รายการ
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-600 bg-slate-100 uppercase border-b border-slate-200 font-bold">
              <tr>
                <th className="py-3 px-4">ร้านค้า / ผู้ประกอบการ</th>
                <th className="py-3 px-4">ช่องทางติดต่อ</th>
                <th className="py-3 px-4">วันหมดอายุ</th>
                <th className="py-3 px-4">ระยะเวลาคงเหลือ</th>
                <th className="py-3 px-4 text-center">สถานะ</th>
                <th className="py-3 px-4 text-center">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expiringList.map((b) => {
                const st = getLicenseStatus(b.expDate);
                const isSelected = selectedBiz?.id === b.id;
                return (
                  <tr
                    key={b.id}
                    onClick={() => setSelectedBusinessId(b.id)}
                    className={`cursor-pointer transition ${
                      isSelected ? 'bg-emerald-50/60 font-medium' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{b.shopName}</div>
                      <div className="text-xs text-slate-500 font-normal">
                        ผู้ขอ: {b.ownerName} • {b.licenseNo}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <div>โทร. {b.phone}</div>
                      <div className="text-emerald-700 font-semibold">
                        LINE: {b.lineId || <span className="text-slate-400">ไม่ได้ระบุ</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold whitespace-nowrap">
                      {formatThaiDate(b.expDate)}
                    </td>
                    <td className="py-3 px-4 text-xs font-bold whitespace-nowrap">
                      {st.days < 0 ? (
                        <span className="text-rose-600">เกินกำหนด {Math.abs(st.days)} วัน</span>
                      ) : (
                        <span className="text-amber-600">คงเหลือ {st.days} วัน</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${st.badgeClass}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setSelectedBusinessId(b.id);
                            handleSimulateSend(b.shopName);
                          }}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>ส่ง LINE</span>
                        </button>
                        <button
                          onClick={() => onSelectBusinessForPrintNotice(b.id)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1"
                        >
                          <Printer className="w-3 h-3" />
                          <span>หนังสือเตือน</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {expiringList.length === 0 && (
          <div className="p-10 text-center text-slate-400">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-500" />
            <p className="font-semibold text-slate-700">ไม่มีใบอนุญาตที่ใกล้หมดอายุหรือหมดอายุในขณะนี้</p>
            <p className="text-xs text-slate-400 mt-0.5">สถานประกอบการทุกแห่งมีสถานะใบอนุญาตเป็นปกติ</p>
          </div>
        )}
      </div>

      {/* Preview Section: LINE Chat Simulator & Notice Letter Fast Action */}
      {selectedBiz && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LINE Chat Mobile Simulator */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg border border-slate-800 flex flex-col justify-between">
            <div>
              {/* LINE Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-bold shadow">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">LINE Official: ทต.พระซอง</h4>
                    <p className="text-[11px] text-emerald-400">เทศบาลตำบลพระซอง Smart Service</p>
                  </div>
                </div>
                <span className="text-[11px] bg-emerald-950 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-800 font-semibold">
                  LINE OA Simulator
                </span>
              </div>

              {/* Chat bubble screen */}
              <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/80 space-y-3 font-sans text-xs leading-relaxed text-slate-200 shadow-inner">
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-700/60 pb-2">
                  <span>ผู้รับ: {selectedBiz.ownerName} ({selectedBiz.lineId || selectedBiz.phone})</span>
                  <span>วันนี้</span>
                </div>
                <div className="whitespace-pre-line text-slate-100 font-normal">
                  {generateLineMessage(selectedBiz)}
                </div>
              </div>
            </div>

            {/* Simulator Controls */}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800">
              <button
                onClick={handleCopy}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'คัดลอกข้อความแล้ว!' : 'คัดลอกข้อความ LINE'}</span>
              </button>

              <button
                onClick={() => handleSimulateSend(selectedBiz.shopName)}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow"
              >
                <Send className="w-3.5 h-3.5" />
                <span>จำลองส่งข้อความนี้</span>
              </button>
            </div>
          </div>

          {/* Official Notice Letter Quick Print Card */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm sm:text-base">
                    ออกหนังสือแจ้งเตือนทางราชการ (Notice Letter)
                  </h4>
                  <p className="text-xs text-slate-500">กรณีผู้ประกอบการไม่มี LINE หรือต้องการส่งหนังสือราชการ</p>
                </div>
              </div>

              <div className="bg-amber-50/70 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-900 space-y-1.5 mb-4">
                <p className="font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>หนังสือราชการภายนอก เทศบาลตำบลพระซอง</span>
                </p>
                <p>
                  ระบบจะพิมพ์หนังสือราชการตราครุฑ เลขที่หนังสืออ้างอิงของ ทต.พระซอง พร้อมระบุข้อกฎหมาย พ.ร.บ. สาธารณสุข พ.ศ. 2535 เพื่อส่งไปรษณีย์หรือให้เจ้าหน้าที่นำส่ง
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <p>
                  <strong>ผู้รับหนังสือ:</strong> คุณ{selectedBiz.ownerName}
                </p>
                <p>
                  <strong>สถานประกอบการ:</strong> {selectedBiz.shopName} ({selectedBiz.licenseNo})
                </p>
                <p>
                  <strong>ที่อยู่จัดส่ง:</strong> {selectedBiz.address} {selectedBiz.village} ต.พระซอง
                </p>
                <p>
                  <strong>สถานะ:</strong>{' '}
                  <span className={selectedStatus?.status === 'EXPIRED' ? 'text-rose-600 font-bold' : 'text-amber-600 font-bold'}>
                    {selectedStatus?.label}
                  </span>
                </p>
              </div>
            </div>

            <button
              onClick={() => onSelectBusinessForPrintNotice(selectedBiz.id)}
              className="w-full mt-4 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs sm:text-sm font-bold shadow transition flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>เปิดพิมพ์หนังสือแจ้งเตือนฉบับทางการ (A4)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
