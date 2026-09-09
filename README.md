# Kho dữ liệu dân cử dùng chung — Giai đoạn 1 (bản thử nghiệm)

Web app nội bộ giúp các Ban HĐND và Văn phòng **tra cứu – tổng hợp – theo dõi – cảnh báo**
trên 05 nhóm dữ liệu: **Nghị quyết, Giám sát, Kiến nghị cử tri, Thu–chi ngân sách, Đầu tư công**.

Khung ứng dụng này dựng theo `SPEC.md`. Lưu trữ dùng **Google Sheet**; lớp truy cập dữ liệu
được tách riêng để sau này đổi sang CSDL khác mà **không phải sửa frontend**.

> ⚠️ Dữ liệu kèm theo là **DỮ LIỆU MẪU** (mỗi bản ghi có cột `nguon_du_lieu`). Không đưa
> dữ liệu cá nhân/nhạy cảm thật vào giai đoạn thử nghiệm.

---

## 1. Chạy thử ngay (không cần Google Sheet)

App mặc định chạy bằng dữ liệu mẫu nhúng sẵn (`USE_MOCK = true`).

- **Cách nhanh nhất:** mở thẳng `frontend/index.html` bằng trình duyệt.
- **Nên dùng (tránh hạn chế khi mở file trực tiếp):** chạy một web server tĩnh trong thư mục `frontend/`:

```bash
cd frontend
python -m http.server 5173
```

Rồi mở http://localhost:5173

Bạn sẽ thấy đầy đủ: Bảng điều hành, 5 nhóm dữ liệu (tra cứu/lọc/xuất CSV), Báo cáo & biểu đồ, Cảnh báo.

---

## 2. Nối Google Sheet (qua Google Apps Script Web App)

### Bước 1 — Tạo Sheet + dán code
1. Tạo một **Google Sheet** mới (đây sẽ là "CSDL").
2. Menu **Tiện ích mở rộng → Apps Script** (Extensions → Apps Script).
3. Xóa nội dung mặc định, dán toàn bộ `apps-script/Code.gs`.
4. (Tùy chọn) Trong trình soạn Apps Script, mở phần cài đặt dự án và dán nội dung
   `apps-script/appsscript.json` vào manifest (bật "Hiển thị tệp appsscript.json" trong Cài đặt).

### Bước 2 — Tạo tab + nạp dữ liệu mẫu
- Trong Apps Script, chọn hàm **`setupSheets`** rồi bấm **Run**.
- Lần đầu sẽ hỏi cấp quyền → cho phép (script chỉ thao tác trên Sheet đang gắn).
- Quay lại Sheet: sẽ có các tab `NghiQuyet`, `GiamSat`, `KienNghiCuTri`, `NganSach`,
  `DauTuCong` và `DM_DonVi`, `DM_LinhVuc`, `DM_TrangThai`, đã có dữ liệu mẫu.

### Bước 3 — Deploy Web App
1. **Deploy → New deployment → chọn loại "Web app"**.
2. **Execute as:** *Me* (chính bạn).
3. **Who has access:** chọn phù hợp nội bộ (ví dụ *Anyone within <tổ chức>* nếu dùng Google Workspace;
   hoặc *Anyone* nếu cần truy cập ẩn danh trong thử nghiệm).
4. Bấm **Deploy**, sao chép **Web app URL** (dạng `https://script.google.com/.../exec`).

> Kiểm tra nhanh: mở URL đó trên trình duyệt, phải thấy JSON `{"ok":true,...}`.

### Bước 4 — Trỏ frontend sang Sheet
Sửa `frontend/js/config.js`:
```js
USE_MOCK: false,
APPS_SCRIPT_URL: 'https://script.google.com/.../exec',   // URL vừa copy
```
Tải lại app — nhãn nguồn dữ liệu trên đầu trang sẽ chuyển sang **"Đang nối Google Sheet"**.

> **ID Sheet đặt ở đâu?** Khi script gắn trực tiếp với Sheet (cách trên) thì **không cần** điền ID.
> Nếu tách script riêng (standalone), điền `SHEET_ID` ở đầu `Code.gs` và đổi OAuth scope trong
> `appsscript.json` từ `spreadsheets.currentonly` sang `spreadsheets`.

---

## 3. Cấu trúc mã nguồn

