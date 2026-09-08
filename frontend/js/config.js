/**
 * config.js — Cấu hình toàn ứng dụng. Sửa file này để đổi nguồn dữ liệu & ngưỡng cảnh báo.
 */
const CONFIG = {
  // Tên ứng dụng hiển thị trên thanh tiêu đề
  APP_NAME: 'Kho dữ liệu dân cử dùng chung',
  APP_SUBTITLE: 'Giai đoạn 1 — Bản thử nghiệm',

  // ─────────────────────────────────────────────────────────────
  // NGUỒN DỮ LIỆU
  //  true  → dùng dữ liệu mẫu nhúng sẵn trong trình duyệt (mở là chạy, không cần Sheet)
  //  false → gọi Google Apps Script Web App (đặt URL bên dưới)
  // ─────────────────────────────────────────────────────────────
  USE_MOCK: true,

  // Dán URL Web App sau khi Deploy Apps Script (dạng .../exec). Xem README mục "Nối Google Sheet".
  APPS_SCRIPT_URL: '',

  // ─────────────────────────────────────────────────────────────
  // NGƯỠNG CẢNH BÁO  — [CHỜ BAN XÁC NHẬN]
  // Các giá trị mặc định dưới đây chỉ để chạy thử; từng Ban cần chốt lại (SPEC mục 4 & 7).
  // ─────────────────────────────────────────────────────────────
  ALERT: {
    // Số ngày trước hạn thì coi là "sắp đến hạn"
    SAP_DEN_HAN_NGAY: 30,
    // Ngân sách: tỷ lệ thực hiện (%) thấp hơn ngưỡng này thì cảnh báo (theo kỳ 6 tháng)
    NGAN_SACH_TY_LE_THAP: 50,
    // Đầu tư công: tỷ lệ giải ngân (%) thấp hơn ngưỡng này thì cảnh báo
    DAU_TU_TY_LE_GIAI_NGAN_THAP: 60,
    // Các trạng thái được coi là "đã xong" (không tính quá hạn nữa)
    TRANG_THAI_HOAN_THANH: ['Đã thực hiện', 'Đã giải quyết', 'Hoàn thành', 'Đã hoàn thành'],
    // Các giá trị tiến độ bị coi là chậm (đầu tư công)
    TIEN_DO_CHAM: ['Chậm'],
  },

  // Ngày tham chiếu cho tính quá hạn. Để trống → dùng ngày hệ thống.
  // Đặt cứng '2026-09-08' để demo cho khớp mốc dữ liệu mẫu.
  NGAY_THAM_CHIEU: '2026-09-08',

  // Số dòng mỗi trang ở bảng danh sách
  PAGE_SIZE: 10,
};

if (typeof module !== 'undefined') module.exports = { CONFIG };
