/**
 * sampleData.js — Dữ liệu MẪU (minh họa) cho giai đoạn thử nghiệm.
 *
 * ⚠️ Đây KHÔNG phải dữ liệu thật. Theo SPEC mục 5, mỗi bản ghi có cột `nguon_du_lieu`
 * ghi rõ là "Dữ liệu mẫu (nguồn: …)". Khi có dữ liệu thật, thay giá trị này thành
 * "Dữ liệu thật" và ghi đơn vị cung cấp.
 *
 * Mốc thời gian được đặt quanh ngày 08/09/2026 để các quy tắc cảnh báo
 * (quá hạn / sắp đến hạn) có ví dụ trực quan.
 *
 * Cùng cấu trúc này được Apps Script setupSheets() dùng để nạp vào Google Sheet.
 */
const MAU = 'Dữ liệu mẫu (nguồn: SPEC minh họa)';

const SAMPLE_DATA = {
  NghiQuyet: [
    { ma_nq: 'NQ-2026-01', ten_nq: 'Nghị quyết phát triển kinh tế - xã hội năm 2026', linh_vuc: 'Kinh tế', ngay_ban_hanh: '2026-01-10', co_quan_thuc_hien: 'UBND tỉnh', nhiem_vu: 'Tăng trưởng GRDP 8%', chi_tieu: '8%', thoi_han: '2026-12-31', trang_thai: 'Đang thực hiện', ket_qua: 'Ước đạt 6,2% giữa kỳ', ghi_chu: '', nguon_du_lieu: MAU },
    { ma_nq: 'NQ-2026-02', ten_nq: 'Nghị quyết đầu tư hạ tầng giao thông', linh_vuc: 'Giao thông', ngay_ban_hanh: '2026-02-15', co_quan_thuc_hien: 'Sở GTVT', nhiem_vu: 'Hoàn thành 3 tuyến đường liên xã', chi_tieu: '3 tuyến', thoi_han: '2026-06-30', trang_thai: 'Đang thực hiện', ket_qua: 'Mới xong 1 tuyến', ghi_chu: 'Chậm do giải phóng mặt bằng', nguon_du_lieu: MAU },
    { ma_nq: 'NQ-2026-03', ten_nq: 'Nghị quyết về giáo dục phổ thông', linh_vuc: 'Giáo dục', ngay_ban_hanh: '2026-03-05', co_quan_thuc_hien: 'Sở GD&ĐT', nhiem_vu: 'Kiên cố hóa 20 trường học', chi_tieu: '20 trường', thoi_han: '2026-09-25', trang_thai: 'Đang thực hiện', ket_qua: 'Đạt 15/20 trường', ghi_chu: '', nguon_du_lieu: MAU },
    { ma_nq: 'NQ-2026-04', ten_nq: 'Nghị quyết chuyển đổi số', linh_vuc: 'Công nghệ', ngay_ban_hanh: '2026-01-20', co_quan_thuc_hien: 'Sở TT&TT', nhiem_vu: 'Triển khai dịch vụ công trực tuyến mức 4', chi_tieu: '100% thủ tục', thoi_han: '2026-08-31', trang_thai: 'Đã thực hiện', ket_qua: 'Hoàn thành 100%', ghi_chu: '', nguon_du_lieu: MAU },
    { ma_nq: 'NQ-2026-05', ten_nq: 'Nghị quyết về y tế cơ sở', linh_vuc: 'Y tế', ngay_ban_hanh: '2026-04-02', co_quan_thuc_hien: 'Sở Y tế', nhiem_vu: 'Nâng cấp 10 trạm y tế xã', chi_tieu: '10 trạm', thoi_han: '2026-11-30', trang_thai: 'Chưa thực hiện', ket_qua: '', ghi_chu: 'Chờ bố trí vốn', nguon_du_lieu: MAU },
  ],

  GiamSat: [
    { ma_gs: 'GS-2026-01', ten_gs: 'Giám sát quản lý đất đai tại huyện A', linh_vuc: 'Đất đai', don_vi_chiu_gs: 'UBND huyện A', thoi_gian: '2026-03-01', ket_luan: 'Còn tồn tại trong cấp GCN quyền sử dụng đất', kien_nghi: 'Rà soát, xử lý hồ sơ tồn đọng trước 30/06', trang_thai_thuc_hien_kn: 'Đang thực hiện', thoi_han: '2026-06-30', ghi_chu: 'Quá hạn, chưa báo cáo', nguon_du_lieu: MAU },
    { ma_gs: 'GS-2026-02', ten_gs: 'Giám sát đầu tư công lĩnh vực giao thông', linh_vuc: 'Giao thông', don_vi_chiu_gs: 'Sở GTVT', thoi_gian: '2026-05-10', ket_luan: 'Giải ngân chậm so với kế hoạch', kien_nghi: 'Đẩy nhanh giải ngân trong quý III', trang_thai_thuc_hien_kn: 'Đang thực hiện', thoi_han: '2026-09-30', ghi_chu: '', nguon_du_lieu: MAU },
    { ma_gs: 'GS-2026-03', ten_gs: 'Giám sát chính sách hỗ trợ hộ nghèo', linh_vuc: 'An sinh xã hội', don_vi_chiu_gs: 'Sở LĐ-TB&XH', thoi_gian: '2026-02-20', ket_luan: 'Thực hiện đúng đối tượng', kien_nghi: 'Tiếp tục rà soát định kỳ', trang_thai_thuc_hien_kn: 'Đã thực hiện', thoi_han: '2026-04-30', ghi_chu: '', nguon_du_lieu: MAU },
    { ma_gs: 'GS-2026-04', ten_gs: 'Giám sát thu chi ngân sách cấp xã', linh_vuc: 'Tài chính', don_vi_chiu_gs: 'UBND các xã', thoi_gian: '2026-06-15', ket_luan: 'Một số xã chi vượt dự toán', kien_nghi: 'Chấn chỉnh công tác lập dự toán', trang_thai_thuc_hien_kn: 'Chưa thực hiện', thoi_han: '2026-09-15', ghi_chu: '', nguon_du_lieu: MAU },
  ],

  KienNghiCuTri: [
    { ma_kn: 'KN-2026-001', noi_dung: 'Đề nghị sửa chữa đường liên thôn xuống cấp', nhom_linh_vuc: 'Giao thông', don_vi_giai_quyet: 'Sở GTVT', ngay_tiep_nhan: '2026-05-05', thoi_han_giai_quyet: '2026-07-05', trang_thai: 'Đang giải quyết', ket_qua: '', ghi_chu: 'Quá hạn', nguon_du_lieu: MAU },
    { ma_kn: 'KN-2026-002', noi_dung: 'Kiến nghị tăng số lượng bác sĩ tuyến xã', nhom_linh_vuc: 'Y tế', don_vi_giai_quyet: 'Sở Y tế', ngay_tiep_nhan: '2026-06-01', thoi_han_giai_quyet: '2026-09-20', trang_thai: 'Đang giải quyết', ket_qua: '', ghi_chu: '', nguon_du_lieu: MAU },
    { ma_kn: 'KN-2026-003', noi_dung: 'Phản ánh ô nhiễm kênh mương khu dân cư', nhom_linh_vuc: 'Môi trường', don_vi_giai_quyet: 'Sở TN&MT', ngay_tiep_nhan: '2026-04-10', thoi_han_giai_quyet: '2026-06-10', trang_thai: 'Đã giải quyết', ket_qua: 'Đã nạo vét, khắc phục', ghi_chu: '', nguon_du_lieu: MAU },
    { ma_kn: 'KN-2026-004', noi_dung: 'Đề nghị lắp đặt hệ thống chiếu sáng công cộng', nhom_linh_vuc: 'Hạ tầng', don_vi_giai_quyet: 'UBND huyện A', ngay_tiep_nhan: '2026-07-15', thoi_han_giai_quyet: '2026-10-15', trang_thai: 'Chưa giải quyết', ket_qua: '', ghi_chu: '', nguon_du_lieu: MAU },
    { ma_kn: 'KN-2026-005', noi_dung: 'Kiến nghị về giá đền bù giải phóng mặt bằng', nhom_linh_vuc: 'Đất đai', don_vi_giai_quyet: 'Sở TN&MT', ngay_tiep_nhan: '2026-03-20', thoi_han_giai_quyet: '2026-05-20', trang_thai: 'Đã giải quyết', ket_qua: 'Đã trả lời cử tri', ghi_chu: '', nguon_du_lieu: MAU },
  ],

  NganSach: [
    { ma_chi_tieu: 'NS-GD', ten_chi_tieu: 'Chi sự nghiệp giáo dục', linh_vuc: 'Giáo dục', don_vi: 'Sở GD&ĐT', du_toan: 1200000, thuc_hien: 780000, ty_le: 65, ky_bao_cao: '6 tháng đầu 2026', ghi_chu: '', nguon_du_lieu: MAU },
    { ma_chi_tieu: 'NS-YT', ten_chi_tieu: 'Chi sự nghiệp y tế', linh_vuc: 'Y tế', don_vi: 'Sở Y tế', du_toan: 900000, thuc_hien: 360000, ty_le: 40, ky_bao_cao: '6 tháng đầu 2026', ghi_chu: 'Giải ngân chậm', nguon_du_lieu: MAU },
    { ma_chi_tieu: 'NS-GT', ten_chi_tieu: 'Chi đầu tư giao thông', linh_vuc: 'Giao thông', don_vi: 'Sở GTVT', du_toan: 2500000, thuc_hien: 1000000, ty_le: 40, ky_bao_cao: '6 tháng đầu 2026', ghi_chu: '', nguon_du_lieu: MAU },
    { ma_chi_tieu: 'NS-AS', ten_chi_tieu: 'Chi bảo đảm an sinh xã hội', linh_vuc: 'An sinh xã hội', don_vi: 'Sở LĐ-TB&XH', du_toan: 700000, thuc_hien: 525000, ty_le: 75, ky_bao_cao: '6 tháng đầu 2026', ghi_chu: '', nguon_du_lieu: MAU },
    { ma_chi_tieu: 'NS-QLNN', ten_chi_tieu: 'Chi quản lý nhà nước', linh_vuc: 'Quản lý NN', don_vi: 'Văn phòng UBND', du_toan: 600000, thuc_hien: 300000, ty_le: 50, ky_bao_cao: '6 tháng đầu 2026', ghi_chu: '', nguon_du_lieu: MAU },
  ],

  DauTuCong: [
    { ma_du_an: 'DA-2026-01', ten_du_an: 'Xây dựng cầu vượt sông Trà', chu_dau_tu: 'Ban QLDA tỉnh', tong_muc_dau_tu: 350000, da_giai_ngan: 70000, ty_le_giai_ngan: 20, tien_do: 'Chậm', thoi_han: '2027-12-31', trang_thai: 'Đang thi công', ghi_chu: 'Vướng mặt bằng', nguon_du_lieu: MAU },
    { ma_du_an: 'DA-2026-02', ten_du_an: 'Nâng cấp bệnh viện đa khoa tỉnh', chu_dau_tu: 'Sở Y tế', tong_muc_dau_tu: 500000, da_giai_ngan: 400000, ty_le_giai_ngan: 80, tien_do: 'Đúng tiến độ', thoi_han: '2026-12-31', trang_thai: 'Đang thi công', ghi_chu: '', nguon_du_lieu: MAU },
    { ma_du_an: 'DA-2026-03', ten_du_an: 'Trường THPT chuyên tỉnh', chu_dau_tu: 'Sở GD&ĐT', tong_muc_dau_tu: 280000, da_giai_ngan: 266000, ty_le_giai_ngan: 95, tien_do: 'Đúng tiến độ', thoi_han: '2026-10-31', trang_thai: 'Sắp hoàn thành', ghi_chu: '', nguon_du_lieu: MAU },
    { ma_du_an: 'DA-2026-04', ten_du_an: 'Hệ thống thủy lợi vùng cao', chu_dau_tu: 'Sở NN&PTNT', tong_muc_dau_tu: 420000, da_giai_ngan: 126000, ty_le_giai_ngan: 30, tien_do: 'Chậm', thoi_han: '2027-06-30', trang_thai: 'Đang thi công', ghi_chu: '', nguon_du_lieu: MAU },
    { ma_du_an: 'DA-2026-05', ten_du_an: 'Khu tái định cư số 3', chu_dau_tu: 'Ban QLDA tỉnh', tong_muc_dau_tu: 150000, da_giai_ngan: 150000, ty_le_giai_ngan: 100, tien_do: 'Hoàn thành', thoi_han: '2026-05-31', trang_thai: 'Đã hoàn thành', ghi_chu: '', nguon_du_lieu: MAU },
  ],
};

// Danh mục dùng chung (SPEC 3.6). Suy ra một phần từ dữ liệu mẫu ở trên.
const SAMPLE_CATALOGS = {
  DM_DonVi: [
    'UBND tỉnh', 'Văn phòng UBND', 'Sở GTVT', 'Sở GD&ĐT', 'Sở Y tế',
    'Sở TT&TT', 'Sở TN&MT', 'Sở LĐ-TB&XH', 'Sở NN&PTNT', 'Ban QLDA tỉnh',
    'UBND huyện A', 'UBND các xã',
  ],
  DM_LinhVuc: [
    'Kinh tế', 'Giao thông', 'Giáo dục', 'Y tế', 'Công nghệ', 'Đất đai',
    'An sinh xã hội', 'Tài chính', 'Môi trường', 'Hạ tầng', 'Quản lý NN',
  ],
  DM_TrangThai: [
    'Chưa thực hiện', 'Đang thực hiện', 'Đã thực hiện',
    'Chưa giải quyết', 'Đang giải quyết', 'Đã giải quyết',
    'Chậm', 'Đúng tiến độ', 'Hoàn thành',
  ],
};

if (typeof module !== 'undefined') module.exports = { SAMPLE_DATA, SAMPLE_CATALOGS };
