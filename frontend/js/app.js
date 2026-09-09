/**
 * app.js — Bộ điều phối giao diện: tải dữ liệu, định tuyến (hash router), dựng các màn hình.
 * Màn hình: Dashboard | Từng nhóm dữ liệu (tra cứu/danh sách) | Báo cáo & biểu đồ | Cảnh báo.
 */
const App = {
  state: { data: {}, catalogs: {}, alerts: [], loaded: false },
  // Bộ lọc/hiển thị riêng cho mỗi nhóm (giữ khi chuyển qua lại)
  ui: {},

  async init() {
    this._renderChrome();
    window.addEventListener('hashchange', () => this.route());
    try {
      await this.loadAll();
    } catch (e) {
      document.getElementById('view').innerHTML =
        `<div class="error-box"><b>Không tải được dữ liệu.</b><br>${Util.esc(e.message)}
         <br><br>Kiểm tra <code>js/config.js</code> (USE_MOCK / APPS_SCRIPT_URL) — xem README.</div>`;
      return;
    }
    if (!location.hash) location.hash = '#dashboard';
    this.route();
  },

  async loadAll() {
    const banner = document.getElementById('data-source');
    banner.textContent = CONFIG.USE_MOCK || !CONFIG.APPS_SCRIPT_URL
      ? '● Đang dùng DỮ LIỆU MẪU (nhúng sẵn) — chưa nối Google Sheet'
      : '● Đang nối Google Sheet qua Apps Script';
    banner.className = 'data-source ' + (CONFIG.USE_MOCK ? 'mock' : 'live');

    const groups = GROUP_KEYS;
    const results = await Promise.all(groups.map((g) => DataService.list(g)));
    groups.forEach((g, i) => { this.state.data[g] = results[i]; });
    this.state.catalogs = await DataService.getCatalogs();
    this.state.alerts = Alerts.compute(this.state.data);
    this.state.loaded = true;
    this._renderNav();
  },

  // ───────────────────────── Khung giao diện ─────────────────────────
  _renderChrome() {
    document.getElementById('app-name').textContent = CONFIG.APP_NAME;
    document.getElementById('app-subtitle').textContent = CONFIG.APP_SUBTITLE;
  },

  _renderNav() {
    const nav = document.getElementById('nav');
    const alertCount = this.state.alerts.length;
    const items = [
      { hash: '#dashboard', icon: '📊', label: 'Bảng điều hành' },
      ...GROUP_KEYS.map((g) => ({ hash: `#group/${g}`, icon: SCHEMA[g].icon, label: SCHEMA[g].label })),
      { hash: '#baocao', icon: '📈', label: 'Báo cáo & biểu đồ' },
      { hash: '#canhbao', icon: '🔔', label: `Cảnh báo${alertCount ? ` (${alertCount})` : ''}` },
      { hash: '#phieu', icon: '📝', label: 'Phiếu yêu cầu' },
    ];
    nav.innerHTML = items.map((it) =>
      `<a href="${it.hash}" data-hash="${it.hash.split('/')[0]}"><span>${it.icon}</span> ${it.label}</a>`
    ).join('');
  },

  _setActiveNav() {
    const base = '#' + (location.hash.replace('#', '').split('/')[0] || 'dashboard');
    document.querySelectorAll('#nav a').forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === location.hash ||
        a.getAttribute('href').split('/')[0] === base);
    });
  },

  route() {
    if (!this.state.loaded) return;
    this._setActiveNav();
    const [path, arg] = location.hash.replace('#', '').split('/');
    const view = document.getElementById('view');
    if (path === 'group' && SCHEMA[arg]) return this.renderGroup(arg, view);
    if (path === 'baocao') return this.renderReports(view);
    if (path === 'canhbao') return this.renderAlerts(view);
    if (path === 'phieu') return this.renderPhieu(view);
    return this.renderDashboard(view);
  },

  // ───────────────────────── Chỉ số/metric ─────────────────────────
  _completion(group) {
    const rows = this.state.data[group] || [];
    if (!rows.length) return null;
    if (group === 'NganSach') {
      const avg = rows.reduce((s, r) => s + (Number(r.ty_le) || 0), 0) / rows.length;
      return Math.round(avg);
    }
    if (group === 'DauTuCong') {
      const avg = rows.reduce((s, r) => s + (Number(r.ty_le_giai_ngan) || 0), 0) / rows.length;
      return Math.round(avg);
    }
    const statusKey = group === 'GiamSat' ? 'trang_thai_thuc_hien_kn' : 'trang_thai';
    const done = rows.filter((r) => Alerts._hoanThanh(r[statusKey])).length;
    return Math.round((done / rows.length) * 100);
  },

  _countAlertsByGroup(group) {
    return this.state.alerts.filter((a) => a.group === group).length;
  },

  // ───────────────────────── Bảng điều hành ─────────────────────────
  renderDashboard(view) {
    const cards = GROUP_KEYS.map((g) => {
      const rows = this.state.data[g] || [];
      const comp = this._completion(g);
      const alerts = this._countAlertsByGroup(g);
      const compLabel = (g === 'NganSach') ? 'TB tỷ lệ thực hiện'
        : (g === 'DauTuCong') ? 'TB tỷ lệ giải ngân' : 'Tỷ lệ hoàn thành';
      return `
        <a class="card" href="#group/${g}">
          <div class="card-head"><span class="card-icon">${SCHEMA[g].icon}</span>
            <span class="card-title">${SCHEMA[g].label}</span></div>
          <div class="card-num">${rows.length}<span> bản ghi</span></div>
          <div class="card-meta">${compLabel}: <b>${comp == null ? '—' : comp + '%'}</b></div>
          <div class="progress"><div style="width:${comp || 0}%"></div></div>
          <div class="card-alert ${alerts ? 'has' : ''}">🔔 ${alerts} cảnh báo</div>
        </a>`;
    }).join('');

    const totalRecords = GROUP_KEYS.reduce((s, g) => s + (this.state.data[g] || []).length, 0);
    const totalOverdue = this.state.alerts.filter((a) => a.level === 'do').length;
    const totalSoon = this.state.alerts.filter((a) => a.level === 'cam').length;

    const topAlerts = this.state.alerts.slice(0, 6).map((a) => this._alertRow(a)).join('') ||
      '<p class="muted">Không có cảnh báo.</p>';

    view.innerHTML = `
      <h1>Bảng điều hành</h1>
      <p class="muted">Tổng quan 5 nhóm dữ liệu tính đến ngày ${Util.formatDate(Util.today())}.</p>
      <div class="stat-row">
        <div class="stat"><div class="stat-num">${totalRecords}</div><div>Tổng bản ghi</div></div>
        <div class="stat do"><div class="stat-num">${totalOverdue}</div><div>Quá hạn / nghiêm trọng</div></div>
        <div class="stat cam"><div class="stat-num">${totalSoon}</div><div>Sắp đến hạn / cần chú ý</div></div>
        <div class="stat"><div class="stat-num">${this.state.alerts.length}</div><div>Tổng cảnh báo</div></div>
      </div>
      <div class="cards">${cards}</div>
      <h2>Cảnh báo nổi bật</h2>
      <div class="alert-list">${topAlerts}</div>`;
  },

  _alertRow(a) {
    return `<div class="alert-item ${a.level}">
      <span class="alert-tag">${a.level === 'do' ? 'ĐỎ' : 'CAM'}</span>
      <span class="alert-group">${SCHEMA[a.group].icon} ${SCHEMA[a.group].label}</span>
      <span class="alert-title">${Util.esc(a.title)}</span>
      <span class="alert-detail">${Util.esc(a.detail)}</span>
    </div>`;
  },

  // ───────────────────────── Màn hình một nhóm ─────────────────────────
  renderGroup(group, view) {
    const sc = SCHEMA[group];
    const ui = this.ui[group] || (this.ui[group] = { q: '', filters: {}, sort: null, dir: 1, page: 1 });
    const filterFields = sc.fields.filter((f) => f.filter);

    const filtersHtml = filterFields.map((f) => {
      const opts = Util.uniqueValues(this.state.data[group] || [], f.key);
      const sel = ui.filters[f.key] || '';
      return `<select data-filter="${f.key}">
        <option value="">— ${Util.esc(f.label)}: tất cả —</option>
        ${opts.map((o) => `<option ${o === sel ? 'selected' : ''}>${Util.esc(o)}</option>`).join('')}
      </select>`;
    }).join('');

    view.innerHTML = `
      <h1>${sc.icon} ${sc.label}</h1>
      <div class="toolbar">
        <input id="q" type="search" placeholder="Tìm theo từ khóa (không phân biệt dấu)…" value="${Util.esc(ui.q)}">
        ${filtersHtml}
        <button id="btn-reset" class="btn-ghost">Xóa lọc</button>
        <button id="btn-csv" class="btn">⬇ Xuất CSV</button>
      </div>
      <div id="group-table"></div>`;

    const rerender = () => this._renderGroupTable(group);
    view.querySelector('#q').addEventListener('input', (e) => { ui.q = e.target.value; ui.page = 1; rerender(); });
    view.querySelectorAll('[data-filter]').forEach((sel) =>
      sel.addEventListener('change', (e) => {
        ui.filters[e.target.dataset.filter] = e.target.value; ui.page = 1; rerender();
      }));
    view.querySelector('#btn-reset').addEventListener('click', () => {
      ui.q = ''; ui.filters = {}; ui.page = 1; this.renderGroup(group, view);
    });
    view.querySelector('#btn-csv').addEventListener('click', () => {
      const rows = this._filteredRows(group);
      Util.downloadCSV(sc.fields, rows, `${group}.csv`);
    });

    this._renderGroupTable(group);
  },

  _filteredRows(group) {
    const ui = this.ui[group];
    const sc = SCHEMA[group];
    let rows = (this.state.data[group] || []).slice();

    // Lọc theo từ khóa (mọi cột, không phân biệt dấu)
    if (ui.q.trim()) {
      const q = Util.normalize(ui.q);
      rows = rows.filter((r) => sc.fields.some((f) => Util.normalize(r[f.key]).includes(q)));
    }
    // Lọc theo dropdown
    Object.entries(ui.filters).forEach(([k, v]) => {
      if (v) rows = rows.filter((r) => r[k] === v);
    });
    // Sắp xếp
    if (ui.sort) {
      const f = sc.fields.find((x) => x.key === ui.sort);
      rows.sort((a, b) => {
        let av = a[ui.sort], bv = b[ui.sort];
        if (f && (f.type === 'number' || f.type === 'percent' || f.type === 'money')) {
          av = Number(av) || 0; bv = Number(bv) || 0;
          return (av - bv) * ui.dir;
        }
        if (f && f.type === 'date') {
          const at = Util.parseDate(av) ? Util.parseDate(av).getTime() : 0;
          const bt = Util.parseDate(bv) ? Util.parseDate(bv).getTime() : 0;
          return (at - bt) * ui.dir;
        }
        return String(av || '').localeCompare(String(bv || ''), 'vi') * ui.dir;
      });
    }
    return rows;
  },

  _renderGroupTable(group) {
    const sc = SCHEMA[group];
    const ui = this.ui[group];
    const rows = this._filteredRows(group);
    const pageSize = CONFIG.PAGE_SIZE;
    const pages = Math.max(1, Math.ceil(rows.length / pageSize));
    ui.page = Math.min(ui.page, pages);
    const pageRows = rows.slice((ui.page - 1) * pageSize, ui.page * pageSize);

    const th = sc.fields.map((f) => {
      const arrow = ui.sort === f.key ? (ui.dir === 1 ? ' ▲' : ' ▼') : '';
      return `<th data-sort="${f.key}" class="sortable">${Util.esc(f.label)}${arrow}</th>`;
    }).join('');

    const trs = pageRows.map((r) => {
      const tds = sc.fields.map((f) => {
        let cls = '';
        if (f.type === 'status') cls = ` class="status ${this._statusClass(r[f.key])}"`;
        return `<td${cls} data-label="${Util.esc(f.label)}">${Util.esc(Util.formatValue(r[f.key], f.type))}</td>`;
      }).join('');
      return `<tr>${tds}</tr>`;
    }).join('');

    const container = document.getElementById('group-table');
    container.innerHTML = `
      <div class="table-meta">Tìm thấy <b>${rows.length}</b> bản ghi
        ${ui.q || Object.values(ui.filters).some(Boolean) ? '(đã lọc)' : ''}</div>
      <div class="table-scroll"><table>
        <thead><tr>${th}</tr></thead>
        <tbody>${trs || `<tr><td colspan="${sc.fields.length}" class="muted">Không có dữ liệu phù hợp.</td></tr>`}</tbody>
      </table></div>
      <div class="pager">
        <button ${ui.page <= 1 ? 'disabled' : ''} data-page="prev">‹ Trước</button>
        <span>Trang ${ui.page}/${pages}</span>
        <button ${ui.page >= pages ? 'disabled' : ''} data-page="next">Sau ›</button>
      </div>`;

    container.querySelectorAll('th.sortable').forEach((el) =>
      el.addEventListener('click', () => {
        const key = el.dataset.sort;
        if (ui.sort === key) ui.dir = -ui.dir; else { ui.sort = key; ui.dir = 1; }
        this._renderGroupTable(group);
      }));
    container.querySelectorAll('[data-page]').forEach((el) =>
      el.addEventListener('click', () => {
        ui.page += el.dataset.page === 'next' ? 1 : -1;
        this._renderGroupTable(group);
      }));
  },

  _statusClass(status) {
    if (Alerts._hoanThanh(status)) return 'ok';
    if (CONFIG.ALERT.TIEN_DO_CHAM.includes(status) || /chưa/i.test(status || '')) return 'bad';
    return 'warn';
  },

  // ───────────────────────── Báo cáo & biểu đồ ─────────────────────────
  renderReports(view) {
    const d = this.state.data;

    // NghiQuyet: cơ cấu trạng thái
    const nqStatus = this._countBy(d.NghiQuyet, 'trang_thai');
    // Kiến nghị cử tri: cơ cấu trạng thái giải quyết
    const knStatus = this._countBy(d.KienNghiCuTri, 'trang_thai');
    // Ngân sách: tỷ lệ thực hiện theo chỉ tiêu
    const nsBars = (d.NganSach || []).map((r) => ({ label: r.ten_chi_tieu, value: Number(r.ty_le) || 0 }));
    // Đầu tư công: tỷ lệ giải ngân theo dự án
    const dtBars = (d.DauTuCong || []).map((r) => ({ label: r.ten_du_an, value: Number(r.ty_le_giai_ngan) || 0 }));

    view.innerHTML = `
      <h1>Báo cáo & biểu đồ</h1>
      <div class="report-grid">
        <section class="panel">
          <h3>📜 Nghị quyết theo trạng thái</h3>
          ${Charts.donut(nqStatus)}
        </section>
        <section class="panel">
          <h3>📣 Kiến nghị cử tri theo trạng thái giải quyết</h3>
          ${Charts.donut(knStatus)}
        </section>
        <section class="panel wide">
          <h3>💰 Tỷ lệ thực hiện ngân sách theo chỉ tiêu</h3>
          ${Charts.bar(nsBars, { isPercent: true })}
        </section>
        <section class="panel wide">
          <h3>🏗️ Tỷ lệ giải ngân đầu tư công theo dự án</h3>
          ${Charts.bar(dtBars, { isPercent: true })}
        </section>
      </div>`;
  },

  _countBy(rows, key) {
    const map = {};
    (rows || []).forEach((r) => { const v = r[key] || '(trống)'; map[v] = (map[v] || 0) + 1; });
    return Object.entries(map).map(([label, value]) => ({ label, value }));
  },

  // ───────────────────────── Cảnh báo ─────────────────────────
  renderAlerts(view) {
    if (!this.ui._alert) this.ui._alert = { group: '', level: '' };
    const st = this.ui._alert;
    const render = () => {
      let list = this.state.alerts;
      if (st.group) list = list.filter((a) => a.group === st.group);
      if (st.level) list = list.filter((a) => a.level === st.level);
      const html = list.map((a) => this._alertRow(a)).join('') || '<p class="muted">Không có cảnh báo phù hợp.</p>';
      view.querySelector('#alert-body').innerHTML = html;
    };
    view.innerHTML = `
      <h1>🔔 Cảnh báo</h1>
      <p class="muted">Quy tắc & ngưỡng đặt trong <code>js/config.js</code> — <b>[CHỜ BAN XÁC NHẬN]</b>.</p>
      <div class="toolbar">
        <select id="a-group">
          <option value="">— Tất cả nhóm —</option>
          ${GROUP_KEYS.map((g) => `<option value="${g}">${SCHEMA[g].label}</option>`).join('')}
        </select>
        <select id="a-level">
          <option value="">— Tất cả mức —</option>
          <option value="do">Đỏ (quá hạn / nghiêm trọng)</option>
          <option value="cam">Cam (sắp đến hạn / cần chú ý)</option>
        </select>
      </div>
      <div id="alert-body" class="alert-list"></div>`;
    view.querySelector('#a-group').value = st.group;
    view.querySelector('#a-level').value = st.level;
    view.querySelector('#a-group').addEventListener('change', (e) => { st.group = e.target.value; render(); });
    view.querySelector('#a-level').addEventListener('change', (e) => { st.level = e.target.value; render(); });
    render();
  },

  // ───────────────────────── Phiếu yêu cầu nghiệp vụ (các Ban điền) ─────────────────────────
  renderPhieu(view) {
    const F = PHIEU_FORM;
    const headerInputs = F.header.map((f) => `
      <label class="field">
        <span>${Util.esc(f.label)}${f.required ? ' <b class="req">*</b>' : ''}</span>
        <input data-k="${f.key}" type="text" ${f.required ? 'required' : ''}>
      </label>`).join('');
    const questionInputs = F.questions.map((q) => `
      <div class="field">
        <label><span>${Util.esc(q.title)}</span></label>
        <p class="hint"><b>Gợi ý:</b> ${Util.esc(q.hint)}</p>
        <textarea data-k="${q.key}" rows="3" placeholder="Nhập ý kiến của Ban/đơn vị…"></textarea>
      </div>`).join('');

    view.innerHTML = `
      <h1>📝 Phiếu xác định yêu cầu nghiệp vụ</h1>
      <p class="muted">Các Ban/đơn vị điền thông tin dưới đây; nội dung gửi sẽ được lưu vào Google Sheet (tab <code>PhieuYeuCau</code>).</p>
      <form id="phieu-form" class="phieu-form">
        <div class="phieu-head">${headerInputs}</div>
        ${questionInputs}
        <div id="phieu-msg"></div>
        <button type="submit" class="btn">Gửi phiếu</button>
      </form>
      <h2>Phiếu đã gửi</h2>
      <div id="phieu-list" class="muted">Đang tải…</div>`;

    const form = view.querySelector('#phieu-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const row = { id: 'PH-' + Date.now(), thoi_gian: this._now() };
      view.querySelectorAll('#phieu-form [data-k]').forEach((el) => { row[el.dataset.k] = el.value.trim(); });
      if (!row.don_vi) { this._phieuMsg('Vui lòng nhập Đơn vị.', 'bad'); return; }
      const btn = form.querySelector('button[type=submit]');
      btn.disabled = true; this._phieuMsg('Đang gửi…', '');
      try {
        await DataService.create('PhieuYeuCau', row);
        this._phieuMsg('✅ Đã gửi phiếu thành công. Cảm ơn Ban/đơn vị!', 'ok');
        form.reset();
        this._loadPhieuList();
      } catch (err) {
        this._phieuMsg('Không gửi được: ' + err.message + '. Có thể backend chưa cập nhật tab PhieuYeuCau (xem README).', 'bad');
      } finally { btn.disabled = false; }
    });
    this._loadPhieuList();
  },

  _now() {
    const d = new Date(); const p = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
  },

  _phieuMsg(text, cls) {
    const el = document.getElementById('phieu-msg');
    if (el) el.innerHTML = `<div class="form-msg ${cls}">${Util.esc(text)}</div>`;
  },

  async _loadPhieuList() {
    const box = document.getElementById('phieu-list');
    if (!box) return;
    try {
      const rows = await DataService.list('PhieuYeuCau');
      if (!rows.length) { box.innerHTML = '<p class="muted">Chưa có phiếu nào được gửi.</p>'; return; }
      const trs = rows.slice().reverse().map((r) => {
        const q1 = (r.q1_bai_toan || '');
        return `<tr>
          <td>${Util.esc(r.thoi_gian)}</td>
          <td>${Util.esc(r.don_vi)}</td>
          <td>${Util.esc(r.can_bo_dau_moi)}</td>
          <td>${Util.esc(q1.slice(0, 90))}${q1.length > 90 ? '…' : ''}</td>
        </tr>`;
      }).join('');
      box.innerHTML = `<div class="table-meta">Tổng <b>${rows.length}</b> phiếu.</div>
        <div class="table-scroll"><table>
        <thead><tr><th>Thời gian</th><th>Đơn vị</th><th>Cán bộ đầu mối</th><th>Bài toán (tóm tắt)</th></tr></thead>
        <tbody>${trs}</tbody></table></div>`;
    } catch (err) {
      box.innerHTML = `<p class="muted">Chưa đọc được danh sách phiếu (${Util.esc(err.message)}).
        Nếu vừa thêm tab, hãy cập nhật code Apps Script rồi <b>Deploy phiên bản mới</b> (xem README mục Phiếu yêu cầu).</p>`;
    }
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
