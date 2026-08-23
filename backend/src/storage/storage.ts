import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import path from "path";
import { lookup } from "mime-types";
import { R2_BUCKET_NAME, R2_PUBLIC_URL, r2Client } from "./providers/r2";

export const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024;
export const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]);

const PORTFOLIO_PREFIX = "edeh-portfolio";
export const MEDIA_FOLDERS = new Set([
  "images",
  "polaroids",
  "rooms",
  "receipts",
  "documents",
  "profiles",
  "logos",
]);

export interface UploadFile {
  buffer: Buffer;
  mimetype: string;
  size: number;
  originalname: string;
}

export interface UploadedFile {
  key: string;
  url: string;
  filename: string;
  mimetype: string;
  size: number;
}

function extensionFor(file: UploadFile): string {
  const extension = path
    .extname(file.originalname)
    .toLowerCase()
    .replace(/^\./, "");
  if (extension) return extension;
  return lookup(file.mimetype)?.toString().split("/").pop() ?? "bin";
}

export function generateUniqueFilename(
  file: UploadFile,
  folder: string,
): string {
  const cleanFolder = folder.replace(/^\/+|\/+$/g, "");
  return `${PORTFOLIO_PREFIX}/${cleanFolder}/${randomUUID()}.${extensionFor(file)}`;
}

export async function uploadFile(
  file: UploadFile,
  folder: string,
): Promise<UploadedFile> {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    throw new Error("Unsupported file type. Use JPEG, PNG, WebP, GIF, or PDF.");
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("File size must not exceed 100 MB.");
  }

  const key = generateUniqueFilename(file, folder);
  await r2Client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentLength: file.size,
      ContentDisposition:
        file.mimetype === "application/pdf" ? "inline" : undefined,
    }),
  );

  return {
    key,
    url: getFileUrl(key),
    filename: path.basename(key),
    mimetype: file.mimetype,
    size: file.size,
  };
}

export async function deleteFile(key?: string | null): Promise<void> {
  if (!key) return;
  try {
    await r2Client.send(
      new DeleteObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }),
    );
  } catch {
    // Deletes are intentionally idempotent.
  }
}

export function getFileUrl(key: string): string {
  return `${R2_PUBLIC_URL}/${key}`;
}

export async function uploadJson(
  data: object,
  filename: string,
): Promise<string> {
  const key = `${PORTFOLIO_PREFIX}/backups/${filename}`;
  const body = JSON.stringify(data);
  await r2Client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: "application/json",
    }),
  );
  return getFileUrl(key);
}

export async function pruneBackups(maxBackups: number): Promise<void> {
  const result = await r2Client.send(
    new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      Prefix: `${PORTFOLIO_PREFIX}/backups/`,
    }),
  );
  const objects = (result.Contents ?? [])
    .filter((object) => object.Key)
    .sort(
      (a, b) =>
        (a.LastModified?.getTime() ?? 0) - (b.LastModified?.getTime() ?? 0),
    );
  for (const object of objects.slice(
    0,
    Math.max(0, objects.length - maxBackups),
  )) {
    await deleteFile(object.Key);
  }
}
