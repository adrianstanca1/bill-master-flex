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
      asset_tracking: {
        Row: {
          asset_name: string
          asset_type: string
          assigned_to: string | null
          company_id: string
          condition: string | null
          created_at: string
          current_location: string | null
          id: string
          last_service_date: string | null
          next_service_due: string | null
          photos: Json | null
          project_id: string | null
          purchase_cost: number | null
          purchase_date: string | null
          serial_number: string | null
          status: string
          updated_at: string
        }
        Insert: {
          asset_name: string
          asset_type: string
          assigned_to?: string | null
          company_id: string
          condition?: string | null
          created_at?: string
          current_location?: string | null
          id?: string
          last_service_date?: string | null
          next_service_due?: string | null
          photos?: Json | null
          project_id?: string | null
          purchase_cost?: number | null
          purchase_date?: string | null
          serial_number?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          asset_name?: string
          asset_type?: string
          assigned_to?: string | null
          company_id?: string
          condition?: string | null
          created_at?: string
          current_location?: string | null
          id?: string
          last_service_date?: string | null
          next_service_due?: string | null
          photos?: Json | null
          project_id?: string | null
          purchase_cost?: number | null
          purchase_date?: string | null
          serial_number?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      checklist_responses: {
        Row: {
          checklist_id: string
          created_at: string
          id: string
          response: Json | null
          template_item_id: string
        }
        Insert: {
          checklist_id: string
          created_at?: string
          id?: string
          response?: Json | null
          template_item_id: string
        }
        Update: {
          checklist_id?: string
          created_at?: string
          id?: string
          response?: Json | null
          template_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_responses_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "task_checklists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checklist_responses_template_item_id_fkey"
            columns: ["template_item_id"]
            isOneToOne: false
            referencedRelation: "checklist_template_items"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_template_items: {
        Row: {
          created_at: string
          id: string
          idx: number
          input_type: string
          question: string
          required: boolean
          template_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          idx?: number
          input_type: string
          question: string
          required?: boolean
          template_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          idx?: number
          input_type?: string
          question?: string
          required?: boolean
          template_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_template_items_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "checklist_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_templates: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          address: string | null
          company_id: string
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          company_id: string
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          company_id?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
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
      dayworks: {
        Row: {
          company_id: string
          created_at: string
          created_by: string | null
          crew_size: number | null
          date: string
          equipment_used: Json | null
          id: string
          materials_used: Json | null
          photos: Json | null
          progress_percentage: number | null
          project_id: string | null
          updated_at: string
          weather: string | null
          work_description: string
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by?: string | null
          crew_size?: number | null
          date?: string
          equipment_used?: Json | null
          id?: string
          materials_used?: Json | null
          photos?: Json | null
          progress_percentage?: number | null
          project_id?: string | null
          updated_at?: string
          weather?: string | null
          work_description: string
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string | null
          crew_size?: number | null
          date?: string
          equipment_used?: Json | null
          id?: string
          materials_used?: Json | null
          photos?: Json | null
          progress_percentage?: number | null
          project_id?: string | null
          updated_at?: string
          weather?: string | null
          work_description?: string
        }
        Relationships: []
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
      profiles: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      project_tools: {
        Row: {
          created_at: string
          id: string
          project_id: string
          tool_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          tool_id: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          tool_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_tools_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tools_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          client: string | null
          company_id: string
          created_at: string
          end_date: string | null
          id: string
          location: string | null
          meta: Json
          name: string
          project_manager_user_id: string | null
          start_date: string | null
          updated_at: string
        }
        Insert: {
          client?: string | null
          company_id: string
          created_at?: string
          end_date?: string | null
          id?: string
          location?: string | null
          meta?: Json
          name: string
          project_manager_user_id?: string | null
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          client?: string | null
          company_id?: string
          created_at?: string
          end_date?: string | null
          id?: string
          location?: string | null
          meta?: Json
          name?: string
          project_manager_user_id?: string | null
          start_date?: string | null
          updated_at?: string
        }
        Relationships: []
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
      rams_documents: {
        Row: {
          activity_type: string
          approval_status: string
          approved_at: string | null
          approved_by: string | null
          company_id: string
          control_measures: Json
          created_at: string
          created_by: string | null
          hazards: Json
          id: string
          method_statement: string | null
          ppe_required: Json | null
          project_id: string | null
          risk_level: string
          title: string
          updated_at: string
        }
        Insert: {
          activity_type: string
          approval_status?: string
          approved_at?: string | null
          approved_by?: string | null
          company_id: string
          control_measures?: Json
          created_at?: string
          created_by?: string | null
          hazards?: Json
          id?: string
          method_statement?: string | null
          ppe_required?: Json | null
          project_id?: string | null
          risk_level?: string
          title: string
          updated_at?: string
        }
        Update: {
          activity_type?: string
          approval_status?: string
          approved_at?: string | null
          approved_by?: string | null
          company_id?: string
          control_measures?: Json
          created_at?: string
          created_by?: string | null
          hazards?: Json
          id?: string
          method_statement?: string | null
          ppe_required?: Json | null
          project_id?: string | null
          risk_level?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      reminders: {
        Row: {
          assigned_to: string | null
          category: string
          company_id: string
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string
          id: string
          priority: string
          project_id: string | null
          recurring: boolean | null
          recurring_pattern: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string
          company_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date: string
          id?: string
          priority?: string
          project_id?: string | null
          recurring?: boolean | null
          recurring_pattern?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          category?: string
          company_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string
          id?: string
          priority?: string
          project_id?: string | null
          recurring?: boolean | null
          recurring_pattern?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
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
      security_audit_log: {
        Row: {
          action: string
          company_id: string | null
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          company_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          company_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      site_photos: {
        Row: {
          ai_analysis: Json | null
          caption: string | null
          company_id: string
          created_at: string
          id: string
          location: Json | null
          photo_date: string
          project_id: string | null
          tags: Json | null
          taken_by: string | null
          url: string
        }
        Insert: {
          ai_analysis?: Json | null
          caption?: string | null
          company_id: string
          created_at?: string
          id?: string
          location?: Json | null
          photo_date?: string
          project_id?: string | null
          tags?: Json | null
          taken_by?: string | null
          url: string
        }
        Update: {
          ai_analysis?: Json | null
          caption?: string | null
          company_id?: string
          created_at?: string
          id?: string
          location?: Json | null
          photo_date?: string
          project_id?: string | null
          tags?: Json | null
          taken_by?: string | null
          url?: string
        }
        Relationships: []
      }
      task_checklists: {
        Row: {
          completed_by: string | null
          id: string
          submitted_at: string
          task_id: string
        }
        Insert: {
          completed_by?: string | null
          id?: string
          submitted_at?: string
          task_id: string
        }
        Update: {
          completed_by?: string | null
          id?: string
          submitted_at?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_checklists_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          checklist_template_id: string | null
          created_at: string
          due_on: string
          id: string
          kind: string
          payload: Json | null
          project_id: string | null
          schedule_id: string
          status: string
          time: string | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          checklist_template_id?: string | null
          created_at?: string
          due_on: string
          id?: string
          kind: string
          payload?: Json | null
          project_id?: string | null
          schedule_id: string
          status?: string
          time?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          checklist_template_id?: string | null
          created_at?: string
          due_on?: string
          id?: string
          kind?: string
          payload?: Json | null
          project_id?: string | null
          schedule_id?: string
          status?: string
          time?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_checklist_template_id_fkey"
            columns: ["checklist_template_id"]
            isOneToOne: false
            referencedRelation: "checklist_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
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
      timesheets: {
        Row: {
          break_duration: number | null
          company_id: string
          created_at: string
          description: string | null
          end_time: string | null
          id: string
          location: Json | null
          project_id: string | null
          start_time: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          break_duration?: number | null
          company_id: string
          created_at?: string
          description?: string | null
          end_time?: string | null
          id?: string
          location?: Json | null
          project_id?: string | null
          start_time: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          break_duration?: number | null
          company_id?: string
          created_at?: string
          description?: string | null
          end_time?: string | null
          id?: string
          location?: Json | null
          project_id?: string | null
          start_time?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tools: {
        Row: {
          company_id: string
          created_at: string
          id: string
          meta: Json
          name: string
          serial: string | null
          type: string | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          meta?: Json
          name: string
          serial?: string | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          meta?: Json
          name?: string
          serial?: string | null
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      variations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          items: Json
          project_id: string
          status: string
          title: string
          total: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          items?: Json
          project_id: string
          status?: string
          title: string
          total?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          items?: Json
          project_id?: string
          status?: string
          title?: string
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "variations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
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
      is_checklist_company_member: {
        Args: { _checklist_id: string }
        Returns: boolean
      }
      is_company_admin: {
        Args: { _company_id: string }
        Returns: boolean
      }
      is_company_member: {
        Args: { _company_id: string }
        Returns: boolean
      }
      is_invoice_company_member: {
        Args: { _invoice_id: string }
        Returns: boolean
      }
      is_project_company_member: {
        Args: { _project_id: string }
        Returns: boolean
      }
      is_schedule_company_member: {
        Args: { _schedule_id: string }
        Returns: boolean
      }
      is_task_company_member: {
        Args: { _task_id: string }
        Returns: boolean
      }
      is_template_company_member: {
        Args: { _template_id: string }
        Returns: boolean
      }
      is_tender_company_member: {
        Args: { _tender_id: string }
        Returns: boolean
      }
      test_rls_policies: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          policy_test: string
          result: boolean
        }[]
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
