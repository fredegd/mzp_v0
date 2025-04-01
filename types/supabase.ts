export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      recipes: {
        Row: {
          id: string
          name: string
          description: string
          ingredients: Json
          instructions: string
          cook_time: number
          servings: number
          created_at: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          id?: string
          name: string
          description: string
          ingredients: Json
          instructions: string
          cook_time: number
          servings: number
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string
          ingredients?: Json
          instructions?: string
          cook_time?: number
          servings?: number
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
      }
      meal_plans: {
        Row: {
          id: string
          date: string
          meals: Json
          created_at: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          id?: string
          date: string
          meals: Json
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          date?: string
          meals?: Json
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

