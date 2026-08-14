import { randomUUID } from "crypto";
import path from "path";
import { supabaseAdmin } from "./supabase";

const PRODUCTS_BUCKET = "products";
const RECEIPTS_BUCKET = "receipts";

const ALLOWED = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
  ["image/heic", ".heic"],
  ["image/heif", ".heif"],
  ["application/pdf", ".pdf"],
]);

async function ensureBucket(name: string, isPublic: boolean) {
  const supabase = supabaseAdmin();
  const { data } = await supabase.storage.listBuckets();
  if (data?.some((bucket) => bucket.name === name)) return;
  const { error } = await supabase.storage.createBucket(name, {
    public: isPublic,
    fileSizeLimit: 8388608,
  });
  if (error && !/already exists/i.test(error.message)) {
    throw new Error(error.message);
  }
}

function extensionFor(file: File) {
  const extFromType = ALLOWED.get(file.type);
  const original = path.extname(file.name).toLowerCase();
  const ext =
    extFromType ||
    ([".jpg", ".jpeg", ".png", ".webp", ".gif", ".heic", ".pdf"].includes(original)
      ? original
      : null);
  if (!ext) {
    throw new Error("Envie uma foto ou PDF");
  }
  return ext;
}

export async function saveUpload(file: File, kind: "receipt" | "product") {
  if (file.size > 8 * 1024 * 1024) {
    throw new Error("Arquivo muito grande (máx. 8 MB)");
  }

  const ext = extensionFor(file);
  const filename = `${randomUUID()}${ext}`;
  const bucket = kind === "product" ? PRODUCTS_BUCKET : RECEIPTS_BUCKET;
  await ensureBucket(bucket, kind === "product");

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabaseAdmin().storage.from(bucket).upload(filename, buffer, {
    contentType: file.type || undefined,
    upsert: false,
  });
  if (error) {
    throw new Error(error.message);
  }

  if (kind === "product") {
    const { data } = supabaseAdmin().storage.from(PRODUCTS_BUCKET).getPublicUrl(filename);
    return data.publicUrl;
  }
  return filename;
}

export async function signedReceiptUrl(filename: string) {
  const { data, error } = await supabaseAdmin()
    .storage.from(RECEIPTS_BUCKET)
    .createSignedUrl(filename, 120);
  if (error || !data?.signedUrl) {
    throw new Error(error?.message || "Não foi possível abrir o comprovante.");
  }
  return data.signedUrl;
}
