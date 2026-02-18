import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Get a public URL for a file in Supabase Storage.
 * Returns a local placeholder path if the bucket/path doesn't resolve.
 */
export function getStorageUrl(bucket: string, path: string): string {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return `/placeholders/${path}`;
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
