export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      companies: {
        Row: {
          country: string
          created_at: string
          id: string
          industry: string
          name: string
          owner_user_id: string
          settings: Json
          updated_at: string
        }
        Insert: {
          country?: string
          created_at?: string
          id?: string
          industry?: string
          name: string
          owner_user_id: string
          settings?: Json
          updated_at?: string
        }
        Update: {
          country?: string
          created_at?: string
          id?: string
          industry?: string
          name?: string
          owner_user_id?: string
          settings?: Json
          updated_at?: string
        }
        Relationships: []
      }
      company_members: {
        Row: {
          company_id: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          ai_tags: Json | null
          amount: number
          category: string | null
          company_id: string
          created_at: string
          id: string
          project_id: string | null
          supplier: string | null
          txn_date: string
          updated_at: string
        }
        Insert: {
          ai_tags?: Json | null
          amount: number
          category?: string | null
          company_id: string
          created_at?: string
          id?: string
          project_id?: string | null
          supplier?: string | null
          txn_date?: string
          updated_at?: string
        }
        Update: {
          ai_tags?: Json | null
          amount?: number
          category?: string | null
          company_id?: string
          created_at?: string
          id?: string
          project_id?: string | null
          supplier?: string | null
          txn_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          client: string | null
          company_id: string
          created_at: string
          due_date: string | null
          id: string
          meta: Json
          number: string
          status: string
          total: number
          updated_at: string
        }
        Insert: {
          client?: string | null
          company_id: string
          created_at?: string
          due_date?: string | null
          id?: string
          meta?: Json
          number: string
          status?: string
          total?: number
          updated_at?: string
        }
        Update: {
          client?: string | null
          company_id?: string
          created_at?: string
          due_date?: string | null
          id?: string
          meta?: Json
          number?: string
          status?: string
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          company_id: string
          created_at: string
          id: string
          items: Json
          status: string
          title: string
          total: number
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          items?: Json
          status?: string
          title: string
          total?: number
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          items?: Json
          status?: string
          title?: string
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      retentions: {
        Row: {
          amount: number
          created_at: string
          id: string
          invoice_id: string
          percent: number
          release_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          invoice_id: string
          percent?: number
          release_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          invoice_id?: string
          percent?: number
          release_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "retentions_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      schedules: {
        Row: {
          cadence: string
          company_id: string
          created_at: string
          created_by: string | null
          criteria: Json
          id: string
          scope: string
          updated_at: string
        }
        Insert: {
          cadence: string
          company_id: string
          created_at?: string
          created_by?: string | null
          criteria?: Json
          id?: string
          scope: string
          updated_at?: string
        }
        Update: {
          cadence?: string
          company_id?: string
          created_at?: string
          created_by?: string | null
          criteria?: Json
          id?: string
          scope?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedules_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          created_at: string
          due_on: string
          id: string
          kind: string
          payload: Json | null
          schedule_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          due_on: string
          id?: string
          kind: string
          payload?: Json | null
          schedule_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          due_on?: string
          id?: string
          kind?: string
          payload?: Json | null
          schedule_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      tender_packages: {
        Row: {
          checklist: Json | null
          created_at: string
          documents: Json | null
          id: string
          status: string
          tender_id: string
          updated_at: string
        }
        Insert: {
          checklist?: Json | null
          created_at?: string
          documents?: Json | null
          id?: string
          status?: string
          tender_id: string
          updated_at?: string
        }
        Update: {
          checklist?: Json | null
          created_at?: string
          documents?: Json | null
          id?: string
          status?: string
          tender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tender_packages_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      tenders: {
        Row: {
          agency: string | null
          company_id: string
          created_at: string
          deadline: string | null
          id: string
          scraped: Json | null
          status: string
          title: string | null
          updated_at: string
          url: string | null
        }
        Insert: {
          agency?: string | null
          company_id: string
          created_at?: string
          deadline?: string | null
          id?: string
          scraped?: Json | null
          status?: string
          title?: string | null
          updated_at?: string
          url?: string | null
        }
        Update: {
          agency?: string | null
          company_id?: string
          created_at?: string
          deadline?: string | null
          id?: string
          scraped?: Json | null
          status?: string
          title?: string | null
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      vat_schemes: {
        Row: {
          company_id: string
          country: string
          created_at: string
          effective_from: string | null
          id: string
          rules: Json
          scheme: string
          updated_at: string
        }
        Insert: {
          company_id: string
          country?: string
          created_at?: string
          effective_from?: string | null
          id?: string
          rules?: Json
          scheme: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          country?: string
          created_at?: string
          effective_from?: string | null
          id?: string
          rules?: Json
          scheme?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vat_schemes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_company_member: {
        Args: { _company_id: string }
        Returns: boolean
      }
      is_invoice_company_member: {
        Args: { _invoice_id: string }
        Returns: boolean
      }
      is_schedule_company_member: {
        Args: { _schedule_id: string }
        Returns: boolean
      }
      is_tender_company_member: {
        Args: { _tender_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
