import { Business } from '../types';

export const BUSINESS_CATEGORIES = [
  '1. กิจการที่เกี่ยวกับการเลี้ยงสัตว์',
  '2. กิจการที่เกี่ยวกับอาหาร เครื่องดื่ม น้ำดื่ม',
  '3. กิจการที่เกี่ยวกับสถานบริการสาธารณสุข',
  '4. กิจการที่เกี่ยวกับสิ่งทอ',
  '5. กิจการที่เกี่ยวกับไม้หรือกระดาษ',
  '6. กิจการที่เกี่ยวกับงา ช้าง สัตว์ หรือกระดูก',
  '7. กิจการที่เกี่ยวกับสารเคมี',
  '8. กิจการที่เกี่ยวกับโลหะหรือแร่',
  '9. กิจการที่เกี่ยวกับยานยนต์ เครื่องจักร',
  '10. กิจการที่เกี่ยวกับอิฐ หิน ปูน ทราย',
  '11. กิจการที่เกี่ยวกับกระทบกระเทือนผู้คน',
  '12. กิจการบริการห้องพัก สถานบริการ',
  '13. กิจการอื่นๆ ตามประกาศกระทรวง'
];

export const PHRA_SONG_VILLAGES = [
  'หมู่ 1',
  'หมู่ 2',
  'หมู่ 3',
  'หมู่ 4',
  'หมู่ 5',
  'หมู่ 6',
  'หมู่ 7',
  'หมู่ 8',
  'หมู่ 9',
  'หมู่ 10',
  'หมู่ 11',
  'หมู่ 12',
  'หมู่ 13',
  'หมู่ 14',
  'หมู่ 15',
  'หมู่ 16'
];

