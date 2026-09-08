/**
 * alerts.js — Quy tắc cảnh báo (SPEC mục 4.5). Ngưỡng lấy từ CONFIG.ALERT ([CHỜ BAN XÁC NHẬN]).
 *
 * Trả về mảng cảnh báo dạng:
 *   { group, level: 'do'|'cam', title, detail, record }
 *   level 'do'  = đỏ   (quá hạn / rất thấp)
 *   level 'cam' = cam  (sắp đến hạn / thấp)
 */
const Alerts = {
  _hoanThanh(status) {
    return CONFIG.ALERT.TRANG_THAI_HOAN_THANH.includes(status);
  },

  /** Cảnh báo theo hạn: quá hạn (đỏ) hoặc sắp đến hạn (cam) nếu chưa hoàn thành. */
  _theoHan(group, row, deadlineKey, statusKey, tenBanGhi) {
    if (this._hoanThanh(row[statusKey])) return null;
    const d = Util.daysLeft(row[deadlineKey]);
    if (d == null) return null;
    if (d < 0) {
      return { group, level: 'do', title: `Quá hạn ${-d} ngày`, detail: tenBanGhi, record: row };
    }
    if (d <= CONFIG.ALERT.SAP_DEN_HAN_NGAY) {
      return { group, level: 'cam', title: `Sắp đến hạn (còn ${d} ngày)`, detail: tenBanGhi, record: row };
    }
    return null;
  },

  /** Tính toàn bộ cảnh báo từ dữ liệu đã tải: { NghiQuyet:[...], ... } */
  compute(allData) {
    const out = [];
    const push = (a) => { if (a) out.push(a); };

    // 1) Nghị quyết: nhiệm vụ chậm/quá hạn
    (allData.NghiQuyet || []).forEach((r) =>
      push(this._theoHan('NghiQuyet', r, 'thoi_han', 'trang_thai', `${r.ma_nq} — ${r.ten_nq}`)));

    // 2) Giám sát: kiến nghị sau giám sát chậm thực hiện
    (allData.GiamSat || []).forEach((r) =>
      push(this._theoHan('GiamSat', r, 'thoi_han', 'trang_thai_thuc_hien_kn', `${r.ma_gs} — ${r.ten_gs}`)));

    // 3) Kiến nghị cử tri: quá hạn giải quyết
    (allData.KienNghiCuTri || []).forEach((r) =>
      push(this._theoHan('KienNghiCuTri', r, 'thoi_han_giai_quyet', 'trang_thai', `${r.ma_kn} — ${r.noi_dung}`)));

    // 4) Ngân sách: tỷ lệ thực hiện thấp hơn ngưỡng
    (allData.NganSach || []).forEach((r) => {
      const tl = Number(r.ty_le);
      if (!isNaN(tl) && tl < CONFIG.ALERT.NGAN_SACH_TY_LE_THAP) {
        push({ group: 'NganSach', level: tl < CONFIG.ALERT.NGAN_SACH_TY_LE_THAP / 2 ? 'do' : 'cam',
          title: `Thực hiện thấp (${tl}%)`, detail: `${r.ma_chi_tieu} — ${r.ten_chi_tieu}`, record: r });
      }
    });

    // 5) Đầu tư công: giải ngân thấp hoặc chậm tiến độ
    (allData.DauTuCong || []).forEach((r) => {
      const tl = Number(r.ty_le_giai_ngan);
      const cham = CONFIG.ALERT.TIEN_DO_CHAM.includes(r.tien_do);
      const thap = !isNaN(tl) && tl < CONFIG.ALERT.DAU_TU_TY_LE_GIAI_NGAN_THAP;
      if (thap || cham) {
        const lyDo = [];
        if (thap) lyDo.push(`giải ngân ${tl}%`);
        if (cham) lyDo.push('chậm tiến độ');
        push({ group: 'DauTuCong', level: (thap && tl < 30) || cham ? 'do' : 'cam',
          title: `Cảnh báo: ${lyDo.join(', ')}`, detail: `${r.ma_du_an} — ${r.ten_du_an}`, record: r });
      }
    });

    // Đỏ trước, cam sau
    out.sort((a, b) => (a.level === b.level ? 0 : a.level === 'do' ? -1 : 1));
    return out;
  },
};

if (typeof module !== 'undefined') module.exports = { Alerts };
