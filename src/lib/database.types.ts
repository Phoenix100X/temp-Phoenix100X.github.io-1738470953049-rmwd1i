export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'parent' | 'staff' | 'admin'
          created_at: string
        }
        Insert: {
          id: string
          role?: 'parent' | 'staff' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          role?: 'parent' | 'staff' | 'admin'
          created_at?: string
        }
      }
      subscription_plans: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          features: Json
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          features: Json
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          features?: Json
          created_at?: string
        }
      }
      client_subscriptions: {
        Row: {
          id: string
          client_id: string
          plan_id: string
          status: 'active' | 'past_due' | 'canceled'
          current_period_start: string
          current_period_end: string
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          plan_id: string
          status?: 'active' | 'past_due' | 'canceled'
          current_period_start: string
          current_period_end: string
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          plan_id?: string
          status?: 'active' | 'past_due' | 'canceled'
          current_period_start?: string
          current_period_end?: string
          created_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          client_id: string
          subscription_id: string
          amount: number
          status: 'paid' | 'unpaid' | 'void'
          billing_period_start: string
          billing_period_end: string
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          subscription_id: string
          amount: number
          status?: 'paid' | 'unpaid' | 'void'
          billing_period_start: string
          billing_period_end: string
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          subscription_id?: string
          amount?: number
          status?: 'paid' | 'unpaid' | 'void'
          billing_period_start?: string
          billing_period_end?: string
          created_at?: string
        }
      }
      // ... existing types ...
    }
  }
}