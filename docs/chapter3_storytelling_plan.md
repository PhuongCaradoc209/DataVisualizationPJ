# CHAPTER 3 STORYTELLING PLAN AND VISUALIZATION REVIEW

This document provides a comprehensive review of the existing data visualization infrastructure and establishes an actionable roadmap for writing **CHAPTER 3. STORYTELLING** based on empirical evidence extracted from the Netflix dataset.

---

# 1. Code Review Summary

### A. Data Processing Logic Review
- **Dataset Loading:** The raw data is hosted at [netflix_dataset.json](file:///d:/Desktop/UNIVER/CURRENTLY/Data/Project/DataVisualizationPJ/src/data/netflix_dataset.json) and loaded directly in various pages using ES6 import (`import rawData from "../../data/netflix_dataset.json";`).
- **Data Types & Cleanup:** The dataset includes pre-computed numerical attributes for `year_added` and `month_added`, eliminating temporal parsing overhead during runtime.
- **Multi-valued Columns:** Complex, array-like columns (such as `country`, `listed_in`, `cast`) are optimally parsed as native JavaScript arrays. Multi-valued values are correctly flattened on the fly in charts via modern ES2019 `.flatMap()` and filtered of placeholder values like `'Not Specified'`.
- **Filtering & React State:** The pages utilize React's native `useState` combined with `useMemo` to deliver high-performance client-side slicing and dicing. Filter mutations correctly propagate downward as props to the visualization layer.

### B. Visualization Infrastructure
- All interactive visualizations are custom-crafted with **D3.js (v7)** directly coupled to React `useEffect` hooks.
- The components are highly responsive, utilizing standard `wrapperRef.current.clientWidth` boundaries to recalculate viewport ratios dynamically.
- Continuous, clean visual aesthetics are implemented via consistent Netflix Brand Crimson (`#e60a15`) styling across the visual suite.
- **Tooltip & UX:** Integrated mouse tracking tooltips styled identically offer deep inspectability for discrete data nodes without polluting the dashboard real estate.

---

# 2. Existing Charts Inventory

| Chart Component | File Path | Main Variables | Core Analytical Question | Suitability for Ch. 3 | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **VolumeTimeline** | [VolumeTimeline.tsx](file:///d:/Desktop/UNIVER/CURRENTLY/Data/Project/DataVisualizationPJ/src/components/charts/VolumeTimeline.tsx) | `year_added` | How has the absolute volume of content ingestion accelerated over time? | **Perfect** for §3.1 | Complete |
| **GenreTreemap** | [GenreTreemap.tsx](file:///d:/Desktop/UNIVER/CURRENTLY/Data/Project/DataVisualizationPJ/src/components/charts/GenreTreemap.tsx) | `listed_in` | Which content genres compose the primary anchor segments of Netflix? | **Perfect** for §3.3 | Complete |
| **AcquisitionScatter**| [AcquisitionScatter.tsx](file:///d:/Desktop/UNIVER/CURRENTLY/Data/Project/DataVisualizationPJ/src/components/charts/AcquisitionScatter.tsx) | `release_year`, `year_added`, `type` | Is Netflix moving toward immediate licensing of new content or capturing long-tail back-catalogs? | **Perfect** for §3.5 | Complete |
| **RatingRadar** | [RatingRadar.tsx](file:///d:/Desktop/UNIVER/CURRENTLY/Data/Project/DataVisualizationPJ/src/components/charts/RatingRadar.tsx) | `rating` | What demographic/maturity brackets define the core target audience? | **Perfect** for §3.6 | Complete |
| **CountryBarChart** | [CountryBarChart.tsx](file:///d:/Desktop/UNIVER/CURRENTLY/Data/Project/DataVisualizationPJ/src/components/charts/CountryBarChart.tsx) | `country` | Which geographic hubs account for the largest production volume? | **Perfect** for §3.4 | Complete |
| **DurationChart** | [DurationChart.tsx](file:///d:/Desktop/UNIVER/CURRENTLY/Data/Project/DataVisualizationPJ/src/components/charts/DurationChart.tsx) | `duration` (Movie Only) | What is the ideal runtime for feature-length commercial films? | **Good** supplementary info | Complete |
| **CastBubbleChart** | [CastBubbleChart.tsx](file:///d:/Desktop/UNIVER/CURRENTLY/Data/Project/DataVisualizationPJ/src/components/charts/CastBubbleChart.tsx) | `cast` | Who are the most bankable star-power performers driving catalog growth? | **Good** supplementary info | Complete |

---

# 3. Missing Charts Checklist

Based on standard data storytelling paradigms, the following visualizations are recommended to elevate the academic rigor of Chapter 3:

1. **Movies vs TV Shows Volume Stacked Area Chart (Over Time)**
   - **Why it's needed:** Currently, the ratio is only a static 70/30 KPI. We need to visualize how TV show ingestion held firm during 2020–2021 compared to movies to substantiate the "Strategy Shift."
   - **Suggested Placement:** Create `TypeTimelineArea.tsx` and integrate it alongside the existing `VolumeTimeline` in [Dashboard](file:///d:/Desktop/UNIVER/CURRENTLY/Data/Project/DataVisualizationPJ/src/pages/dashboard/index.tsx) or [Reports](file:///d:/Desktop/UNIVER/CURRENTLY/Data/Project/DataVisualizationPJ/src/pages/Reports/index.tsx).
   
2. **Seasonal Content Addition Heatmap (Month vs Year)**
   - **Why it's needed:** Currently, "Peak Drop Month" is simply static text. A calendar heatmap could visualize "December/July dumps" patterns.
   - **Suggested Placement:** Introduce inside [Analysis Page](file:///d:/Desktop/UNIVER/CURRENTLY/Data/Project/DataVisualizationPJ/src/pages/Analysis/index.tsx).

---

# 4. Chapter 3 Storytelling Plan

Below is the empirical blueprint for Chapter 3, formatted exactly as requested for seamless report compilation, merging redundant time-based visualization workflows into a cohesive unified narrative.

### 📊 CHAPTER 3 CONSOLIDATED MASTER INDEX

| Section | Chart Type (Loại biểu đồ) | Target Location in Web UI (Đường dẫn & Tên biểu đồ) | Suggested Academic Figure Title (Tiêu đề trong Báo cáo) |
| :--- | :--- | :--- | :--- |
| **3.1** | **Vertical Bar Chart** <br> *(Biểu đồ cột dọc)* | `/dashboard` <br> $\rightarrow$ "Annual Netflix Content Additions" | **Figure 3.1a:** *"Annual Netflix Content Additions"* <br> **Figure 3.1b:** *"Movie vs TV Show Annual Content Additions"* |
| **3.2** | **Treemap Chart** <br> *(Biểu đồ phân cấp hình chữ nhật)* | `/dashboard` <br> $\rightarrow$ "Global Genre Distribution on Netflix" | **Figure 3.2:** *"Global Genre Distribution on Netflix"* |
| **3.3** | **Horizontal Bar Chart** <br> *(Biểu đồ thanh nằm ngang)* | `/reports` <br> $\rightarrow$ "Geographic Distribution of Netflix Content" | **Figure 3.3:** *"Geographic Distribution of Netflix Content"* |
| **3.4** | **Bivariate Scatter Plot** <br> *(Biểu đồ phân tán)* | `/analysis` <br> $\rightarrow$ "Relationship Between Production Year and Netflix Listing Year" | **Figure 3.4:** *"Relationship Between Production Year and Netflix Listing Year"* |
| **3.5** | **Radar Chart / Spider Map** <br> *(Biểu đồ mạng nhện)* | `/analysis` <br> $\rightarrow$ "Content Rating Distribution on Netflix" | **Figure 3.5:** *"Content Rating Distribution on Netflix"* |
| **3.6** | **Aggregated Histogram** <br> *(Biểu đồ tần suất)* | `/reports` <br> $\rightarrow$ "Distribution of Movie Durations on Netflix" | **Figure 3.6:** *"Distribution of Movie Durations on Netflix"* |
| **3.7** | **Dynamic Bubble Chart** <br> *(Biểu đồ bong bóng)* | `/talent` <br> $\rightarrow$ "Most Frequent Actors in the Netflix Catalog" | **Figure 3.7:** *"Most Frequent Actors in the Netflix Catalog"* |

---

## CHAPTER 3. STORYTELLING

### 3.1 Temporal Catalog Scaling and Content-Type Strategy Shift
- **Chart to use:** `VolumeTimeline` (Utilized in two states: Complete Aggregate, and Content-Type Sliced)
- **Chart type:** Vertical Bar Chart (Biểu đồ cột dọc)
- **Information:**
  - **Data columns:** `year_added`, `type`
  - **Key observation to verify from data:** 
    * *State A (Aggregate Growth):* Exponential scaling occurred from 2016 (418 additions) to a historic peak in 2019 (1,999 additions), marking the Golden Age of Accumulation.
    * *State B (Strategic Correction):* At the 2019 peak, Movies outpaced TV Shows by an enormous 2.4x factor (1,424 vs 575). In 2021, however, Movies plummeted by 30.2% down to 993, while TV Shows maintained higher resilience, contracting only by 12.1% to 505, compressing the delta.
  - **Storytelling angle:** The Pivot from Aggressive Volume to High-Retention Episodic IP. As market competition arrived, Netflix corrected its Movie-skewed legacy inventory to prioritize episodic series, extending Subscriber Lifetime Value.
  - **Suggested report paragraph 1 (Total Scale):** "An empirical assessment of catalog growth reveals a distinctive hyperbolic trajectory beginning in 2016. Total annual units ingested jumped from 418 titles in 2016 to a historic high of 1,999 titles in 2019—representing a roughly 378% increase in licensing and production acceleration. This aggressive expansion marks the 'Golden Age of Content Accumulation,' where Netflix heavily expanded its digital footprint to lock in global audiences ahead of the arrival of major streaming competitors."
  - **Suggested report paragraph 2 (Strategic Shift):** "While feature films still dominate overall volume, temporal filtering reveals an implicit strategic pivot towards episodic formats. At the height of scaling in 2019, Movie additions outpaced TV Shows by a factor of 2.4x. However, during the post-2020 stabilization phase, film licensing contracted by 30.2% (down to 993 additions in 2021) whereas episodic TV Show volume suffered only a minor 12.1% correction. This structural shift asserts Netflix's recalibration toward serialized IPs, which provide sustained, multi-week audience engagement and reduce churn compared to standalone cinematic assets."
  - **Suggested figure caption A (Full State):** *"Figure 3.1a: Annual Netflix Content Additions"*
  - **Suggested figure caption B (Filtered State):** *"Figure 3.1b: Movie vs TV Show Annual Content Additions"*
- **Location of that chart:** you can find it by direct to url: `/dashboard` (or `/`), then find the chart with title "Annual Netflix Content Additions". Toggle the `Content Type` filtering buttons (`Movie`/`TV Show`) to switch between Analysis State A and State B.
- **Description:**
  - *Mô tả:* Biểu đồ cột dọc (Bar Chart) biến động thời gian, kết hợp với bộ điều khiển lọc chuyển đổi loại hình (Movie/TV Show Toggle) và KPI Progress Bar tỉ trọng.
  - *Ý nghĩa:* Tích hợp quan sát tốc độ gia tăng dung lượng thư viện kết hợp khả năng bóc tách sâu vào cơ cấu danh mục, phát hiện điểm uốn (inflection point) nơi Netflix dịch chuyển tỷ trọng đầu tư từ phim lẻ sang phim dài tập.
  - *Trực quan:* Trục X: Năm nạp phim (`year_added`), Trục Y: Số lượng tiêu đề (`Titles Added`), Độ dài thanh ngang KPI biểu diễn tỷ lệ phần trăm tương quan động theo bộ lọc.

---

### 3.2 Genre Dominance and Content Positioning
- **Chart to use:** `GenreTreemap`
- **Chart type:** Treemap Chart (Biểu đồ phân vùng cấu trúc hình chữ nhật)
- **Information:**
  - **Data columns:** `listed_in`
  - **Key observation to verify from data:** "International Movies" (2,752) and "Dramas" (2,427) occupy the premier tiers of the hierarchy. "Comedies" (1,674) and "International TV Shows" (1,351) define the secondary anchors.
  - **Storytelling angle:** Globalization through Localization. The dominance of "International" tags indicates that Netflix is not simply exporting Hollywood content, but localizing its catalogue to secure specific geographic sub-markets.
  - **Suggested report paragraph:** "Structural analysis of catalog taxonomy via the Genre Treemap demonstrates that Netflix's growth engine is heavily anchored in 'International Movies' (2,752 citations) and 'Dramas' (2,427). This heavily highlights a 'Globalization through Localization' ethos. Instead of relying exclusively on universal Western-centric blockbusters, Netflix utilizes locally resonant international narratives to satisfy regional taste clusters, driving massive penetration in emerging economies across APAC, LATAM, and EMEA."
  - **Suggested figure caption:** *"Figure 3.2: Global Genre Distribution on Netflix"*
- **Location of that chart:** you can find it by direct to url: `/dashboard` (or `/`), then find the chart with title "Global Genre Distribution on Netflix".
- **Description:**
  - *Mô tả:* Biểu đồ phân cấp cấu trúc hình chữ nhật lồng nhau (Treemap Layout) hiển thị Top 15 nhóm thể loại có sức nặng nhất.
  - *Ý nghĩa:* Chỉ ra ngay lập tức các dòng nội dung chủ lực đóng vai trò "mỏ neo" (anchor components) thu hút và định danh tính chất danh mục Netflix.
  - *Trực quan:* Diện tích ô chữ nhật tỷ lệ thuận với lượng đếm (`listed_in`), thang gradient đỏ đậm đến hồng nhạt hỗ trợ dò thứ tự từ cao xuống thấp.

---

### 3.3 Global Content Distribution
- **Chart to use:** `CountryBarChart`
- **Chart type:** Horizontal Bar Chart (Biểu đồ thanh nằm ngang)
- **Information:**
  - **Data columns:** `country`
  - **Key observation to verify from data:** United States is the indisputable titan (3,690 unique titles). India secures the solid #2 spot (1,046 titles), followed by the United Kingdom (806), Canada (445), and France (393).
  - **Storytelling angle:** The Bipolar Production Engine. Netflix operates with a powerful US production base, but maintains a heavily structured Asian and European cluster, recognizing India and the UK as essential content foundries.
  - **Suggested report paragraph:** "Production geography illustrates an ecosystem led by the United States (3,690 titles), representing roughly 41.9% of the global footprint. More critically, India has established itself as the premier international foundry with 1,046 assets, eclipsing traditional powerhouses like the United Kingdom (806) and Canada (445). This reinforces Netflix's capital investment strategy targeting massive Asian subscriber bases, establishing hyper-localized, native-language production hubs capable of scaling globally."
  - **Suggested figure caption:** *"Figure 3.3: Geographic Distribution of Netflix Content"*
- **Location of that chart:** you can find it by direct to url: `/reports`, then find the chart with title "Geographic Distribution of Netflix Content".
- **Description:**
  - *Mô tả:* Biểu đồ thanh nằm ngang (Horizontal Bar Chart) xếp hạng 10 lò sản xuất địa lý có tỷ trọng sản xuất cao nhất.
  - *Ý nghĩa:* Đo lường độ bao phủ toàn cầu và cán cân giữa "sân nhà" Hoa Kỳ với phần còn lại của thế giới.
  - *Trực quan:* Trục X: Tần suất tiêu đề theo quốc gia (`country`), Trục Y: Danh sách quốc gia cụ thể, Nhãn số liệu trực tiếp tại đầu mút thanh đồ họa.

---

### 3.4 Release Lag and Content Freshness
- **Chart to use:** `AcquisitionScatter`
- **Chart type:** Bivariate Scatter Plot (Biểu đồ phân tán hai biến số)
- **Information:**
  - **Data columns:** `release_year`, `year_added`
  - **Key observation to verify from data:** The Average Acquisition Lag is ~4.7 years. Today, 36.6% of catalog items constitute "Day One Freshness" (released and added within the same calendar year). The Scatter reveals massive cluster concentration strictly aligned to the diagonal sync line in recent epochs (2018–2021).
  - **Storytelling angle:** From "Back-Catalog Re-run House" to "Instant-Release Network." Netflix's focus has definitively migrated from acquiring aging cinematic archives to rolling out high-cadence, same-day global releases (Netflix Originals).
  - **Suggested report paragraph:** "Temporal correlation analyzed via the Acquisition Scatter Plot illustrates a stark structural transition. While the historical Average Acquisition Lag sits at 4.7 years—pulled upward by back-catalog acquisitions of classical cinema—modern distributions (2018–2021) show immediate synchronization. Today, fully 36.6% of all catalog additions represent 'Day-One Content Freshness,' ingested the exact same year they are manufactured. This proves that Netflix has fully decoupled itself from traditional second-run syndicate models to become a premier, instant-release destination powered by high-velocity internal production cycles."
  - **Suggested figure caption:** *"Figure 3.4: Relationship Between Production Year and Netflix Listing Year"*
- **Location of that chart:** you can find it by direct to url: `/analysis`, then find the chart with title "Relationship Between Production Year and Netflix Listing Year".
- **Description:**
  - *Mô tả:* Biểu đồ phân tán hai chiều (2D Scatter Plot) thể hiện phân bổ tương quan giữa năm sản xuất và năm cập nhật lên hệ thống.
  - *Ý nghĩa:* Phân tích độ nhanh nhạy trong việc phát hành phim, phát hiện chiến lược chuyển đổi từ thâu tóm phim cũ sang phát hành độc quyền trực diện (Day-One Originals).
  - *Trực quan:* Trục X: Năm sản xuất (`release_year`), Trục Y: Năm nạp (`year_added`), Màu chấm biểu thị loại hình (Movie/TV Show), Đường đứt nét 45 độ biểu thị trạng thái đồng bộ tuyệt đối.

---

### 3.5 Rating and Audience Targeting
- **Chart to use:** `RatingRadar`
- **Chart type:** Radar Chart / Spider Map (Biểu đồ mạng nhện)
- **Information:**
  - **Data columns:** `rating`
  - **Key observation to verify from data:** TV-MA (3,207 titles) and TV-14 (2,160 titles) completely dominate the radar's primary axes. Family-friendly TV-PG (863) and PG-13 (490) hold secondary, heavily scaled-down positions.
  - **Storytelling angle:** The Maturity Lock-in. Netflix's strategy heavily favors mature audiences (Adults and Young Adults). This targets demographics with direct purchasing power, who seek prestige dramas, darker narratives, and unfiltered standup specials.
  - **Suggested report paragraph:** "The demographic architecture visualised on the Rating Radar affirms that Netflix skews heavily towards Mature (TV-MA: 3,207 titles) and Adolescent/Young Adult audiences (TV-14: 2,160 titles). These two ratings combined represent over 60% of all categorised materials. This underscores a conscious content positioning: by prioritizing complex, adult-skewing narratives, Netflix separates itself from familial-focused architectures (e.g., Disney+), capturing demographic brackets with higher discretionary income and longer attention retention capabilities."
  - **Suggested figure caption:** *"Figure 3.5: Content Rating Distribution on Netflix"*
- **Location of that chart:** you can find it by direct to url: `/analysis`, then find the chart with title "Content Rating Distribution on Netflix".
- **Description:**
  - *Mô tả:* Biểu đồ mạng nhện (Radar/Spider Chart) phân bổ tần suất của 5 phân lớp kiểm duyệt giới hạn độ tuổi hàng đầu.
  - *Ý nghĩa:* Xác định nhóm khách hàng trung tâm Netflix đang săn đón, chứng minh định hướng nhắm vào người trưởng thành để tối đa hóa tệp trả phí.
  - *Trực quan:* Số góc mạng ứng với danh mục `rating`, khoảng cách trục góc từ tâm tỷ lệ thuận với độ lớn tần suất tích lũy.

---

### 3.6 Statistical Movie Runtime Distribution
- **Chart to use:** `DurationChart`
- **Chart type:** Aggregated Frequency Histogram (Biểu đồ phân phối tần suất Histogram)
- **Information:**
  - **Data columns:** `duration` (Movie assets only)
  - **Key observation to verify from data:** Analysis of 6,128 feature films yields an average runtime of 99.6 minutes (median of 98 minutes). A massive, overwhelming cluster of 3,092 films (exceeding 50.4% of all movies) adheres strictly to the 90–120 minute sweet spot, while extreme durations (>150 minutes) are rare exceptions (262 titles).
  - **Storytelling angle:** The Standardization of Cinematic Engagement. Netflix's movie library adheres strictly to global commercial theatrical standards (1.5 to 2 hours). This optimizes viewer attention spans, maintaining a structural sweet-spot that maximizes completion rates for streaming consumption.
  - **Suggested report paragraph:** "A statistical profiling of the 6,128 feature films available reveals highly standardized engagement parameters. Mean runtime concentrates perfectly at 99.6 minutes, with the median aligning closely at 98 minutes. More crucially, fully 3,092 movies—over 50% of the entire cinema catalog—cluster strictly within the 90–120 minute bracket. By prioritizing the traditional 1.5 to 2-hour standard, Netflix aligns its library to global commercial viewing behaviors, ensuring feature-length contents remain long enough to deliver complex narratives but concise enough to prevent user fatigue and secure high streaming completion ratios."
  - **Suggested figure caption:** *"Figure 3.6: Distribution of Movie Durations on Netflix"*
- **Location of that chart:** you can find it by direct to url: `/reports`, then find the chart with title "Distribution of Movie Durations on Netflix".
- **Description:**
  - *Mô tả:* Biểu đồ phân phối cột tần suất (Histogram) phân nhóm thời lượng tính theo phút của các tựa phim lẻ.
  - *Ý nghĩa:* Xác lập cấu trúc thời lượng chuẩn mực mà các nhà làm phim Netflix hướng tới để tối ưu hóa tỷ lệ xem hết tập phim (Completion Rate) của khách hàng.
  - *Trực quan:* Trục X: Trục thời lượng chia khoảng 10 phút/bin (`duration`), Trục Y: Số lượng tác phẩm rơi vào khoảng tương ứng, Đi kèm nhãn trung bình (Mean) định vị lõi phân bổ.

---

### 3.7 Star-Power Performance Density & Talent Clusters
- **Chart to use:** `CastBubbleChart`
- **Chart type:** Dynamic Non-Hierarchical Bubble Chart (Biểu đồ chùm bong bóng động)
- **Information:**
  - **Data columns:** `cast`
  - **Key observation to verify from data:** Bubble dimensions map a highly concentrated nucleus dominated by Bollywood and International talent hubs. Leading superstars such as Anupam Kher (43 titles) and Shah Rukh Khan (35 titles) anchor the primary cluster, supported by major voice actors like Julie Tejwani (33).
  - **Storytelling angle:** The Celebrity Catalyst Model. Netflix leverages established "Anchor Performers" who command immense, dedicated fanbases. This minimizes the commercial risk of new content drops by pairing them with actors who carry pre-existing audience loyalty.
  - **Suggested report paragraph:** "Dynamic mapping of actor role frequencies reveals a highly concentrated 'Celebrity Catalyst Model' powering international content discovery. Prolific heavyweights like Anupam Kher (43 title credits) and Shah Rukh Khan (35) dominate the primary bubble clusters, representing powerful anchors for Netflix's highly lucrative Indian content engine. By repeatedly licensing and producing material tied to these localized superstars, Netflix dramatically lowers the risk of new catalog drops, leveraging pre-existing cult-followings to bypass cultural barriers and instantly stimulate high organic engagement."
  - **Suggested figure caption:** *"Figure 3.7: Most Frequent Actors in the Netflix Catalog"*
- **Location of that chart:** you can find it by direct to url: `/talent`, then find the D3 bubble chart with title "Most Frequent Actors in the Netflix Catalog".
- **Description:**
  - *Mô tả:* Biểu đồ bong bóng động (Bubble Chart) không phân cấp, biểu thị tần suất diễn viên xuất hiện trong danh mục tác phẩm.
  - *Ý nghĩa:* Định lượng sức nặng thương hiệu của các ngôi sao "bảo chứng doanh thu," những người thu hút lượng fan trung thành lớn giúp lôi kéo thuê bao mới.
  - *Trực quan:* Kích thước bong bóng (Radius Size) tỷ lệ thuận với số lượng tác phẩm tham gia (`cast`), Trực quan hóa va chạm vật lý để phân nhóm các nhân tố cốt lõi ở vùng trung tâm.

---

### 3.8 Strategic Summary
- **Main insight 1:** Catalog Ingestion peaked massively in 2019 (1,999 titles) before moving into a strategic stabilization phase in 2020–2021.
- **Main insight 2:** The globalization engine is propelled heavily by non-US hubs, with India standing as the leading international content supplier (1,046 titles).
- **Main insight 3:** Netflix is no longer primarily a library archive; 36.6% of current content additions are produced "in-stride" and published immediately, proving the triumph of the Original Content engine.
- **Main insight 4:** Structural movie assets are deeply optimized for commercial standardizations, with over 50% of feature films targeting the ~100 minute attention sweet-spot.
- **Final interpretation:** Netflix has matured from an aggressive aggregator to a highly-curated, mature-audience focused global broadcaster utilizing local hubs and star-power catalysts to secure sustainable global retention.

---

# 5. Concrete Next Actions

To quickly translate these insights into the final submission:

1. **Perform System Captures (Screenshots)**
   - **Capture 1:** Go to `/dashboard` -> Set Content Type: `All` -> Screenshot [VolumeTimeline.tsx](file:///d:/Desktop/UNIVER/CURRENTLY/Data/Project/DataVisualizationPJ/src/components/charts/VolumeTimeline.tsx) for **Section 3.1 (Figure 3.1a)**.
   - **Capture 2:** Go to `/dashboard` -> Toggle `Movie` and then `TV Show` on [VolumeTimeline.tsx](file:///d:/Desktop/UNIVER/CURRENTLY/Data/Project/DataVisualizationPJ/src/components/charts/VolumeTimeline.tsx) to capture Contrast State for **Section 3.1 (Figure 3.1b)**.
   - **Capture 3:** Go to `/dashboard` -> Set Content Type: `All` -> Screenshot [GenreTreemap.tsx](file:///d:/Desktop/UNIVER/CURRENTLY/Data/Project/DataVisualizationPJ/src/components/charts/GenreTreemap.tsx) for **Section 3.2 (Figure 3.2)**.
   - **Capture 4:** Go to `/reports` -> Screenshot [CountryBarChart.tsx](file:///d:/Desktop/UNIVER/CURRENTLY/Data/Project/DataVisualizationPJ/src/components/charts/CountryBarChart.tsx) for **Section 3.3 (Figure 3.3)**.
   - **Capture 5:** Go to `/analysis` -> Screenshot [AcquisitionScatter.tsx](file:///d:/Desktop/UNIVER/CURRENTLY/Data/Project/DataVisualizationPJ/src/components/charts/AcquisitionScatter.tsx) for **Section 3.4 (Figure 3.4)**.
   - **Capture 6:** Go to `/analysis` -> Screenshot [RatingRadar.tsx](file:///d:/Desktop/UNIVER/CURRENTLY/Data/Project/DataVisualizationPJ/src/components/charts/RatingRadar.tsx) for **Section 3.5 (Figure 3.5)**.
   - **Capture 7:** Go to `/reports` -> Screenshot [DurationChart.tsx](file:///d:/Desktop/UNIVER/CURRENTLY/Data/Project/DataVisualizationPJ/src/components/charts/DurationChart.tsx) for **Section 3.6 (Figure 3.6)**.
   - **Capture 8:** Go to `/talent` -> Screenshot [CastBubbleChart.tsx](file:///d:/Desktop/UNIVER/CURRENTLY/Data/Project/DataVisualizationPJ/src/components/charts/CastBubbleChart.tsx) for **Section 3.7 (Figure 3.7)**.

2. **Assemble Report Chapters**
   - Insert each corresponding Screenshot into your report document under Chapter 3.
   - Provide the **Mô tả**, **Ý nghĩa**, and **Trực quan** text block (based on the formatted bilingual structures above) directly above the screenshot as the visual caption.
   - Paste the **Suggested report paragraph** directly beneath each screenshot to deliver a robust, empirically backed data analysis.
