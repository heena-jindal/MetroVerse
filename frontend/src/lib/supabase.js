import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn(
    "[MetroVerse] Warning: Supabase credentials (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) are missing. Authentication calls will fail until configured."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getProfile(userId) {
  return supabase.from("profiles").select("*").eq("id", userId).single();
}

export async function updateProfile(userId, data) {
  return supabase.from("profiles").update(data).eq("id", userId);
}
