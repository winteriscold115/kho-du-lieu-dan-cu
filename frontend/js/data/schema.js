/**
 * schema.js — Định nghĩa cấu trúc 5 nhóm dữ liệu (map 1-1 với các tab Google Sheet ở SPEC mục 3).
 *
 * Đây là "nguồn sự thật" về cột dữ liệu, dùng chung cho:
 *  - MockService / AppsScriptService (đọc/ghi đúng cột)
 *  - Bảng danh sách, form, xuất CSV (sinh cột tự động)
 *  - Apps Script setupSheets() (tạo header đúng thứ tự)
 *
 * Mỗi field:
 *  key    : tên cột trong Google Sheet (không dấu, snake_case)
 *  label  : nhãn hiển thị tiếng Việt
 *  type   : text | number | percent | date | status | money
 *  filter : true nếu dùng làm bộ lọc trên giao diện
 */

// Thứ tự khai báo cũng là thứ tự cột trên Sheet.
const NGUON_FIELD = { key: 'nguon_du_lieu', label: 'Nguồn dữ liệu', type: 'text' };

const SCHEMA = {
  NghiQuyet: {
    label: 'Nghị quyết',
    sheet: 'NghiQuyet',
    idKey: 'ma_nq',
    icon: '📜',
    fields: [
      { key: 'ma_nq', label: 'Mã nghị quyết', type: 'text' },
      { key: 'ten_nq', label: 'Tên/trích yếu', type: 'text' },
      { key: 'linh_vuc', label: 'Lĩnh vực', type: 'text', filter: true },
      { key: 'ngay_ban_hanh', label: 'Ngày ban hành', type: 'date' },
      { key: 'co_quan_thuc_hien', label: 'Cơ quan thực hiện', type: 'text', filter: true },
      { key: 'nhiem_vu', label: 'Nhiệm vụ giao', type: 'text' },
      { key: 'chi_tieu', label: 'Chỉ tiêu', type: 'text' },
      { key: 'thoi_han', label: 'Thời hạn hoàn thành', type: 'date' },
      { key: 'trang_thai', label: 'Trạng thái', type: 'status', filter: true },
      { key: 'ket_qua', label: 'Kết quả thực hiện', type: 'text' },
      { key: 'ghi_chu', label: 'Ghi chú', type: 'text' },
      NGUON_FIELD,
    ],
  },

  GiamSat: {
    label: 'Giám sát',
    sheet: 'GiamSat',
    idKey: 'ma_gs',
    icon: '🔍',
    fields: [
      { key: 'ma_gs', label: 'Mã cuộc giám sát', type: 'text' },
      { key: 'ten_gs', label: 'Tên cuộc giám sát', type: 'text' },
      { key: 'linh_vuc', label: 'Lĩnh vực', type: 'text', filter: true },
      { key: 'don_vi_chiu_gs', label: 'Đối tượng giám sát', type: 'text', filter: true },
      { key: 'thoi_gian', label: 'Thời gian thực hiện', type: 'date' },
      { key: 'ket_luan', label: 'Kết luận', type: 'text' },
      { key: 'kien_nghi', label: 'Kiến nghị sau giám sát', type: 'text' },
      { key: 'trang_thai_thuc_hien_kn', label: 'Trạng thái thực hiện kiến nghị', type: 'status', filter: true },
      { key: 'thoi_han', label: 'Thời hạn', type: 'date' },
      { key: 'ghi_chu', label: 'Ghi chú', type: 'text' },
      NGUON_FIELD,
    ],
  },

  KienNghiCuTri: {
    label: 'Kiến nghị cử tri',
    sheet: 'KienNghiCuTri',
    idKey: 'ma_kn',
    icon: '📣',
    fields: [
      { key: 'ma_kn', label: 'Mã kiến nghị', type: 'text' },
      { key: 'noi_dung', label: 'Nội dung kiến nghị', type: 'text' },
      { key: 'nhom_linh_vuc', label: 'Nhóm/lĩnh vực', type: 'text', filter: true },
      { key: 'don_vi_giai_quyet', label: 'Cơ quan giải quyết', type: 'text', filter: true },
      { key: 'ngay_tiep_nhan', label: 'Ngày tiếp nhận', type: 'date' },
      { key: 'thoi_han_giai_quyet', label: 'Thời hạn giải quyết', type: 'date' },
      { key: 'trang_thai', label: 'Trạng thái giải quyết', type: 'status', filter: true },
      { key: 'ket_qua', label: 'Kết quả trả lời', type: 'text' },
      { key: 'ghi_chu', label: 'Ghi chú', type: 'text' },
      NGUON_FIELD,
    ],
  },

  NganSach: {
    label: 'Thu – chi ngân sách',
    sheet: 'NganSach',
    idKey: 'ma_chi_tieu',
    icon: '💰',
    fields: [
      { key: 'ma_chi_tieu', label: 'Mã chỉ tiêu', type: 'text' },
      { key: 'ten_chi_tieu', label: 'Tên chỉ tiêu', type: 'text' },
      { key: 'linh_vuc', label: 'Lĩnh vực', type: 'text', filter: true },
      { key: 'don_vi', label: 'Đơn vị quản lý', type: 'text', filter: true },
      { key: 'du_toan', label: 'Dự toán', type: 'money' },
      { key: 'thuc_hien', label: 'Thực hiện', type: 'money' },
      { key: 'ty_le', label: 'Tỷ lệ thực hiện', type: 'percent' },
      { key: 'ky_bao_cao', label: 'Kỳ báo cáo', type: 'text', filter: true },
      { key: 'ghi_chu', label: 'Ghi chú', type: 'text' },
      NGUON_FIELD,
    ],
  },

  DauTuCong: {
    label: 'Đầu tư công',
    sheet: 'DauTuCong',
    idKey: 'ma_du_an',
    icon: '🏗️',
    fields: [
      { key: 'ma_du_an', label: 'Mã dự án', type: 'text' },
      { key: 'ten_du_an', label: 'Tên dự án', type: 'text' },
      { key: 'chu_dau_tu', label: 'Chủ đầu tư', type: 'text', filter: true },
      { key: 'tong_muc_dau_tu', label: 'Tổng mức đầu tư', type: 'money' },
      { key: 'da_giai_ngan', label: 'Đã giải ngân', type: 'money' },
      { key: 'ty_le_giai_ngan', label: 'Tỷ lệ giải ngân', type: 'percent' },
      { key: 'tien_do', label: 'Tiến độ', type: 'status', filter: true },
      { key: 'thoi_han', label: 'Thời hạn', type: 'date' },
      { key: 'trang_thai', label: 'Trạng thái', type: 'status', filter: true },
      { key: 'ghi_chu', label: 'Ghi chú', type: 'text' },
      NGUON_FIELD,
    ],
  },
};

// Danh sách nhóm theo thứ tự hiển thị
const GROUP_KEYS = ['NghiQuyet', 'GiamSat', 'KienNghiCuTri', 'NganSach', 'DauTuCong'];

if (typeof module !== 'undefined') module.exports = { SCHEMA, GROUP_KEYS };
