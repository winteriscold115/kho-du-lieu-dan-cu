/**
 * mockService.js — Cài đặt lớp dữ liệu dùng dữ liệu mẫu nhúng sẵn (SAMPLE_DATA).
 * Cho phép mở index.html là chạy ngay, không cần Google Sheet hay mạng.
 * Ghi (create/update) chỉ lưu trong bộ nhớ trình duyệt, mất khi tải lại trang.
 */
class MockService {
  constructor() {
    // Sao chép sâu để thao tác ghi không làm bẩn dữ liệu gốc
    this._data = JSON.parse(JSON.stringify(SAMPLE_DATA));
    this._catalogs = JSON.parse(JSON.stringify(SAMPLE_CATALOGS));
  }

  _delay(value) {
    // Giả lập độ trễ mạng nhẹ để giao diện xử lý loading giống môi trường thật
    return new Promise((resolve) => setTimeout(() => resolve(value), 120));
  }

  list(group) {
    return this._delay((this._data[group] || []).slice());
  }

  getCatalogs() {
    return this._delay({
      DM_DonVi: this._catalogs.DM_DonVi || [],
      DM_LinhVuc: this._catalogs.DM_LinhVuc || [],
      DM_TrangThai: this._catalogs.DM_TrangThai || [],
    });
  }

  create(group, row) {
    this._data[group] = this._data[group] || [];
    this._data[group].push(row);
    return this._delay(row);
  }

  update(group, id, row) {
    const idKey = SCHEMA[group].idKey;
    const arr = this._data[group] || [];
    const i = arr.findIndex((r) => r[idKey] === id);
    if (i >= 0) arr[i] = Object.assign({}, arr[i], row);
    return this._delay(arr[i]);
  }
}
