# Tạo thiệp cưới

Web tĩnh: nhập tên khách mời → tên được vẽ lên mẫu thiệp → tải ảnh PNG.

- `index.html` — thiệp nhà gái (2 mẫu: lễ thành hôn, tiệc cưới), mở `http://localhost:8000`
- `nha-trai/index.html` — thiệp nhà trai (1 mẫu gộp lễ 15:00 + tiệc 16:00), mở `http://localhost:8000/nha-trai/`
Trên điện thoại, nút tải mở menu chia sẻ để lưu vào Ảnh hoặc gửi Zalo.

## Chạy

Phải mở qua HTTP (mở thẳng file `index.html` thì trình duyệt chặn xuất ảnh từ canvas):

```bash
cd thiep_cuoi
python3 -m http.server 8000   # rồi mở http://localhost:8000
```

Deploy: chép cả thư mục lên bất kỳ static hosting nào (GitHub Pages, Netlify, Nginx…).

## Cấu trúc

| File | Vai trò |
|---|---|
| `config.js` | Mẫu thiệp, vị trí và kiểu chữ tên khách — đổi thiệp chỉ sửa file này |
| `nha-trai/` | Trang nhà trai: `index.html` + `config.js` riêng, dùng chung `app.js`, `style.css` |
| `app.js` | Vẽ canvas, xem trước, tải / chia sẻ ảnh |
| `assets/thiep-1.png`, `thiep-2.png` | Ảnh nền xuất từ Canva (1241×1748), để trống chỗ tên |
| `assets/nha-trai/1.png`, `2.png`, `3.png` | Thiệp nhà trai; `3.png` gộp từ 1 và 2, là ảnh nền trang nhà trai |
| `assets/fonts/Birthstone-Regular.ttf` | Font tên khách (giống bản Canva, có dấu tiếng Việt; giấy phép OFL) |
| `chinese Wedding Invitation.pdf` | Bản thiết kế gốc, trang 3 là ví dụ thành phẩm |

## Đổi mẫu thiệp

1. Xuất ảnh mới từ Canva (để trống chỗ tên), thay vào `assets/`.
2. Trong `config.js` sửa `name: { x, y }` — toạ độ pixel trên ảnh gốc, `x` là tâm ngang, `y` là baseline chữ.
3. Chỉnh `fontSize`, `maxWidth` nếu cần. Tên dài hơn `maxWidth` sẽ tự co, tối thiểu `minFontSize`.
# thiep_cuoi
