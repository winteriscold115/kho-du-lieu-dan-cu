/**
 * appsScriptService.js — Cài đặt lớp dữ liệu gọi Google Apps Script Web App (API JSON).
 *
 * Tương ứng với backend apps-script/Code.gs:
 *   GET  ?action=list&sheet=NghiQuyet   → { ok, data:[...] }
 *   GET  ?action=catalogs               → { ok, data:{DM_DonVi,...} }
 *   POST {action:'create'|'update', sheet, id?, row}  → { ok, data }
 *
 * Lưu ý CORS: Apps Script không trả header cho preflight OPTIONS, nên POST gửi dưới dạng
 * text/plain (đây là "simple request", trình duyệt không preflight). Backend tự parse JSON.
 */
class AppsScriptService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async _get(params) {
    const qs = new URLSearchParams(params).toString();
    // cache:'no-store' để luôn lấy dữ liệu mới nhất từ Sheet (Apps Script GET có thể bị trình duyệt cache).
    const res = await fetch(`${this.baseUrl}?${qs}`, { method: 'GET', cache: 'no-store' });
    const json = await res.json();
    if (!json.ok) throw new Error(json.error || 'Lỗi không xác định từ máy chủ');
    return json.data;
  }

  async _post(body) {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      // text/plain để tránh preflight CORS với Apps Script
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!json.ok) throw new Error(json.error || 'Lỗi không xác định từ máy chủ');
    return json.data;
  }

  list(group) {
    return this._get({ action: 'list', sheet: group });
  }

  getCatalogs() {
    return this._get({ action: 'catalogs' });
  }

  create(group, row) {
    return this._post({ action: 'create', sheet: group, row });
  }

  update(group, id, row) {
    return this._post({ action: 'update', sheet: group, id, row });
  }
}
