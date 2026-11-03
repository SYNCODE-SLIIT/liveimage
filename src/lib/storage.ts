import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const MEDIA_BUCKET = "media";
export const MAX_IMAGE_MB = 20;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

let client: SupabaseClient | null = null;
let bucketReady = false;

// Server-only Supabase client using the secret key (never sent to browsers)
function getClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL / SUPABASE_SECRET_KEY are not set");
  }
  client ??= createClient(url, key, { auth: { persistSession: false } });
  return client;
}

// Creates the public media bucket the first time it is needed
async function ensureBucket(supabase: SupabaseClient) {
  if (bucketReady) return;
  const { data } = await supabase.storage.getBucket(MEDIA_BUCKET);
  if (!data) {
    const { error } = await supabase.storage.createBucket(MEDIA_BUCKET, {
      public: true,
      allowedMimeTypes: IMAGE_TYPES,
      fileSizeLimit: `${MAX_IMAGE_MB}MB`,
    });
    if (error && !/already exists/i.test(error.message)) throw error;
  }
  bucketReady = true;
}

export async function createSignedUpload(path: string) {
  const supabase = getClient();
  await ensureBucket(supabase);
  const { data, error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .createSignedUploadUrl(path);
  if (error || !data) throw error ?? new Error("Could not create upload URL");
  const publicUrl = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
  return { uploadUrl: data.signedUrl, publicUrl };
}

// Turns public URLs back into bucket paths; URLs stored elsewhere are skipped
export function storagePathsFromUrls(urls: string[]) {
  const prefix = `${process.env.SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/`;
  return urls.filter((u) => u.startsWith(prefix)).map((u) => u.slice(prefix.length));
}

export async function removeFiles(paths: string[]) {
  if (paths.length === 0) return;
  const { error } = await getClient().storage.from(MEDIA_BUCKET).remove(paths);
  if (error) throw error;
}
