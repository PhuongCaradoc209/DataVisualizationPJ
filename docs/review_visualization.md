# Báo cáo Review Hệ thống Trực quan hóa Dữ liệu Netflix

## Tóm tắt Mục đích và Vai trò của từng Trang

| Trang | Vai trò chủ đạo | Thông tin cung cấp chính |
| :--- | :--- | :--- |
| **Dashboard** | **Tổng quan & Tra cứu** (Overview) | Cái nhìn toàn cảnh về số lượng, bộ lọc nhanh theo năm, xu hướng phát triển qua Timeline, cơ cấu Phim/Show và Bảng tra cứu dữ liệu gốc có tìm kiếm/phân trang. |
| **Analysis** | **Phân tích Hành vi** (Insights) | Đi sâu tìm hiểu logic kinh doanh thông qua Độ trễ thu mua bản quyền, Độ phủ sóng giới hạn độ tuổi (Maturity Focus), và xác định thời điểm "vàng" phát hành nội dung. |
| **Talent** | **Mạng lưới Nhân sự** (Stars Analytics) | Khai thác và trực quan hóa mức độ ảnh hưởng của Diễn viên (qua biểu đồ Bóng vật lý - Force Bubble) và năng suất của các Đạo diễn. |
| **Reports** | **Báo cáo Vĩ mô** (Strategic Assessment) | Cung cấp số liệu cứng để báo cáo chiến lược: Phạm vi sản xuất toàn cầu (Địa lý), Cấu trúc vật lý của sản phẩm (Thời lượng trung bình), phục vụ cho nhu cầu trích xuất (Export). |

---

Báo cáo chi tiết này phân tích các thành phần giao diện, biểu đồ và tính năng phân tích dữ liệu hiện có trên ba trang: **Dashboard**, **Analysis** và **Reports**.

---

## 1. Trang Tổng quan (Dashboard Page)
*Tệp nguồn: `src/pages/Dashboard/index.tsx`*

Trang này đóng vai trò cung cấp góc nhìn tổng thể về toàn bộ danh mục (catalog) của Netflix, cho phép lọc nhanh và duyệt dữ liệu.

### A. Bảng Điều khiển & Bộ Lọc (Filter Controls)
- **Content Type Filter:** Cho phép chuyển đổi nhanh giữa 3 chế độ: "All", "Movie", "TV Show".
- **Year Range Slider:** Thanh trượt chọn năm (từ năm đầu tiên có dữ liệu tới năm cuối) để giới hạn phạm vi thời gian phân tích.
- **Result Counter:** Hiển thị tức thời tổng số lượng kết quả khớp với điều kiện lọc.

### B. Các Chỉ số KPI Chủ chốt (KPI Cards)
- **Filtered Titles:** Tổng số tác phẩm sau khi lọc, phân rã chi tiết ra số lượng Movie và TV Show.
- **Distribution Ratio:** Thanh tiến trình hiển thị trực quan tỉ lệ phần trăm Movie vs TV Show.
- **Top Director:** Đạo diễn có số lượng tác phẩm nhiều nhất lịch sử kèm số lượng tiêu đề cụ thể.

### C. Biểu đồ Trực quan (Charts)
- **Genre Treemap (Top Genres):**
  - *Mô tả:* Dùng cấu trúc ô chữ nhật để biểu thị 15 thể loại (genres) phổ biến nhất trong tập dữ liệu đã lọc.
  - *Ý nghĩa:* Giúp nắm bắt nhanh độ phủ sóng của các dòng phim.
- **Volume Timeline Chart:**
  - *Mô tả:* Trục thời gian biểu thị sự biến động số lượng tác phẩm được nạp vào hệ thống qua các năm.
  - *Ý nghĩa:* Quan sát xu hướng tăng trưởng nội dung theo thời gian.

### D. Danh mục Chi tiết (Catalog Table)
- Bảng dữ liệu hiển thị các cột: `Title`, `Type`, `Year Added`, `Rating`, `Duration`.
- Tích hợp **Hộp tìm kiếm nhanh** (Search) hỗ trợ tìm theo Tên phim, Đạo diễn hoặc Thể loại.
- **Phân trang (Pagination):** Tự động chia trang với kích thước 15 dòng/trang để tối ưu hiệu năng hiển thị.

---

