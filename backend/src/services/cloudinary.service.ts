import { cloudinary } from "../config/cloudinary";
import type { UploadApiResponse } from "cloudinary";

export class CloudinaryService {
  async upload(
    buffer: Buffer,
    options: {
      folder: string;
      resourceType?: "auto" | "raw" | "image" | "video";
      publicId?: string;
    },
  ): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder,
          resource_type: options.resourceType ?? "auto",
          public_id: options.publicId,
          use_filename: true,
          unique_filename: true,
        },
        (error, result?: UploadApiResponse) => {
          if (error || !result) return reject(error);
          resolve({ url: result.secure_url, publicId: result.public_id });
        },
      );
      stream.end(buffer);
    });
  }

  async destroy(publicId: string, resourceType: string = "raw"): Promise<void> {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  }
}

export const cloudinaryService = new CloudinaryService();
