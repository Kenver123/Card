const { createCanvas, loadImage } = require('@napi-rs/canvas')
const { fontRegister } = require('../utils/registerFont')

async function miyuCard({
  imageBg,
  imageText,
  songArtist,
  trackStream,
  trackDuration,
  trackTotalDuration,
  fontPath,
  songRequester
}) {
  if (fontPath) {
    fontRegister(fontPath, 'CustomFont');
  }

  const frame = createCanvas(1139, 447);
  const ctx = frame.getContext('2d');

  const circleCanvas = createCanvas(1000, 1000);
  const circleCtx = circleCanvas.getContext('2d');

  const circleRadius = 20;
  const circleY = 97;

  if (imageText.replace(/\s/g, '').length > 15) imageText = `${imageText.slice(0, 15)}...`;
  if (songArtist.replace(/\s/g, '').length > 15) songArtist = `${songArtist.slice(0, 15)}`;
  if (songRequester.replace(/\s/g, '').length > 12)
    songRequester = `${songRequester.slice(0, 10)}...`;

  const backgroundUrl = 'https://i.ibb.co/608WyPTV/new.png';
  const background = await loadImage(backgroundUrl);
  ctx.drawImage(background, 0, 0, frame.width, frame.height);

  const thumbnailCanvas = createCanvas(800, 200); // Mengubah lebar kanvas
  const thumbnailCtx = thumbnailCanvas.getContext('2d');

  let thumbnailImage;

  try {
    thumbnailImage = await loadImage(imageBg, {
      requestOptions: {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
        },
      },
    });
  } catch (error) {
    // Mengatasi kesalahan ketika gambar tidak dapat dimuat
    console.error('MUSICARD: Thumbnail image failed to load, not supported [Lofi & Radio]');
    thumbnailImage = await loadImage(`https://i.ibb.co/tpnVyp77/miyu.png`); // Gunakan gambar default atau URL alternatif
  }

  const thumbnailSize = Math.min(thumbnailImage.width, thumbnailImage.height);
  const thumbnailX = (thumbnailImage.width - thumbnailSize) / 2;
  const thumbnailY = (thumbnailImage.height - thumbnailSize) / 2;

  thumbnailCtx.drawImage(
    thumbnailImage,
    thumbnailX,
    thumbnailY,
    thumbnailSize,
    thumbnailSize,
    0,
    0,
    thumbnailCanvas.width,
    thumbnailCanvas.height
  );

  // Menggambar thumbnail
  ctx.drawImage(thumbnailCanvas, 50, 40, 180, 130);

  // Menambahkan border putih
  ctx.strokeStyle = '#ffffff'; // Warna border putih
  ctx.lineWidth = 5; // Lebar border (sesuaikan dengan preferensi Anda)
  ctx.strokeRect(50, 40, 180, 130); // Koordinat dan ukuran border

  ctx.font = 'bold 50px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr';
  ctx.fillStyle = 'gray'; // Menggunakan fungsi untuk warna acak dari array yang diizinkan
  ctx.fillText(imageText, 250, 103);

  // Teks "author" dengan warna dan ukuran font yang berbeda
  const authorText = songArtist
  ctx.fillStyle = 'gray'// Menggunakan fungsi untuk warna acak dari array yang diizinkan
  ctx.font = 'bold 34px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr';
  ctx.fillText(authorText, 250, 143);

  // Mengukur lebar teks "author" untuk menentukan posisi teks "requester"
  const authorTextWidth = ctx.measureText(authorText).width;

  // Teks "requester" dengan warna dan ukuran font yang berbeda
  const requesterText = songRequester;
  ctx.fillStyle = 'gray'; // Menggunakan fungsi untuk warna acak dari array yang diizinkan
  ctx.font = 'bold 34px circular-std, noto-emoji, noto-sans-jp, noto-sans, noto-sans-kr';
  ctx.fillText(requesterText, 250 + authorTextWidth + 10, 143); // Mengatur posisi "requester" setelah "author"

  return frame.toBuffer('image/png');

}

module.exports = { miyuCard };
