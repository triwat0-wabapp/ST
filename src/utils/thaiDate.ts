import { LicenseStatusType, StatusInfo } from '../types';

export const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

export const THAI_MONTHS_FULL = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

/**
 * Format date string (YYYY-MM-DD) to Thai short format (e.g., "15 พ.ย. 2569")
 */
export function formatThaiDate(dateStr?: string): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = d.getDate();
  const month = THAI_MONTHS_SHORT[d.getMonth()];
  const year = d.getFullYear() + 543;
  return `${day} ${month} ${year}`;
}

/**
 * Format date string (YYYY-MM-DD) to Thai full official format (e.g., "15 เดือน พฤศจิกายน พ.ศ. 2569")
 */
export function formatThaiFullDate(dateStr?: string): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = d.getDate();
  const month = THAI_MONTHS_FULL[d.getMonth()];
  const year = d.getFullYear() + 543;
  return `${day} เดือน ${month} พ.ศ. ${year}`;
}

/**
 * Calculate license status relative to today's date
 */
export function getLicenseStatus(expDateStr: string): StatusInfo {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const exp = new Date(expDateStr);
  exp.setHours(0, 0, 0, 0);

  const diffTime = exp.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      status: 'EXPIRED',
      days: diffDays,
      label: 'หมดอายุแล้ว',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200'
    };
  } else if (diffDays <= 60) {
    return {
      status: 'EXPIRING',
      days: diffDays,
      label: `ใกล้หมดอายุ (${diffDays} วัน)`,
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200'
    };
  } else {
    return {
      status: 'ACTIVE',
      days: diffDays,
      label: 'ปกติ',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    };
  }
}

/**
 * Convert Thai currency number to standard Thai Baht text (เช่น 1,500.00 -> หนึ่งพันห้าร้อยบาทถ้วน)
 */
export function thaiBahtText(num: number): string {
  if (num === 0) return 'ศูนย์บาทถ้วน';
  if (!num || isNaN(num)) return 'ศูนย์บาทถ้วน';

  const numbers = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
  const digits = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];

  // Handle rounding to 2 decimals
  const fixed = Math.abs(num).toFixed(2);
  const [intPart, decPart] = fixed.split('.');

  const convertGroup = (str: string): string => {
    let result = '';
    const len = str.length;
    for (let i = 0; i < len; i++) {
      const digit = parseInt(str[i], 10);
      const pos = len - i - 1;
      if (digit !== 0) {
        if (pos === 1 && digit === 1) {
          result += 'สิบ';
        } else if (pos === 1 && digit === 2) {
          result += 'ยี่สิบ';
        } else if (pos === 0 && digit === 1 && len > 1) {
          result += 'เอ็ด';
        } else {
          result += numbers[digit] + digits[pos];
        }
      }
    }
    return result;
  };

  let bahtStr = '';
  if (intPart.length > 6) {
    const millionPart = intPart.slice(0, intPart.length - 6);
    const lowerPart = intPart.slice(intPart.length - 6);
    bahtStr = convertGroup(millionPart) + 'ล้าน' + convertGroup(lowerPart);
  } else {
    bahtStr = convertGroup(intPart);
  }

  bahtStr += 'บาท';

  if (decPart === '00') {
    bahtStr += 'ถ้วน';
  } else {
    let satangStr = '';
    const s1 = parseInt(decPart[0], 10);
    const s2 = parseInt(decPart[1], 10);

    if (s1 !== 0) {
      if (s1 === 1) satangStr += 'สิบ';
      else if (s1 === 2) satangStr += 'ยี่สิบ';
      else satangStr += numbers[s1] + 'สิบ';
    }
    if (s2 !== 0) {
      if (s2 === 1 && s1 !== 0) satangStr += 'เอ็ด';
      else satangStr += numbers[s2];
    }
    bahtStr += satangStr + 'สตางค์';
  }

  return bahtStr;
}
