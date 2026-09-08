/**
 * charts.js — Biểu đồ SVG thuần (không phụ thuộc thư viện ngoài → chạy được offline nội bộ).
 * Cung cấp: biểu đồ cột (bar) và biểu đồ tròn (donut).
 */
const Charts = {
  PALETTE: ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#7c3aed', '#0891b2', '#db2777', '#65a30d'],

  /**
   * Biểu đồ cột ngang. data = [{label, value}], maxLabel: hiển thị % nếu isPercent.
   */
  bar(data, { isPercent = false, unit = '' } = {}) {
    if (!data.length) return '<p class="muted">Không có dữ liệu.</p>';
    const max = Math.max(...data.map((d) => Number(d.value) || 0), isPercent ? 100 : 1);
    const rows = data.map((d, i) => {
      const v = Number(d.value) || 0;
      const w = Math.max(0, (v / max) * 100);
      const color = this.PALETTE[i % this.PALETTE.length];
      const valLabel = isPercent ? `${v}%` : `${Util.formatMoney(v)}${unit ? ' ' + unit : ''}`;
      return `
        <div class="bar-row">
          <div class="bar-label" title="${Util.esc(d.label)}">${Util.esc(d.label)}</div>
          <div class="bar-track"><div class="bar-fill" style="width:${w}%;background:${color}"></div></div>
          <div class="bar-value">${valLabel}</div>
        </div>`;
    }).join('');
    return `<div class="bar-chart">${rows}</div>`;
  },

  /**
   * Biểu đồ tròn (donut). data = [{label, value}]. Trả SVG + chú giải.
   */
  donut(data, { unit = '' } = {}) {
    const total = data.reduce((s, d) => s + (Number(d.value) || 0), 0);
    if (!total) return '<p class="muted">Không có dữ liệu.</p>';
    const cx = 90, cy = 90, r = 70, C = 2 * Math.PI * r;
    let offset = 0;
    const segs = data.map((d, i) => {
      const v = Number(d.value) || 0;
      const frac = v / total;
      const color = this.PALETTE[i % this.PALETTE.length];
      const dash = `${(frac * C).toFixed(2)} ${(C - frac * C).toFixed(2)}`;
      const seg = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}"
        stroke-width="28" stroke-dasharray="${dash}"
        stroke-dashoffset="${(-offset * C).toFixed(2)}" transform="rotate(-90 ${cx} ${cy})"></circle>`;
      offset += frac;
      return seg;
    }).join('');
    const legend = data.map((d, i) => {
      const v = Number(d.value) || 0;
      const pct = Math.round((v / total) * 100);
      const color = this.PALETTE[i % this.PALETTE.length];
      return `<div class="legend-item"><span class="legend-dot" style="background:${color}"></span>
        ${Util.esc(d.label)} — <strong>${Util.formatMoney(v)}${unit ? ' ' + unit : ''}</strong> (${pct}%)</div>`;
    }).join('');
    return `<div class="donut-wrap">
      <svg viewBox="0 0 180 180" width="180" height="180" role="img">${segs}
        <text x="90" y="90" text-anchor="middle" dominant-baseline="middle" class="donut-total">${data.length} mục</text>
      </svg>
      <div class="legend">${legend}</div>
    </div>`;
  },
};

if (typeof module !== 'undefined') module.exports = { Charts };
