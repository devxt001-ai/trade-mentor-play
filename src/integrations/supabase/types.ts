export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      badges: {
        Row: {
          created_at: string
          description: string
          icon_url: string | null
          id: string
          is_active: boolean | null
          name: string
          rarity: string | null
          unlock_criteria: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          rarity?: string | null
          unlock_criteria?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          rarity?: string | null
          unlock_criteria?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      challenges: {
        Row: {
          challenge_type: string
          created_at: string
          description: string
          duration_days: number | null
          end_date: string
          id: string
          is_active: boolean | null
          reward_badge_id: string | null
          reward_credits: number | null
          start_date: string
          target_metric: string | null
          target_value: number | null
          title: string
          updated_at: string
        }
        Insert: {
          challenge_type: string
          created_at?: string
          description: string
          duration_days?: number | null
          end_date: string
          id?: string
          is_active?: boolean | null
          reward_badge_id?: string | null
          reward_credits?: number | null
          start_date: string
          target_metric?: string | null
          target_value?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          challenge_type?: string
          created_at?: string
          description?: string
          duration_days?: number | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          reward_badge_id?: string | null
          reward_credits?: number | null
          start_date?: string
          target_metric?: string | null
          target_value?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      compliance_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      credit_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          description: string | null
          id: string
          related_order_id: string | null
          related_subscription_id: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          description?: string | null
          id?: string
          related_order_id?: string | null
          related_subscription_id?: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          description?: string | null
          id?: string
          related_order_id?: string | null
          related_subscription_id?: string | null
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_transactions_related_subscription_id_fkey"
            columns: ["related_subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard_entries: {
        Row: {
          calculated_at: string
          id: string
          leaderboard_id: string
          portfolio_id: string | null
          rank: number
          score: number
          user_id: string
        }
        Insert: {
          calculated_at?: string
          id?: string
          leaderboard_id: string
          portfolio_id?: string | null
          rank: number
          score: number
          user_id: string
        }
        Update: {
          calculated_at?: string
          id?: string
          leaderboard_id?: string
          portfolio_id?: string | null
          rank?: number
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_entries_leaderboard_id_fkey"
            columns: ["leaderboard_id"]
            isOneToOne: false
            referencedRelation: "leaderboards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leaderboard_entries_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboards: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          metric: string
          name: string
          period: string
          start_date: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          metric: string
          name: string
          period?: string
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          metric?: string
          name?: string
          period?: string
          start_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          is_sent: boolean | null
          message: string
          notification_type: Database["public"]["Enums"]["notification_type"]
          read_at: string | null
          related_entity_id: string | null
          related_entity_type: string | null
          sent_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          is_sent?: boolean | null
          message: string
          notification_type: Database["public"]["Enums"]["notification_type"]
          read_at?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          sent_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          is_sent?: boolean | null
          message?: string
          notification_type?: Database["public"]["Enums"]["notification_type"]
          read_at?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          sent_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          execution_time: string | null
          expires_at: string | null
          fees: number | null
          filled_price: number | null
          filled_quantity: number | null
          id: string
          order_type: Database["public"]["Enums"]["order_type"]
          portfolio_id: string
          price: number | null
          quantity: number
          side: string
          slippage: number | null
          status: Database["public"]["Enums"]["order_status"]
          stock_id: string
          stop_price: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          execution_time?: string | null
          expires_at?: string | null
          fees?: number | null
          filled_price?: number | null
          filled_quantity?: number | null
          id?: string
          order_type: Database["public"]["Enums"]["order_type"]
          portfolio_id: string
          price?: number | null
          quantity: number
          side: string
          slippage?: number | null
          status?: Database["public"]["Enums"]["order_status"]
          stock_id: string
          stop_price?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          execution_time?: string | null
          expires_at?: string | null
          fees?: number | null
          filled_price?: number | null
          filled_quantity?: number | null
          id?: string
          order_type?: Database["public"]["Enums"]["order_type"]
          portfolio_id?: string
          price?: number | null
          quantity?: number
          side?: string
          slippage?: number | null
          status?: Database["public"]["Enums"]["order_status"]
          stock_id?: string
          stop_price?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_stock_id_fkey"
            columns: ["stock_id"]
            isOneToOne: false
            referencedRelation: "stocks"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_holdings: {
        Row: {
          avg_buy_price: number
          created_at: string
          current_price: number
          id: string
          last_updated: string | null
          market_value: number
          portfolio_id: string
          quantity: number
          stock_id: string
          unrealized_pnl: number
          unrealized_pnl_percent: number
          updated_at: string
        }
        Insert: {
          avg_buy_price: number
          created_at?: string
          current_price: number
          id?: string
          last_updated?: string | null
          market_value: number
          portfolio_id: string
          quantity?: number
          stock_id: string
          unrealized_pnl?: number
          unrealized_pnl_percent?: number
          updated_at?: string
        }
        Update: {
          avg_buy_price?: number
          created_at?: string
          current_price?: number
          id?: string
          last_updated?: string | null
          market_value?: number
          portfolio_id?: string
          quantity?: number
          stock_id?: string
          unrealized_pnl?: number
          unrealized_pnl_percent?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_holdings_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolio_holdings_stock_id_fkey"
            columns: ["stock_id"]
            isOneToOne: false
            referencedRelation: "stocks"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolios: {
        Row: {
          created_at: string
          current_balance: number
          day_change: number
          day_change_percent: number
          description: string | null
          id: string
          initial_balance: number
          is_active: boolean | null
          name: string
          total_invested: number
          total_returns: number
          total_returns_percent: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_balance?: number
          day_change?: number
          day_change_percent?: number
          description?: string | null
          id?: string
          initial_balance?: number
          is_active?: boolean | null
          name?: string
          total_invested?: number
          total_returns?: number
          total_returns_percent?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_balance?: number
          day_change?: number
          day_change_percent?: number
          description?: string | null
          id?: string
          initial_balance?: number
          is_active?: boolean | null
          name?: string
          total_invested?: number
          total_returns?: number
          total_returns_percent?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country: string | null
          created_at: string
          email: string
          experience_level:
            | Database["public"]["Enums"]["experience_level"]
            | null
          full_name: string | null
          id: string
          investment_goals:
            | Database["public"]["Enums"]["investment_goal"][]
            | null
          is_onboarded: boolean | null
          phone: string | null
          risk_tolerance: number | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          email: string
          experience_level?:
            | Database["public"]["Enums"]["experience_level"]
            | null
          full_name?: string | null
          id?: string
          investment_goals?:
            | Database["public"]["Enums"]["investment_goal"][]
            | null
          is_onboarded?: boolean | null
          phone?: string | null
          risk_tolerance?: number | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          email?: string
          experience_level?:
            | Database["public"]["Enums"]["experience_level"]
            | null
          full_name?: string | null
          id?: string
          investment_goals?:
            | Database["public"]["Enums"]["investment_goal"][]
            | null
          is_onboarded?: boolean | null
          phone?: string | null
          risk_tolerance?: number | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      protips: {
        Row: {
          category: string
          content: string
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean | null
          priority: number | null
          title: string
          trigger_conditions: Json | null
          updated_at: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          priority?: number | null
          title: string
          trigger_conditions?: Json | null
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          priority?: number | null
          title?: string
          trigger_conditions?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      stocks: {
        Row: {
          avg_volume: number | null
          created_at: string
          current_price: number | null
          exchange: string
          id: string
          industry: string | null
          is_active: boolean | null
          last_updated: string | null
          market_cap: number | null
          name: string
          price_change: number | null
          price_change_percent: number | null
          sector: string | null
          symbol: string
          updated_at: string
          volume: number | null
        }
        Insert: {
          avg_volume?: number | null
          created_at?: string
          current_price?: number | null
          exchange: string
          id?: string
          industry?: string | null
          is_active?: boolean | null
          last_updated?: string | null
          market_cap?: number | null
          name: string
          price_change?: number | null
          price_change_percent?: number | null
          sector?: string | null
          symbol: string
          updated_at?: string
          volume?: number | null
        }
        Update: {
          avg_volume?: number | null
          created_at?: string
          current_price?: number | null
          exchange?: string
          id?: string
          industry?: string | null
          is_active?: boolean | null
          last_updated?: string | null
          market_cap?: number | null
          name?: string
          price_change?: number | null
          price_change_percent?: number | null
          sector?: string | null
          symbol?: string
          updated_at?: string
          volume?: number | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          analytics_enabled: boolean | null
          billing_period: string
          created_at: string
          credits_allocated: number
          currency: string
          custom_features: Json | null
          id: string
          is_active: boolean | null
          max_positions: number
          name: string
          plan_type: Database["public"]["Enums"]["plan_type"]
          price: number
          priority_support: boolean | null
          protips_enabled: boolean | null
          updated_at: string
        }
        Insert: {
          analytics_enabled?: boolean | null
          billing_period?: string
          created_at?: string
          credits_allocated?: number
          currency?: string
          custom_features?: Json | null
          id?: string
          is_active?: boolean | null
          max_positions?: number
          name: string
          plan_type: Database["public"]["Enums"]["plan_type"]
          price?: number
          priority_support?: boolean | null
          protips_enabled?: boolean | null
          updated_at?: string
        }
        Update: {
          analytics_enabled?: boolean | null
          billing_period?: string
          created_at?: string
          credits_allocated?: number
          currency?: string
          custom_features?: Json | null
          id?: string
          is_active?: boolean | null
          max_positions?: number
          name?: string
          plan_type?: Database["public"]["Enums"]["plan_type"]
          price?: number
          priority_support?: boolean | null
          protips_enabled?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      trades: {
        Row: {
          created_at: string
          executed_at: string
          fees: number
          id: string
          order_id: string
          portfolio_id: string
          price: number
          quantity: number
          realized_pnl: number | null
          side: string
          stock_id: string
          total_amount: number
          user_id: string
        }
        Insert: {
          created_at?: string
          executed_at?: string
          fees?: number
          id?: string
          order_id: string
          portfolio_id: string
          price: number
          quantity: number
          realized_pnl?: number | null
          side: string
          stock_id: string
          total_amount: number
          user_id: string
        }
        Update: {
          created_at?: string
          executed_at?: string
          fees?: number
          id?: string
          order_id?: string
          portfolio_id?: string
          price?: number
          quantity?: number
          realized_pnl?: number | null
          side?: string
          stock_id?: string
          total_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trades_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trades_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trades_stock_id_fkey"
            columns: ["stock_id"]
            isOneToOne: false
            referencedRelation: "stocks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          progress: number | null
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          progress?: number | null
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          progress?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_challenges: {
        Row: {
          challenge_id: string
          claimed_at: string | null
          completed_at: string | null
          current_value: number | null
          id: string
          progress: number | null
          reward_claimed: boolean | null
          started_at: string
          status: Database["public"]["Enums"]["challenge_status"]
          user_id: string
        }
        Insert: {
          challenge_id: string
          claimed_at?: string | null
          completed_at?: string | null
          current_value?: number | null
          id?: string
          progress?: number | null
          reward_claimed?: boolean | null
          started_at?: string
          status?: Database["public"]["Enums"]["challenge_status"]
          user_id: string
        }
        Update: {
          challenge_id?: string
          claimed_at?: string | null
          completed_at?: string | null
          current_value?: number | null
          id?: string
          progress?: number | null
          reward_claimed?: boolean | null
          started_at?: string
          status?: Database["public"]["Enums"]["challenge_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenges_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_credits: {
        Row: {
          available_credits: number
          created_at: string
          id: string
          last_topup_at: string | null
          total_credits_earned: number
          total_credits_spent: number
          updated_at: string
          user_id: string
        }
        Insert: {
          available_credits?: number
          created_at?: string
          id?: string
          last_topup_at?: string | null
          total_credits_earned?: number
          total_credits_spent?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          available_credits?: number
          created_at?: string
          id?: string
          last_topup_at?: string | null
          total_credits_earned?: number
          total_credits_spent?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_protips: {
        Row: {
          created_at: string
          dismissed_at: string | null
          id: string
          is_dismissed: boolean | null
          is_read: boolean | null
          protip_id: string
          read_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          dismissed_at?: string | null
          id?: string
          is_dismissed?: boolean | null
          is_read?: boolean | null
          protip_id: string
          read_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          dismissed_at?: string | null
          id?: string
          is_dismissed?: boolean | null
          is_read?: boolean | null
          protip_id?: string
          read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_protips_protip_id_fkey"
            columns: ["protip_id"]
            isOneToOne: false
            referencedRelation: "protips"
            referencedColumns: ["id"]
          },
        ]
      }
      user_subscriptions: {
        Row: {
          cancelled_at: string | null
          created_at: string
          expires_at: string | null
          id: string
          plan_id: string
          started_at: string
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancelled_at?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_id: string
          started_at?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancelled_at?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_id?: string
          started_at?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      challenge_status: "active" | "completed" | "failed" | "expired"
      experience_level: "beginner" | "intermediate" | "advanced" | "expert"
      investment_goal:
        | "learning"
        | "income"
        | "growth"
        | "retirement"
        | "speculation"
      notification_type:
        | "price_alert"
        | "portfolio_update"
        | "risk_warning"
        | "challenge"
        | "tip"
        | "system"
      order_status: "pending" | "executed" | "cancelled" | "rejected"
      order_type: "market" | "limit" | "stop_loss" | "oco"
      plan_type: "free" | "pro" | "custom"
      subscription_status: "active" | "inactive" | "cancelled" | "expired"
      transaction_type: "credit" | "debit" | "bonus" | "refund" | "purchase"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      challenge_status: ["active", "completed", "failed", "expired"],
      experience_level: ["beginner", "intermediate", "advanced", "expert"],
      investment_goal: [
        "learning",
        "income",
        "growth",
        "retirement",
        "speculation",
      ],
      notification_type: [
        "price_alert",
        "portfolio_update",
        "risk_warning",
        "challenge",
        "tip",
        "system",
      ],
      order_status: ["pending", "executed", "cancelled", "rejected"],
      order_type: ["market", "limit", "stop_loss", "oco"],
      plan_type: ["free", "pro", "custom"],
      subscription_status: ["active", "inactive", "cancelled", "expired"],
      transaction_type: ["credit", "debit", "bonus", "refund", "purchase"],
    },
  },
} as const