export const SAMPLE_BUSINESSES: Business[] = [
  {
    id: 'biz-01',
    licenseNo: 'พซ. 67/001',
    shopName: 'ร้านพระซองการเกษตรและปุ๋ยเคมี',
    ownerName: 'นายวิชัย สมบูรณ์',
    idCard: '1350100234561',
    phone: '081-234-5678',
    lineId: 'wichai_phrasong',
    category: '7. กิจการที่เกี่ยวกับสารเคมี',
    address: '12/1 ถ.นาแก-พระซอง',
    village: 'หมู่ 1',
    issueDate: '2023-11-15',
    expDate: '2026-11-15', // Near expiring (within ~17 days)
    fee: 1000,
    lastInspected: '2023-11-10',
    inspectStatus: 'PASS',
    notes: 'จัดเก็บสารเคมีและปุ๋ยในที่ร่ม มีการระบายอากาศและถังดับเพลิงพร้อมใช้งาน',
    inspectionHistory: [
      {
        id: 'insp-01',
        date: '2023-11-10',
        inspector: 'นายสมชาย บริบาล (นักวิชาการสาธารณสุขชำนาญการ)',
        result: 'PASS',
        notes: 'ผ่านเกณฑ์มาตรฐานความปลอดภัยสารเคมี',
        checklist: { cleanliness: true, wasteManagement: true, airAndNoise: true, fireSafety: true }
      }
    ],
    paymentHistory: [
      {
        id: 'pay-01',
        date: '2023-11-15',
        receiptNo: 'REC-67/001',
        fee: 1000,
        fine: 0,
        total: 1000,
        recordedBy: 'นายไตรวรรธก์ ทองยืน (ผู้ช่วยเจ้าพนักงานจัดเก็บรายได้)'
      }
    ]
  },
  {
    id: 'biz-02',
    licenseNo: 'พซ. 67/002',
    shopName: 'อู่วิชัยการช่าง & คาร์แคร์พระซอง',
    ownerName: 'นายสมศักดิ์ ชัยเจริญ',
    idCard: '1350100456782',
    phone: '089-876-5432',
    lineId: 'somsak_fix',
    category: '8. กิจการที่เกี่ยวกับโลหะหรือแร่',
    address: '45 หมู่ 2',
    village: 'หมู่ 2',
    issueDate: '2023-10-10',
    expDate: '2026-10-10', // Already Expired by ~19 days
    fee: 1500,
    lastInspected: '2023-10-01',
    inspectStatus: 'PASS',
    notes: 'มีบ่อดักไขมันและตะกอนน้ำมันก่อนปล่อยทิ้ง',
    inspectionHistory: [],
    paymentHistory: []
  },
  {
    id: 'biz-03',
    licenseNo: 'พซ. 67/003',
    shopName: 'โรงงานน้ำดื่มพระซองบริสุทธิ์',
    ownerName: 'นางนภา พรประเสริฐ',
    idCard: '1350100789012',
    phone: '086-112-2334',
    lineId: 'napawater',
    category: '2. กิจการที่เกี่ยวกับอาหาร เครื่องดื่ม น้ำดื่ม',
    address: '88 หมู่ 3',
    village: 'หมู่ 3',
    issueDate: '2024-01-15',
    expDate: '2027-01-15', // Active
    fee: 2000,
    lastInspected: '2024-01-10',
    inspectStatus: 'PASS',
    notes: 'ระบบกรอง RO + UV มีการตรวจคุณภาพน้ำผ่านเกณฑ์มาตรฐาน อย.สม่ำเสมอ',
    inspectionHistory: [],
    paymentHistory: []
  },
  {
    id: 'biz-04',
    licenseNo: 'พซ. 67/004',
    shopName: 'ฟาร์มสุกรเจริญทรัพย์',
    ownerName: 'นายเจริญ หมูทอง',
    idCard: '1350100998877',
    phone: '083-445-5667',
    lineId: 'charoen_farm',
    category: '1. กิจการที่เกี่ยวกับการเลี้ยงสัตว์',
    address: '102 หมู่ 5',
    village: 'หมู่ 5',
    issueDate: '2023-11-28',
    expDate: '2026-11-28', // Expiring soon (~30 days)
    fee: 1200,
    lastInspected: '2023-11-20',
    inspectStatus: 'PASS_COND',
    notes: 'มีระบบบ่อบำบัดก๊าซชีวภาพ ต้องหมั่นฉีดพ่น EM ดับกลิ่นเพื่อป้องกันข้อร้องเรียน',
    inspectionHistory: [],
    paymentHistory: []
  },
  {
    id: 'biz-05',
    licenseNo: 'พซ. 67/005',
    shopName: 'พระซองรีสอร์ท & ห้องพักนาแก',
    ownerName: 'นางสาวสุดาพร มณีรัตน์',
    idCard: '1350100112233',
    phone: '087-998-8776',
    lineId: 'phrasong_resort',
    category: '12. กิจการบริการห้องพัก สถานบริการ',
    address: '15/2 หมู่ 8',
    village: 'หมู่ 8',
    issueDate: '2024-03-01',
    expDate: '2027-03-01', // Active
    fee: 2500,
    lastInspected: '2024-02-25',
    inspectStatus: 'PASS',
    notes: 'ห้องพักสะอาด ได้มาตรฐานความปลอดภัย มีถังดับเพลิงทุกชั้น',
    inspectionHistory: [],
    paymentHistory: []
  },
  {
    id: 'biz-06',
    licenseNo: 'พซ. 67/006',
    shopName: 'โรงกลึงและงานเชื่อมนาคู่โลหะกิจ',
    ownerName: 'นายประสิทธิ์ ช่างทอง',
    idCard: '1350100334455',
    phone: '084-556-7788',
    lineId: 'prasit_welding',
    category: '8. กิจการที่เกี่ยวกับโลหะหรือแร่',
    address: '77/1 หมู่ 4',
    village: 'หมู่ 4',
    issueDate: '2023-11-05',
    expDate: '2026-11-05', // Expiring in ~7 days
    fee: 1000,
    lastInspected: '2023-10-28',
    inspectStatus: 'PASS',
    notes: 'ติดตั้งฉากกั้นแสงเชื่อม มีป้ายเตือนและอุปกรณ์ PPE',
    inspectionHistory: [],
    paymentHistory: []
  },
  {
    id: 'biz-07',
    licenseNo: 'พซ. 67/007',
    shopName: 'โรงสีข้าวชุมชนโคกสว่างพัฒนา',
    ownerName: 'นายบุญมา มีสุข',
    idCard: '1350100667788',
    phone: '082-334-5566',
    lineId: 'boonma_rice',
    category: '10. กิจการที่เกี่ยวกับอิฐ หิน ปูน ทราย',
    address: '50 หมู่ 6',
    village: 'หมู่ 6',
    issueDate: '2024-05-10',
    expDate: '2027-05-10', // Active
    fee: 1500,
    lastInspected: '2024-05-02',
    inspectStatus: 'PASS',
    notes: 'มีระบบดักจับฝุ่นละอองรำข้าวและแกลบเรียบร้อย',
    inspectionHistory: [],
    paymentHistory: []
  },
  {
    id: 'biz-08',
    licenseNo: 'พซ. 67/008',
    shopName: 'คำพอกคาร์แคร์ ล้างอัดฉีด',
    ownerName: 'นายอนันต์ รุ่งเรือง',
    idCard: '1350100554433',
    phone: '085-776-8899',
    lineId: 'anun_carcare',
    category: '9. กิจการที่เกี่ยวกับยานยนต์ เครื่องจักร',
    address: '22 หมู่ 7',
    village: 'หมู่ 7',
    issueDate: '2023-09-18',
    expDate: '2026-09-18', // Expired
    fee: 800,
    lastInspected: '2023-09-10',
    inspectStatus: 'PASS',
    notes: 'มีบ่อตกตะกอนน้ำเสียก่อนระบายสู่ท่อสาธารณะ',
    inspectionHistory: [],
    paymentHistory: []
  },
  {
    id: 'biz-09',
    licenseNo: 'พซ. 67/009',
    shopName: 'ฟาร์มไก่เนื้อโพนสว่าง',
    ownerName: 'นางวรรณา ศรีสุข',
    idCard: '1350100889900',
    phone: '088-223-4455',
    lineId: 'wanna_poultry',
    category: '1. กิจการที่เกี่ยวกับการเลี้ยงสัตว์',
    address: '99/4 หมู่ 11',
    village: 'หมู่ 11',
    issueDate: '2024-02-12',
    expDate: '2027-02-12', // Active
    fee: 1200,
    lastInspected: '2024-02-05',
    inspectStatus: 'PASS',
    notes: 'โรงเรือนระบบปิด (Evaporative Cooling System) กลิ่นรบกวนน้อย',
    inspectionHistory: [],
    paymentHistory: []
  },
  {
    id: 'biz-10',
    licenseNo: 'พซ. 67/010',
    shopName: 'โรงงานทำอิฐบล็อกดอนพัฒนา',
    ownerName: 'นายสมบัติ ศิลาทอง',
    idCard: '1350100778899',
    phone: '081-998-1122',
    lineId: 'sombat_block',
    category: '10. กิจการที่เกี่ยวกับอิฐ หิน ปูน ทราย',
    address: '34 หมู่ 12',
    village: 'หมู่ 12',
    issueDate: '2023-11-20',
    expDate: '2026-11-20', // Expiring in ~22 days
    fee: 1000,
    lastInspected: '2023-11-12',
    inspectStatus: 'PASS',
    notes: 'มีระบบฉีดสเปรย์ละอองน้ำลดฝุ่นขณะโม่ปูนและลำเลียงหินทราย',
    inspectionHistory: [],
    paymentHistory: []
  }
];
