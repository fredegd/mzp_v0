import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Only create the Supabase client if the URL and key are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a function to get the Supabase client
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

export const getSupabaseClient = () => {
  // If we already have an instance, return it
  if (supabaseInstance) {
    return supabaseInstance
  }

  // Only create a client if we have the required credentials
  if (supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey)
    return supabaseInstance
  }

  // Return null if we don't have credentials
  return null
}

// For backward compatibility
export const supabase =
  isBrowser && supabaseUrl && supabaseAnonKey ? createClient<Database>(supabaseUrl, supabaseAnonKey) : null

