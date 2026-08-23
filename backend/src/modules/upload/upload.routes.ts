import { Router, Request, Response, NextFunction } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { upload } from "../../middleware/upload";
import { MEDIA_FOLDERS, uploadFile } from "../../storage/storage";
import { success } from "../../utils/apiResponse";
import { AppError } from "../../middleware/errorHandler";
import { ErrorCode } from "../../utils/errorCodes";

const router = Router();

router.post(
  "/image",
  authMiddleware,
  upload.single("image"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new AppError(
          ErrorCode.VALIDATION_ERROR,
          "No image file provided",
        );
      }

      const requestedFolder = String(req.body.folder || "images");
      const folder = MEDIA_FOLDERS.has(requestedFolder)
        ? requestedFolder
        : "images";
      const result = await uploadFile(req.file, folder);

      success(res, { url: result.url, key: result.key }, 201);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
