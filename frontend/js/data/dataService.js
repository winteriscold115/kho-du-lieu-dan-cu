/**
 * dataService.js — Lớp truy cập dữ liệu (data-access layer).
 *
 * Đây là điểm mấu chốt để "đổi lưu trữ mà giữ nguyên frontend" (SPEC mục 2 & 6):
 * toàn bộ giao diện chỉ gọi qua đối tượng `DataService` với các phương thức thống nhất.
 * Bên dưới có 2 cài đặt:
 *   - MockService        (sampleData nhúng sẵn)
 *   - AppsScriptService  (gọi Google Apps Script Web App)
 * Muốn thay bằng CSDL khác sau này: chỉ cần viết một cài đặt mới cùng "hợp đồng" dưới đây.
 *
 * HỢP ĐỒNG (tất cả trả về Promise):
 *   list(group)            → Promise<Array<row>>            // đọc toàn bộ bản ghi một nhóm
 *   getCatalogs()          → Promise<{DM_DonVi, DM_LinhVuc, DM_TrangThai}>
 *   create(group, row)     → Promise<row>                   // (tùy chọn) thêm bản ghi
 *   update(group, id, row) → Promise<row>                   // (tùy chọn) sửa bản ghi
 */

// Factory: chọn cài đặt theo CONFIG.USE_MOCK
function createDataService() {
  if (CONFIG.USE_MOCK || !CONFIG.APPS_SCRIPT_URL) {
    return new MockService();
  }
  return new AppsScriptService(CONFIG.APPS_SCRIPT_URL);
}

// Khởi tạo một thể hiện dùng chung cho toàn app
const DataService = createDataService();
