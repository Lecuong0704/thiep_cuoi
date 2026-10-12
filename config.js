// Cấu hình mẫu thiệp. Đổi thiệp chỉ cần sửa file này.
// Toạ độ tính theo pixel của ảnh nền gốc (1241×1748).
window.THIEP_CONFIG = {
  // Kiểu chữ tên khách mời (dùng chung cho cả 2 ảnh)
  nameStyle: {
    fontFamily: 'Birthstone',
    fontUrl: 'assets/fonts/Birthstone-Regular.ttf',
    fontSize: 72,        // cỡ chữ mặc định
    minFontSize: 40,     // tên dài sẽ co dần nhưng không nhỏ hơn mức này
    color: '#870808',    // trùng màu đỏ tiêu đề trên thiệp
    maxWidth: 760,       // đường chấm rộng 795px (x 226 → 1021)
  },

  placeholder: 'Ông Nguyễn Văn Toản',

  templates: [
    {
      id: 'le-thanh-hon',
      label: 'Ảnh 1 · Lễ thành hôn',
      src: 'assets/thiep-1.png',
      // Tâm ngang của đường chấm, baseline sát trên đường chấm (y = 502), như bản Canva
      name: { x: 624, y: 496 },
    },
    {
      id: 'tiec-cuoi',
      label: 'Ảnh 2 · Tiệc cưới',
      src: 'assets/thiep-2.png',
      name: { x: 624, y: 496 },
    },
  ],
};