```
kho-du-lieu-dan-cu/
├── README.md
├── frontend/
│   ├── index.html               # Trang chính, nạp các script theo thứ tự
│   ├── css/styles.css
│   └── js/
│       ├── config.js            # ⚙️ USE_MOCK, APPS_SCRIPT_URL, ngưỡng cảnh báo
│       ├── util.js              # Định dạng ngày/tiền/%, khử dấu, xuất CSV
│       ├── alerts.js            # Quy tắc cảnh báo (SPEC 4.5)
│       ├── charts.js            # Biểu đồ SVG thuần (không cần CDN)
│       ├── app.js               # Router + dựng các màn hình
│       └── data/
│           ├── schema.js        # Định nghĩa cột 5 nhóm (nguồn sự thật)
│           ├── sampleData.js    # Dữ liệu mẫu
│           ├── dataService.js   # Factory + "hợp đồng" lớp dữ liệu
│           ├── mockService.js   # Cài đặt: dữ liệu mẫu
│           └── appsScriptService.js  # Cài đặt: gọi Apps Script Web App
└── apps-script/
    ├── Code.gs                  # Backend API JSON + setupSheets()
    └── appsscript.json          # Manifest (timezone, scope, cấu hình web app)
```

### Đổi lưu trữ sau này
Chỉ cần viết một lớp mới tuân theo "hợp đồng" trong `dataService.js`
(`list`, `getCatalogs`, `create`, `update`) rồi trỏ factory sang lớp đó. Frontend giữ nguyên.

---

## 4. Chức năng (map theo mục 5 của Phiếu / SPEC mục 4)

| Chức năng | Mô tả |
|---|---|
| Tra cứu / tìm kiếm | Từ khóa (không phân biệt dấu) + lọc theo lĩnh vực/đơn vị/trạng thái |
| Danh sách tổng hợp | Bảng có phân trang, sắp xếp theo cột, **xuất CSV** (Excel đọc được) |
| Báo cáo & biểu đồ | Cơ cấu trạng thái NQ & kiến nghị; tỷ lệ thực hiện ngân sách; tỷ lệ giải ngân đầu tư công |
| Bảng điều hành | Tổng quan 5 nhóm: số bản ghi, tỷ lệ hoàn thành, số cảnh báo |
| Cảnh báo | Quá hạn / sắp đến hạn / giải ngân thấp / thực hiện ngân sách thấp |

---

## 4b. Phiếu yêu cầu nghiệp vụ (các Ban điền online)

Trang **📝 Phiếu yêu cầu** số hóa Phiếu xác định yêu cầu nghiệp vụ: phần đầu (Đơn vị, Cán bộ
đầu mối, Cán bộ phối hợp) + 6 câu hỏi nghiệp vụ kèm gợi ý. Bấm **Gửi phiếu** → lưu vào tab
Google Sheet `PhieuYeuCau`; phía dưới hiển thị danh sách phiếu đã gửi.

> Chức năng **ghi** cần backend biết tab mới. Sau khi cập nhật `Code.gs`, phải **Deploy phiên bản mới**
> thì Web App mới nhận `PhieuYeuCau` (URL giữ nguyên).

**Bật tính năng này trên Sheet của bạn:**
1. Mở Apps Script → dán lại **toàn bộ** `apps-script/Code.gs` mới → **Lưu**.
2. Chọn hàm **`themTabPhieu`** → **Run** (tạo tab `PhieuYeuCau`; không đụng dữ liệu khác).
3. **Deploy → Manage deployments →** bấm ✏️ (Edit) ở deployment đang chạy → **Version: New version** → **Deploy**.
   *(Giữ nguyên URL `.../exec` — không cần sửa lại `config.js`.)*
4. Xong: mở trang **Phiếu yêu cầu**, điền thử và **Gửi** — kiểm tra dòng mới xuất hiện trong tab `PhieuYeuCau`.

## 5. Ngưỡng cảnh báo — **[CHỜ BAN XÁC NHẬN]**

Đặt trong `frontend/js/config.js → CONFIG.ALERT`. Mặc định (cần từng Ban chốt lại):

- Sắp đến hạn: còn **≤ 30 ngày**.
- Ngân sách: tỷ lệ thực hiện **< 50%** → cảnh báo.
- Đầu tư công: tỷ lệ giải ngân **< 60%** hoặc tiến độ **"Chậm"** → cảnh báo.

`CONFIG.NGAY_THAM_CHIEU` đang đặt `2026-09-08` để demo khớp mốc dữ liệu mẫu; để trống sẽ dùng ngày hệ thống.

---

## 6. Phần các Ban cần bổ sung trước khi dựng "thật" (SPEC mục 7)

- Danh sách NQ / cuộc giám sát / nhóm kiến nghị / chỉ tiêu ngân sách / dự án cụ thể đưa vào.
- Các trường bắt buộc phải nhìn thấy của từng Ban (bổ sung vào `schema.js` + header `Code.gs`).
- Ngưỡng cảnh báo cụ thể (`config.js`).
- Định dạng báo cáo/biểu đồ đầu ra mong muốn.
- Nguồn dữ liệu thật đang do đơn vị nào quản lý (điền vào cột `nguon_du_lieu`).

Mọi chỗ chờ chốt đều gắn nhãn `[CHỜ BAN XÁC NHẬN]` trong mã nguồn/tài liệu.
