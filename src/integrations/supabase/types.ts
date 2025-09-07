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
          user_progress: Json | null
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
          user_progress?: Json | null
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
          user_progress?: Json | null
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
          active_challenges: Json | null
          avatar_url: string | null
          badges_earned: Json | null
          country: string | null
          created_at: string
          credits_available: number | null
          credits_total_earned: number | null
          credits_total_spent: number | null
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
          last_credit_topup: string | null
          phone: string | null
          protips_seen: Json | null
          risk_tolerance: number | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active_challenges?: Json | null
          avatar_url?: string | null
          badges_earned?: Json | null
          country?: string | null
          created_at?: string
          credits_available?: number | null
          credits_total_earned?: number | null
          credits_total_spent?: number | null
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
          last_credit_topup?: string | null
          phone?: string | null
          protips_seen?: Json | null
          risk_tolerance?: number | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          active_challenges?: Json | null
          avatar_url?: string | null
          badges_earned?: Json | null
          country?: string | null
          created_at?: string
          credits_available?: number | null
          credits_total_earned?: number | null
          credits_total_spent?: number | null
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
          last_credit_topup?: string | null
          phone?: string | null
          protips_seen?: Json | null
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
          user_interactions: Json | null
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
          user_interactions?: Json | null
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
          user_interactions?: Json | null
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
      subscriptions: {
        Row: {
          cancelled_at: string | null
          created_at: string
          credit_transactions: Json | null
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
          credit_transactions?: Json | null
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
          credit_transactions?: Json | null
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
