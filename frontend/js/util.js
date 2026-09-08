/**
 * util.js — Hàm tiện ích dùng chung: định dạng, ngày tháng, xuất CSV, escape HTML.
 */
const Util = {
  /** Ngày tham chiếu (Date) để tính quá hạn — theo CONFIG.NGAY_THAM_CHIEU hoặc hôm nay. */
  today() {
    if (CONFIG.NGAY_THAM_CHIEU) return Util.parseDate(CONFIG.NGAY_THAM_CHIEU);
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  },

  /** Chuỗi 'YYYY-MM-DD' → Date (00:00). Trả null nếu không hợp lệ. */
  parseDate(s) {
    if (!s) return null;
    if (s instanceof Date) return s;
    const m = String(s).trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!m) return null;
    return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  },

  /** Date/chuỗi → 'DD/MM/YYYY' để hiển thị. */
  formatDate(s) {
    const d = Util.parseDate(s);
    if (!d) return s || '';
    const p = (n) => String(n).padStart(2, '0');
    return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
  },

  /** Số ngày còn lại đến hạn (âm = đã quá hạn). null nếu không có hạn. */
  daysLeft(deadline) {
    const d = Util.parseDate(deadline);
    if (!d) return null;
    const ms = d.getTime() - Util.today().getTime();
    return Math.round(ms / 86400000);
  },

  /** Định dạng số tiền (đơn vị: triệu đồng theo dữ liệu mẫu). */
  formatMoney(n) {
    if (n === '' || n == null || isNaN(Number(n))) return n || '';
    return Number(n).toLocaleString('vi-VN');
  },

  /** Định dạng phần trăm. */
  formatPercent(n) {
    if (n === '' || n == null || isNaN(Number(n))) return n || '';
    return `${Number(n)}%`;
  },

  /** Định dạng một giá trị theo type của field. */
  formatValue(value, type) {
    switch (type) {
      case 'date': return Util.formatDate(value);
      case 'money': return Util.formatMoney(value);
      case 'percent': return Util.formatPercent(value);
      default: return value == null ? '' : String(value);
    }
  },

  /** Escape HTML để tránh lỗi hiển thị khi dữ liệu chứa < > &. */
  esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  /** Bỏ dấu tiếng Việt + lowercase để tìm kiếm không phân biệt dấu. */
  normalize(s) {
    return String(s == null ? '' : s)
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/đ/g, 'd');
  },

  /** Lấy danh sách giá trị duy nhất của 1 cột (cho dropdown lọc). */
  uniqueValues(rows, key) {
    const set = new Set();
    rows.forEach((r) => { if (r[key] != null && r[key] !== '') set.add(r[key]); });
    return Array.from(set).sort((a, b) => String(a).localeCompare(String(b), 'vi'));
  },

  /** Xuất mảng bản ghi ra CSV (UTF-8 BOM để Excel đọc đúng tiếng Việt) và tải về. */
  downloadCSV(fields, rows, filename) {
    const header = fields.map((f) => f.label);
    const lines = [header];
    rows.forEach((r) => lines.push(fields.map((f) => r[f.key] == null ? '' : r[f.key])));
    const csv = lines.map((row) =>
      row.map((cell) => {
        const s = String(cell).replace(/"/g, '""');
        return /[",\n]/.test(s) ? `"${s}"` : s;
      }).join(',')
    ).join('\r\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};

if (typeof module !== 'undefined') module.exports = { Util };
