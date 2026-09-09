/**
 * phieuSchema.js — Định nghĩa "Phiếu xác định yêu cầu nghiệp vụ" để các Ban điền online.
 * Số hóa đúng theo Phiếu kèm Công văn: phần đầu + 6 câu hỏi nghiệp vụ (kèm gợi ý trả lời).
 * Câu trả lời lưu vào tab Google Sheet `PhieuYeuCau` (cột khớp SCHEMA trong apps-script/Code.gs).
 */
const PHIEU_FORM = {
  sheet: 'PhieuYeuCau',

  // Phần đầu phiếu
  header: [
    { key: 'don_vi', label: 'Đơn vị', required: true },
    { key: 'can_bo_dau_moi', label: 'Cán bộ đầu mối chính' },
    { key: 'can_bo_phoi_hop', label: 'Cán bộ phối hợp' },
  ],

  // 6 câu hỏi nghiệp vụ (STT 1–6 trong phiếu), kèm "Gợi ý trả lời"
  questions: [
    {
      key: 'q1_bai_toan',
      title: '1. Bài toán nghiệp vụ cần giải quyết',
      hint: 'Trong thẩm tra, giám sát, theo dõi thực hiện nghị quyết / kiến nghị cử tri hoặc khai thác thông tin phục vụ hoạt động của Ban đang có khó khăn gì; nội dung nào mất nhiều thời gian tổng hợp, theo dõi hoặc phải tra cứu từ nhiều nguồn.',
    },
    {
      key: 'q2_ho_so',
      title: '2. Hồ sơ / dữ liệu đề nghị đưa vào thử nghiệm',
      hint: 'Nghị quyết, cuộc giám sát, nhóm kiến nghị, chỉ tiêu ngân sách, dự án đầu tư công… cụ thể nào đề nghị lựa chọn đưa vào thử nghiệm.',
    },
    {
      key: 'q3_thong_tin',
      title: '3. Thông tin cần nhìn thấy khi khai thác',
      hint: 'Khi tra cứu, Ban cần thấy những trường thông tin nào (mã, tên/trích yếu, lĩnh vực, đơn vị thực hiện, thời hạn, trạng thái, kết quả…).',
    },
    {
      key: 'q4_canh_bao',
      title: '4. Nội dung cần theo dõi / cảnh báo',
      hint: 'Cần theo dõi và cảnh báo những gì (nhiệm vụ chậm/quá hạn, kiến nghị quá hạn giải quyết, ngân sách biến động, dự án giải ngân thấp/chậm tiến độ…); ngưỡng cảnh báo mong muốn.',
    },
    {
      key: 'q5_san_pham',
      title: '5. Sản phẩm mong muốn',
      hint: 'Đầu ra mong muốn: tra cứu, danh sách tổng hợp, báo cáo, biểu đồ, bảng điều hành, cảnh báo… và định dạng cụ thể (Excel/PDF/biểu đồ…).',
    },
    {
      key: 'q6_nguon',
      title: '6. Nguồn hồ sơ / dữ liệu hiện có',
      hint: 'Dữ liệu đang được quản lý / lưu ở đâu, đơn vị nào giữ, ở dạng gì (bản giấy, Excel, phần mềm chuyên ngành…).',
    },
  ],
};

if (typeof module !== 'undefined') module.exports = { PHIEU_FORM };
