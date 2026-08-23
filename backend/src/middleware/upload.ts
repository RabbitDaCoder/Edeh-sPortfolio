import multer from "multer";
import { ALLOWED_MIME_TYPES } from "../storage/storage";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  fileFilter: (_req, file, callback) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      return callback(
        new Error("Unsupported file type. Use JPEG, PNG, WebP, or GIF."),
      );
    }
    callback(null, true);
  },
});
