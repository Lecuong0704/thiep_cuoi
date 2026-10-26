(function () {
  'use strict';

  const cfg = window.THIEP_CONFIG;
  const style = cfg.nameStyle;
  const input = document.getElementById('guest');
  const form = document.getElementById('form');
  const status = document.getElementById('status');
  const previews = document.getElementById('previews');
  const buttons = Array.from(document.querySelectorAll('[data-download]'));

  input.placeholder = cfg.placeholder;

  // Mỗi mẫu thiệp có một canvas riêng, giữ độ phân giải gốc của ảnh nền.
  const cards = cfg.templates.map((tpl) => {
    const figure = document.createElement('figure');
    figure.className = 'preview';
    figure.innerHTML = `<figcaption>${tpl.label}</figcaption>`;
    const canvas = document.createElement('canvas');
    figure.appendChild(canvas);
    previews.appendChild(figure);
    return { tpl, canvas, image: null };
  });

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Không tải được ảnh ' + src));
      img.src = src;
    });
  }

  async function loadFont() {
    const face = new FontFace(style.fontFamily, `url(${style.fontUrl})`);
    await face.load();
    document.fonts.add(face);
  }

  function guestName() {
    return input.value.replace(/\s+/g, ' ').trim();
  }

  // Co chữ cho đến khi vừa maxWidth, không nhỏ hơn minFontSize.
  function fitFont(ctx, text) {
    let size = style.fontSize;
    for (; size > style.minFontSize; size -= 1) {
      ctx.font = `${size}px "${style.fontFamily}"`;
      if (ctx.measureText(text).width <= style.maxWidth) return;
    }
    ctx.font = `${style.minFontSize}px "${style.fontFamily}"`;
  }

  function render(card, name, isPlaceholder) {
    const { canvas, image, tpl } = card;
    if (!image) return;
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    if (!name) return;
    ctx.save();
    ctx.globalAlpha = isPlaceholder ? 0.3 : 1;
    ctx.fillStyle = style.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    fitFont(ctx, name);
    // maxWidth của fillText là chốt chặn cuối cho tên cực dài.
    ctx.fillText(name, tpl.name.x, tpl.name.y, style.maxWidth);
    ctx.restore();
  }

  function renderAll() {
    const name = guestName();
    cards.forEach((card) => render(card, name || cfg.placeholder, !name));
    buttons.forEach((b) => { b.disabled = busy || !name; });
  }

  // "Nguyễn Văn Toản" -> "nguyen-van-toan"
  function slugify(text) {
    return text
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function toFile(card, name) {
    return new Promise((resolve, reject) => {
      card.canvas.toBlob((blob) => {
        if (!blob) return reject(new Error('Không xuất được ảnh'));
        const filename = `thiep-${card.tpl.id}-${slugify(name)}.png`;
        resolve(new File([blob], filename, { type: 'image/png' }));
      }, 'image/png');
    });
  }

  function saveFile(file) {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // Trên điện thoại dùng menu chia sẻ để lưu vào Ảnh / gửi Zalo.
  function canShare(files) {
    return window.matchMedia('(pointer: coarse)').matches &&
      navigator.canShare && navigator.canShare({ files });
  }

  async function download(which) {
    const name = guestName();
    if (!name || busy) return;
    setBusy(true);
    const selected = which === 'all' ? cards : [cards[Number(which)]];
    // Vẽ lại bằng tên thật trước khi xuất, phòng trường hợp debounce chưa chạy.
    selected.forEach((card) => render(card, name, false));
    setStatus('Đang tạo ảnh…');
    try {
      const files = await Promise.all(selected.map((card) => toFile(card, name)));
      if (canShare(files)) {
        try {
          await navigator.share({ files });
          setStatus('Đã chia sẻ ảnh.');
          return;
        } catch (err) {
          if (err.name === 'AbortError') { setStatus(''); return; }
          // Chia sẻ lỗi thì quay về tải file bình thường.
        }
      }
      for (let i = 0; i < files.length; i++) {
        if (i > 0) await new Promise((r) => setTimeout(r, 400));
        saveFile(files[i]);
      }
      setStatus(files.length > 1 ? `Đã tải ${files.length} ảnh.` : 'Đã tải ảnh.');
    } catch (err) {
      setStatus(err.message, true);
    } finally {
      setBusy(false);
    }
  }

  // Khoá nút trong lúc xuất ảnh để bấm liên tục không tải trùng.
  let busy = false;
  function setBusy(value) {
    busy = value;
    buttons.forEach((b) => { b.disabled = value || !guestName(); });
  }

  function setStatus(text, isError) {
    status.textContent = text;
    status.classList.toggle('error', !!isError);
  }

  let pending = 0;
  input.addEventListener('input', () => {
    cancelAnimationFrame(pending);
    pending = requestAnimationFrame(renderAll);
  });

  buttons.forEach((b) => {
    if (b.type !== 'submit') b.addEventListener('click', () => download(b.dataset.download));
  });
  // Enter trong ô nhập = tải tất cả ảnh.
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    download('all');
  });

  setStatus('Đang tải mẫu thiệp…');
  Promise.all([
    loadFont(),
    ...cards.map((card) => loadImage(card.tpl.src).then((img) => { card.image = img; })),
  ])
    .then(() => { setStatus(''); renderAll(); })
    .catch((err) => setStatus(err.message, true));
})();
