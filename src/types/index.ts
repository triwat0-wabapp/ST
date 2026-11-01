export type LicenseStatusType = 'ACTIVE' | 'EXPIRING' | 'EXPIRED';

export type InspectionResult = 'PASS' | 'PASS_COND' | 'FAIL';

export interface InspectionRecord {
  id: string;
  date: string;
  inspector: string;
  result: InspectionResult;
  notes: string;
  photoUrl?: string;
  checklist?: {
    cleanliness: boolean;
    wasteManagement: boolean;
    airAndNoise: boolean;
    fireSafety: boolean;
  };
}

export interface PaymentRecord {
  id: string;
  date: string;
  receiptNo: string;
  fee: number;
  fine: number;
  total: number;
  recordedBy: string;
}

export interface Business {
  id: string;
  licenseNo: string;
  shopName: string;
  ownerName: string;
  idCard: string;
  phone: string;
  lineId?: string;
  category: string;
  address: string;
  village: string;
  issueDate: string;
  expDate: string;
  fee: number;
  lastInspected: string;
  inspectStatus: InspectionResult;
  notes?: string;
  inspectionHistory?: InspectionRecord[];
  paymentHistory?: PaymentRecord[];
}

export interface StatusInfo {
  status: LicenseStatusType;
  days: number;
  label: string;
  badgeClass: string;
}
