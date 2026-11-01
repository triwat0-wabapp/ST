import React, { useState, useEffect } from 'react';
import { Business, InspectionResult } from './types';
import { SAMPLE_BUSINESSES } from './data/constants';
import { getLicenseStatus, formatThaiDate } from './utils/thaiDate';
import { Header, TabType } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { BusinessRegisterView } from './components/BusinessRegisterView';
import { RenewInspectionView } from './components/RenewInspectionView';
import { NotificationsLineView } from './components/NotificationsLineView';
import { DocumentsPrintView, DocumentType } from './components/DocumentsPrintView';
import { ReportsView } from './components/ReportsView';
import { ModalBusiness } from './components/ModalBusiness';
import { LoginView } from './components/LoginView';
import { CheckCircle2, X } from 'lucide-react';

const STORAGE_KEY = 'phrasong_health_hazard_businesses_v2';
const AUTH_KEY = 'phrasong_health_auth_session_v1';

const normalizeVillage = (v: string): string => {
  if (!v) return 'หมู่ 1';
  const match = v.match(/หมู่\s*(\d+)/);
  if (match) {
    return `หมู่ ${match[1]}`;
  }
  return v;
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [businesses, setBusinesses] = useState<Business[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('phrasong_health_hazard_businesses_v1');
      if (stored) {
        const parsed: Business[] = JSON.parse(stored);
        return parsed.map((b) => ({
          ...b,
          village: normalizeVillage(b.village)
        }));
      }
    } catch (err) {
      console.error('Failed to load from localStorage', err);
    }
    return SAMPLE_BUSINESSES;
  });

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);

  const [selectedRenewId, setSelectedRenewId] = useState<string>(
    businesses.length > 0 ? businesses[0].id : ''
  );
  const [selectedPrintId, setSelectedPrintId] = useState<string>(
    businesses.length > 0 ? businesses[0].id : ''
  );
  const [printDocType, setPrintDocType] = useState<DocumentType>('license');
  const [selectedVillageFilter, setSelectedVillageFilter] = useState<string>('ALL');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleLoginSuccess = () => {
    try {
      sessionStorage.setItem(AUTH_KEY, 'true');
    } catch (err) {
      console.error(err);
    }
    setIsAuthenticated(true);
    showToast('เข้าสู่ระบบสำเร็จ ยินดีต้อนรับ Admin เข้าสู่ระบบ ทต.พระซอง');
  };

  const handleLogout = () => {
    if (confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
      try {
        sessionStorage.removeItem(AUTH_KEY);
      } catch (err) {
        console.error(err);
      }
      setIsAuthenticated(false);
    }
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(businesses));
    } catch (err) {
      console.error('Failed to save to localStorage', err);
    }
  }, [businesses]);

  // Expiring count for badge
  const expiringOrExpiredCount = businesses.filter((b) => {
    const st = getLicenseStatus(b.expDate);
    return st.status === 'EXPIRING' || st.status === 'EXPIRED';
  }).length;

  // Handlers
  const handleSaveBusiness = (businessData: Business) => {
    if (editingBusiness) {
      setBusinesses((prev) =>
        prev.map((b) => (b.id === businessData.id ? businessData : b))
      );
      showToast(`อัปเดตข้อมูลสถานประกอบการ "${businessData.shopName}" เรียบร้อยแล้ว`);
    } else {
      setBusinesses((prev) => [businessData, ...prev]);
      showToast(`ลงทะเบียนสถานประกอบการ "${businessData.shopName}" เรียบร้อยแล้ว`);
    }
    setEditingBusiness(null);
  };

  const handleDeleteBusiness = (id: string) => {
    const target = businesses.find((b) => b.id === id);
    if (!target) return;
    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบสถานประกอบการ "${target.shopName}" ออกจากระบบ?`)) {
      setBusinesses((prev) => prev.filter((b) => b.id !== id));
      showToast(`ลบสถานประกอบการ "${target.shopName}" ออกจากระบบเรียบร้อย`);
    }
  };

  const handleResetSampleData = () => {
    if (confirm('คุณต้องการรีเซ็ตข้อมูลเป็นชุดข้อมูลตัวอย่างตั้งต้นใช่หรือไม่? ข้อมูลที่เพิ่มใหม่จะถูกแทนที่')) {
      setBusinesses(SAMPLE_BUSINESSES);
      showToast('รีเซ็ตข้อมูลตัวอย่างเรียบร้อยแล้ว');
    }
  };

  const handleSelectBusinessForRenew = (businessId: string) => {
    setSelectedRenewId(businessId);
    setActiveTab('renew');
  };

  const handleSelectBusinessForPrint = (businessId: string, docType: DocumentType = 'license') => {
    setSelectedPrintId(businessId);
    setPrintDocType(docType);
    setActiveTab('documents');
  };

  const handleSaveRenewal = (
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
  ) => {
    setBusinesses((prev) =>
      prev.map((b) => {
        if (b.id !== businessId) return b;

        // Calculate new expiration date (1 year forward from today or from current expiry)
        let baseDate = new Date(b.expDate);
        const today = new Date();
        if (baseDate < today) {
          baseDate = today;
        }
        baseDate.setFullYear(baseDate.getFullYear() + 1);
        const newExpDate = baseDate.toISOString().split('T')[0];

        const baseFee = Number(b.fee) || 0;
        const st = getLicenseStatus(b.expDate);
        const fine = st.status === 'EXPIRED' ? baseFee * 0.2 : 0;
        const total = baseFee + fine;

        const newInspection = {
          id: `insp-${Date.now()}`,
          date: inspectionDate,
          inspector: inspectorName,
          result,
          notes,
          photoUrl,
          checklist
        };

        const newPayment = {
          id: `pay-${Date.now()}`,
          date: inspectionDate,
          receiptNo: `REC-${new Date().getFullYear() + 543}/${String(Math.floor(Math.random() * 900) + 100)}`,
          fee: baseFee,
          fine,
          total,
          recordedBy: 'นายไตรวรรธก์ ทองยืน (ผู้ช่วยเจ้าพนักงานจัดเก็บรายได้)'
        };

        return {
          ...b,
          expDate: newExpDate,
          lastInspected: inspectionDate,
          inspectStatus: result,
          notes: notes || b.notes,
          inspectionHistory: [newInspection, ...(b.inspectionHistory || [])],
          paymentHistory: [newPayment, ...(b.paymentHistory || [])]
        };
      })
    );

    const updatedBiz = businesses.find((b) => b.id === businessId);
    showToast(`ต่ออายุใบอนุญาต "${updatedBiz?.shopName}" เรียบร้อยแล้ว! พร้อมออกใบเสร็จ`);

    // Switch to Documents view & preview receipt
    setSelectedPrintId(businessId);
    setPrintDocType('receipt');
    setActiveTab('documents');
  };

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-800 flex flex-col font-['Sarabun',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-700/60 transition-all transform animate-bounce no-print">
          <CheckCircle2 className="w-5 h-5 text-amber-300 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-emerald-300 hover:text-white ml-2 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Official Header & Tabs */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        expiringOrExpiredCount={expiringOrExpiredCount}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {activeTab === 'dashboard' && (
          <DashboardView
            businesses={businesses}
            onNavigateTab={setActiveTab}
            onOpenAddModal={() => {
              setEditingBusiness(null);
              setIsAddModalOpen(true);
            }}
            onSelectBusinessForRenew={handleSelectBusinessForRenew}
            onFilterByVillage={(vil) => {
              setSelectedVillageFilter(vil);
            }}
          />
        )}

        {activeTab === 'businesses' && (
          <BusinessRegisterView
            businesses={businesses}
            onOpenAddModal={() => {
              setEditingBusiness(null);
              setIsAddModalOpen(true);
            }}
            onOpenEditModal={(b) => {
              setEditingBusiness(b);
              setIsAddModalOpen(true);
            }}
            onDeleteBusiness={handleDeleteBusiness}
            onSelectBusinessForRenew={handleSelectBusinessForRenew}
            onSelectBusinessForPrint={handleSelectBusinessForPrint}
            onResetSampleData={handleResetSampleData}
            selectedVillageFilter={selectedVillageFilter}
            setSelectedVillageFilter={setSelectedVillageFilter}
          />
        )}

        {activeTab === 'renew' && (
          <RenewInspectionView
            businesses={businesses}
            selectedBusinessId={selectedRenewId}
            onSelectBusinessId={setSelectedRenewId}
            onSaveRenewal={handleSaveRenewal}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationsLineView
            businesses={businesses}
            onSelectBusinessForPrintNotice={(bizId) => {
              setSelectedPrintId(bizId);
              setPrintDocType('notice');
              setActiveTab('documents');
            }}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentsPrintView
            businesses={businesses}
            selectedBusinessId={selectedPrintId}
            onSelectBusinessId={setSelectedPrintId}
            initialDocType={printDocType}
          />
        )}

        {activeTab === 'reports' && <ReportsView businesses={businesses} />}
      </main>

      {/* Footer (no-print) */}
      <footer className="bg-slate-900 text-slate-400 py-5 text-xs text-center border-t border-slate-800 no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-300">
            ระบบบริการและจัดการต่อใบอนุญาตประกอบกิจการที่เป็นอันตรายต่อสุขภาพ © เทศบาลตำบลพระซอง อำเภอนาแก จังหวัดนครพนม
          </p>
          <p className="text-slate-500">
            กองสาธารณสุขและสิ่งแวดล้อม ร่วมกับ งานบริการเทคโนโลยีสารสนเทศเพื่อการบริการประชาชน
          </p>
        </div>
      </footer>

      {/* Add / Edit Business Modal */}
      <ModalBusiness
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingBusiness(null);
        }}
        onSave={handleSaveBusiness}
        editingBusiness={editingBusiness}
        totalBusinessesCount={businesses.length}
      />
    </div>
  );
}
