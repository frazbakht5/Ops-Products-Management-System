import { Buffer } from "buffer";

export function detectImageMimeTypeFromBuffer(buf: Buffer): string | null {
  if (buf.length >= 8 && buf.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return "image/png";
  }
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return "image/jpeg";
  }
  if (buf.length >= 6 && (buf.slice(0, 6).toString("ascii") === "GIF87a" || buf.slice(0, 6).toString("ascii") === "GIF89a")) {
    return "image/gif";
  }
  if (buf.length >= 12 && buf.slice(0, 4).toString("ascii") === "RIFF" && buf.slice(8, 12).toString("ascii") === "WEBP") {
    return "image/webp";
  }
  if (buf.length >= 2 && buf.slice(0, 2).toString("ascii") === "BM") {
    return "image/bmp";
  }
  return null;
}

export function validateBase64Image(
  base64: string,
  declaredMime?: string | null,
  maxBytes = 5 * 1024 * 1024,
): { ok: true; mime: string; size: number } | { ok: false; reason: string } {
  let buf: Buffer;
  try {
    buf = Buffer.from(base64, "base64");
  } catch (err) {
    return { ok: false, reason: "invalid_base64" };
  }

  if (!buf || buf.length === 0) {
    return { ok: false, reason: "empty_data" };
  }

  if (buf.length > maxBytes) {
    return { ok: false, reason: "too_large" };
  }

  const detected = detectImageMimeTypeFromBuffer(buf);
  if (!detected) {
    return { ok: false, reason: "unsupported_image_type" };
  }

  if (declaredMime && declaredMime !== detected) {
    return { ok: false, reason: "mime_mismatch" };
  }

  return { ok: true, mime: detected, size: buf.length };
}

export default {
  detectImageMimeTypeFromBuffer,
  validateBase64Image,
};
