// Cấu hình thiệp nhà trai. Đổi thiệp chỉ cần sửa file này.
// Toạ độ tính theo pixel của ảnh nền gốc (1240×1748).
window.THIEP_CONFIG = {
  // Kiểu chữ tên khách mời, giống trang nhà gái
  nameStyle: {
    fontFamily: 'Birthstone',
    fontUrl: '../assets/fonts/HY-Aaript.otf',
    fontSize: 72,        // cỡ chữ mặc định
    minFontSize: 40,     // tên dài sẽ co dần nhưng không nhỏ hơn mức này
    color: '#870808',    // trùng màu đỏ tiêu đề trên thiệp
    maxWidth: 760,       // đường chấm rộng 795px (x 226 → 1021)
  },

  placeholder: 'Ông Nguyễn Văn A',

  templates: [
    {
      id: 'nha-trai',
      label: 'Lễ thành hôn & tiệc chung vui',
      src: '../assets/nha-trai/3.png',
      // Đường chấm cùng vị trí với thiệp nhà gái (y = 500)
      name: { x: 624, y: 496 },
    },
  ],
};
