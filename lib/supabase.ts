import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// These environment variables will be replaced with your actual Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

