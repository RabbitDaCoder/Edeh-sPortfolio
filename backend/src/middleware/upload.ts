import multer from "multer";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from "../storage/storage";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, callback) => {
    callback(null, ALLOWED_MIME_TYPES.has(file.mimetype));
  },
});
