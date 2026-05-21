# JotDown

JotDown là ứng dụng ghi chú xây dựng bằng React và Vite, tập trung vào trải nghiệm tạo, chỉnh sửa và quản lý ghi chú cá nhân. Dự án có giao diện landing page, luồng xác thực người dùng, workspace ghi chú, hồ sơ, cài đặt và trang 404 tùy chỉnh.

## Tính Năng Chính

- Landing page giới thiệu sản phẩm với navbar public.
- Giao diện đăng nhập, đăng ký, quên mật khẩu và đặt lại mật khẩu.
- Workspace ghi chú gồm danh sách note, editor và thao tác thêm/xóa/lưu tạm thời.
- Trang hồ sơ người dùng và trang cài đặt giao diện/bảo mật.
- Trang 404 Not Found cho route chưa tồn tại.
- Theme light/dark bằng Tailwind CSS và DaisyUI.
- Cấu trúc source tách theo `features`, `pages`, `components`, `hooks`, `services`.

## Công Nghệ Sử Dụng

- React 19
- Vite 8
- React Router DOM 6
- Tailwind CSS 3
- DaisyUI
- ESLint

## Cấu Trúc Thư Mục

```text
src/
  components/
    common/        # AppShell, Footer, navbar layout
    landing/       # Các section trên landing page
  features/
    auth/          # Auth pages, components, hooks, services
    notes/         # NoteCard, NoteEditor, notes service
  hooks/           # Custom hooks dùng chung
  pages/           # Page cấp route: Landing, Notes, Profile, Settings, 404
  services/        # API client, storage, sync/realtime placeholder
  utils/           # Constants, formatters, validators
```

## Yêu Cầu Môi Trường

- Node.js 20 hoặc mới hơn khuyến nghị.
- npm đi kèm Node.js.
- Backend/API base URL do chủ sở hữu dự án cung cấp.

## Cài Đặt

```bash
npm install
```

Tạo file `.env` từ mẫu:

```bash
cp .env.example .env
```

Trên Windows PowerShell, có thể dùng:

```powershell
Copy-Item .env.example .env
```

Sau đó cập nhật các giá trị trong `.env` theo thông tin do chủ sở hữu/backend cung cấp.

## Biến Môi Trường

| Biến | Bắt buộc | Mô tả | Người cung cấp |
| --- | --- | --- | --- |
| `VITE_APP_TITLE` | Không | Tên hiển thị của ứng dụng. | Frontend/Chủ sở hữu |
| `VITE_API_BASE_URL` | Có | URL gốc của backend API, ví dụ `https://api.example.com`. | Chủ sở hữu/backend |
| `VITE_AUTH_ENABLED` | Không | Cờ bật/tắt luồng xác thực khi tích hợp backend thật. | Chủ sở hữu |
| `VITE_FEATURE_FLAG_NOTES` | Không | Cờ bật/tắt module ghi chú. | Chủ sở hữu |

Không commit file `.env` thật lên repository. Chỉ commit `.env.example`.

## Chạy Dự Án

Chạy môi trường phát triển:

```bash
npm run dev
```

Nếu chạy trên Windows PowerShell gặp lỗi execution policy với `npm`, dùng:

```powershell
npm.cmd run dev
```

Mặc định Vite sẽ chạy tại:

```text
http://localhost:5173
```

## Scripts

```bash
npm run dev       # Chạy dev server
npm run build     # Build production
npm run preview   # Xem bản build production
npm run lint      # Kiểm tra code bằng ESLint
```

## Routing

Các route chính:

- `/landing`: Trang giới thiệu.
- `/login`: Đăng nhập.
- `/register`: Đăng ký.
- `/forgot-password`: Quên mật khẩu.
- `/reset-password`: Đặt lại mật khẩu.
- `/notes`: Workspace ghi chú.
- `/profile`: Hồ sơ người dùng.
- `/settings`: Cài đặt.
- `*`: Trang 404 Not Found.

Route chưa khai báo, ví dụ `/features`, `/pricing`, `/about`, sẽ hiển thị trang 404.

## Trạng Thái Tích Hợp Backend

Hiện tại dự án đang ở trạng thái frontend prototype:

- Auth service đang mô phỏng đăng nhập bằng Promise.
- Notes đang dùng dữ liệu mẫu và state trong React.
- `noteRealtime` và `noteOfflineSync` là placeholder để mở rộng.
- API client đã có `VITE_API_BASE_URL`, sẵn sàng kết nối backend khi có endpoint thật.

Khi backend được cung cấp, cần cập nhật:

- `src/features/auth/services/authService.js`
- `src/services/api.js`
- Các service liên quan đến notes/sync nếu có endpoint.

## Kiểm Tra Chất Lượng

Đã kiểm tra thành công:

```bash
npm.cmd run lint
npm.cmd run build
```

## Ghi Chú Bàn Giao

- File `.env.example` là mẫu cấu hình môi trường.
- File `.env` thật cần do chủ sở hữu dự án/backend cung cấp và không nên commit.
- Nếu triển khai production, cần xác nhận lại API URL, chính sách auth, CORS và domain deploy.