## 2. Trang Phân tích (Analysis Page)
*Tệp nguồn: `src/pages/Analysis/index.tsx`*

Trang này tập trung khai thác sâu các khía cạnh chiến lược nội dung và nhân khẩu học thông qua các bộ số liệu nâng cao.

### A. Bộ lọc Nâng cao (Advanced Filters)
- **Type Filter:** Dạng Dropdown lựa chọn loại nội dung.
- **Rating Filter:** Danh sách lựa chọn động được trích xuất trực tiếp từ tập dữ liệu (TV-MA, TV-14, PG-13, etc.).

### B. Chỉ số Vận hành (Main Analytics KPI)
- **Average Acquisition Lag:** Thời gian trễ trung bình (năm) tính từ khi phim phát hành cho tới khi xuất hiện trên hệ thống. Phản ánh tốc độ bắt kịp xu hướng/bản quyền.

### C. Biểu đồ Phân tích (Analytics Charts)
- **Acquisition Scatter Plot:**
  - *Trục X/Y:* Tương quan giữa `Release Year` và `Year Added`.
  - *Phân biệt màu:* Màu đỏ dành cho Movie và màu hổ phách cho TV Show.
  - *Mục tiêu:* Tìm ra mô thức thu mua bản quyền nội dung mới hay cũ qua các năm.
- **Maturity Rating Focus (Radar Chart):**
  - *Mô tả:* Biểu đồ mạng nhện phân bổ mật độ theo đối tượng khán giả (Rating).
  - *Mục tiêu:* Xác định độ tuổi khán giả mục tiêu mà Netflix đang nhắm tới.

### D. Thẻ Thống kê Bổ trợ (Metric Insights)
- **Top Origin (Khu vực hàng đầu):** Quốc gia/Vùng lãnh thổ có số lượng sản xuất nhiều nhất.
- **Peak Drop Month (Tháng cao điểm):** Tháng có tần suất cập nhật danh mục (nạp phim mới) lớn nhất trong năm.
- **Content Freshness (Độ tươi mới):** Tỉ lệ % phim được phát sóng trên Netflix cùng năm phát hành (Phim mới).

---

## 3. Tổng kết Dữ liệu đang sử dụng
Toàn bộ hệ thống đang xử lý trên tệp JSON tĩnh `netflix_dataset.json` với cấu trúc `NetflixData`:
- `show_id`, `type`, `title` (Dữ liệu định danh)
- `director`, `cast` (Nhân sự)
- `country` (Địa lý)
- `release_year`, `year_added`, `month_added` (Thời gian)
- `rating`, `duration`, `listed_in` (Phân loại & Thuộc tính)

---

## 4. Đề xuất & Lộ trình Nâng cấp Trang Reports
Hiện trạng trang Reports đang ở dạng placeholder danh sách tĩnh. Để hoàn thiện sản phẩm, cần tích hợp các khía cạnh phân tích vĩ mô sau:

### A. Phân tích Địa lý (Geographic Breakdown)
- **Country Bar Chart:** Xếp hạng Top 10 quốc gia đóng góp nội dung lớn nhất. Cho phép nhìn nhận cán cân sản xuất toàn cầu.
- **Regional Growth:** Tương quan giữa thị trường Mỹ (gốc) và nhóm thị trường còn lại (ROW) để xem xét chiến lược toàn cầu hóa.

### B. Phân tích Quy mô & Thời lượng (Distribution & Scale)
- **Duration Histogram:** Phân bổ thời gian phát sóng (phút) đối với Movie. Tìm ra điểm rơi lý tưởng về độ dài một tác phẩm thương mại.
- **Seasons Count:** Biểu đồ số lượng mùa phim (Seasons) trên mỗi TV Show, phân tích khả năng kéo dài hoặc bị "khai tử" của các series.

### C. Phân tích Nhân sự & Liên kết (Talent Analytics)
- **Star Power:** Danh sách diễn viên (cast) xuất hiện dày đặc nhất.
- **Collaborations:** Đưa ra những cặp đôi đạo diễn - diễn viên bảo chứng phòng vé của nền tảng.

### D. Chức năng Xuất bản (Export Utility)
- Bổ sung nút bấm "Export to PDF" hoặc "Download Data" cho phép chuyển đổi những thông số phân tích này thành tệp báo cáo offline phục vụ thuyết trình.
