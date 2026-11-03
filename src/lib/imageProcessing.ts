// Browser-side photo preparation before upload: resize/compress and watermark.

const MAX_DIMENSION = 2560;
const WATERMARK_SRC = "/liveimage-logo-transparent.png";

let watermarkPromise: Promise<HTMLImageElement> | null = null;

function loadWatermark() {
  watermarkPromise ??= new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load the watermark logo"));
    img.src = WATERMARK_SRC;
  });
  return watermarkPromise;
}

export async function prepareImage(
  file: File,
  options: { compress: boolean; watermark: boolean }
): Promise<Blob> {
  if (!options.compress && !options.watermark) return file;

  const bitmap = await createImageBitmap(file);
  const scale = options.compress
    ? Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
    : 1;
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  if (options.watermark) {
    const logo = await loadWatermark();
    const logoWidth = width * 0.18;
    const logoHeight = (logo.height / logo.width) * logoWidth;
    const margin = width * 0.025;
    ctx.globalAlpha = 0.75;
    ctx.drawImage(logo, width - logoWidth - margin, height - logoHeight - margin, logoWidth, logoHeight);
    ctx.globalAlpha = 1;
  }

  // JPEG has no transparency (clear areas turn black), so PNG/WebP input
  // stays PNG, or becomes WebP when compressing. Browsers that cannot encode
  // WebP fall back to PNG, which the bucket also accepts.
  const hasAlpha = file.type === "image/png" || file.type === "image/webp";
  const type = hasAlpha
    ? options.compress
      ? "image/webp"
      : "image/png"
    : "image/jpeg";
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, type, options.compress ? 0.85 : 0.92)
  );
  if (!blob) return file;
  // Compression should never make a photo bigger
  return options.compress && !options.watermark && blob.size >= file.size ? file : blob;
}

// Uploads to a signed storage URL, reporting progress from 0 to 100
export function uploadWithProgress(
  uploadUrl: string,
  body: Blob,
  onProgress: (percent: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("cacheControl", "31536000");
    form.append("", body);

    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error(`Upload failed (${xhr.status})`));
    xhr.onerror = () => reject(new Error("Upload failed, check your connection"));
    xhr.send(form);
  });
}

// Converts YouTube / Vimeo page links into embeddable player URLs
export function toEmbedUrl(link: string): { embedUrl: string; thumbnail?: string } | null {
  const url = link.trim();
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  if (yt) {
    return {
      embedUrl: `https://www.youtube.com/embed/${yt[1]}`,
      thumbnail: `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg`,
    };
  }
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return { embedUrl: `https://player.vimeo.com/video/${vimeo[1]}` };
  return null;
}
