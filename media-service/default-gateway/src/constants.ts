import path from "path";

export const ALLOWED_FILE_TYPES = [
  ".mp4",
  ".mov",
  ".avi",
  ".wmv",
  ".avchd",
  ".webm",
  ".flv",
];

export const uploadPath = path.join(__dirname, "../assets");
export const uploadPathChunks = path.join(__dirname, "../chunks");

const MB = 500; // 500 MB
export const CHUNK_SIZE_LIMIT_MB = MB * 1024 * 1024; // Convert MB to bytes
