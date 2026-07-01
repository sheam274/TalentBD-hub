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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      application_messages: {
        Row: {
          application_id: string
          body: string
          created_at: string
          id: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          application_id: string
          body: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          application_id?: string
          body?: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_messages_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "job_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      appointment_letters: {
        Row: {
          accepted_at: string | null
          application_id: string
          body: string
          id: string
          issued_at: string
          issued_by: string
          position: string
          salary: string | null
          start_date: string | null
        }
        Insert: {
          accepted_at?: string | null
          application_id: string
          body: string
          id?: string
          issued_at?: string
          issued_by: string
          position: string
          salary?: string | null
          start_date?: string | null
        }
        Update: {
          accepted_at?: string | null
          application_id?: string
          body?: string
          id?: string
          issued_at?: string
          issued_by?: string
          position?: string
          salary?: string | null
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointment_letters_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "job_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          description: string | null
          id: string
          industry: string | null
          location: string | null
          logo_url: string | null
          name: string
          slug: string
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string
          website?: string | null
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
      cv_records: {
        Row: {
          builder_payload: Json
          id: string
          selected_style: string
          updated_at: string
          user_id: string
        }
        Insert: {
          builder_payload?: Json
          id?: string
          selected_style?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          builder_payload?: Json
          id?: string
          selected_style?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      external_jobs_cache: {
        Row: {
          category: string | null
          company: string
          company_logo: string | null
          external_id: string
          fetched_at: string
          id: string
          is_remote: boolean
          job_type: string | null
          location: string | null
          normalized_category: string | null
          publication_date: string | null
          salary: string | null
          source: string
          tags: string[]
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          category?: string | null
          company: string
          company_logo?: string | null
          external_id: string
          fetched_at?: string
          id?: string
          is_remote?: boolean
          job_type?: string | null
          location?: string | null
          normalized_category?: string | null
          publication_date?: string | null
          salary?: string | null
          source: string
          tags?: string[]
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          category?: string | null
          company?: string
          company_logo?: string | null
          external_id?: string
          fetched_at?: string
          id?: string
          is_remote?: boolean
          job_type?: string | null
          location?: string | null
          normalized_category?: string | null
          publication_date?: string | null
          salary?: string | null
          source?: string
          tags?: string[]
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      interview_answers: {
        Row: {
          answer_text: string | null
          created_at: string
          evaluated_at: string | null
          feedback: string | null
          id: string
          media_path: string | null
          question_id: string
          score: number | null
          session_id: string
          strengths: string | null
          transcript: string | null
          weaknesses: string | null
        }
        Insert: {
          answer_text?: string | null
          created_at?: string
          evaluated_at?: string | null
          feedback?: string | null
          id?: string
          media_path?: string | null
          question_id: string
          score?: number | null
          session_id: string
          strengths?: string | null
          transcript?: string | null
          weaknesses?: string | null
        }
        Update: {
          answer_text?: string | null
          created_at?: string
          evaluated_at?: string | null
          feedback?: string | null
          id?: string
          media_path?: string | null
          question_id?: string
          score?: number | null
          session_id?: string
          strengths?: string | null
          transcript?: string | null
          weaknesses?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interview_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: true
            referencedRelation: "interview_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interview_answers_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "interview_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_invitations: {
        Row: {
          application_id: string
          created_at: string
          created_by: string
          id: string
          meeting_url: string
          notes: string | null
          provider: string | null
          scheduled_at: string
          status: string
        }
        Insert: {
          application_id: string
          created_at?: string
          created_by: string
          id?: string
          meeting_url: string
          notes?: string | null
          provider?: string | null
          scheduled_at: string
          status?: string
        }
        Update: {
          application_id?: string
          created_at?: string
          created_by?: string
          id?: string
          meeting_url?: string
          notes?: string | null
          provider?: string | null
          scheduled_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "interview_invitations_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "job_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_questions: {
        Row: {
          choices: Json | null
          correct_answer: string | null
          created_at: string
          expected_topic: string | null
          id: string
          idx: number
          prompt: string
          question_type: string
          session_id: string
        }
        Insert: {
          choices?: Json | null
          correct_answer?: string | null
          created_at?: string
          expected_topic?: string | null
          id?: string
          idx: number
          prompt: string
          question_type?: string
          session_id: string
        }
        Update: {
          choices?: Json | null
          correct_answer?: string | null
          created_at?: string
          expected_topic?: string | null
          id?: string
          idx?: number
          prompt?: string
          question_type?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interview_questions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "interview_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_sessions: {
        Row: {
          completed_at: string | null
          difficulty: string
          discipline: string
          id: string
          mode: string
          overall_feedback: string | null
          role: string
          score: number | null
          started_at: string
          status: string
          total_questions: number
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          difficulty: string
          discipline: string
          id?: string
          mode: string
          overall_feedback?: string | null
          role: string
          score?: number | null
          started_at?: string
          status?: string
          total_questions?: number
          user_id: string
        }
        Update: {
          completed_at?: string | null
          difficulty?: string
          discipline?: string
          id?: string
          mode?: string
          overall_feedback?: string | null
          role?: string
          score?: number | null
          started_at?: string
          status?: string
          total_questions?: number
          user_id?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          cover_note: string | null
          created_at: string
          id: string
          job_id: string
          stage: Database["public"]["Enums"]["application_stage"]
          stage_updated_at: string
          status: string
          user_id: string
        }
        Insert: {
          cover_note?: string | null
          created_at?: string
          id?: string
          job_id: string
          stage?: Database["public"]["Enums"]["application_stage"]
          stage_updated_at?: string
          status?: string
          user_id: string
        }
        Update: {
          cover_note?: string | null
          created_at?: string
          id?: string
          job_id?: string
          stage?: Database["public"]["Enums"]["application_stage"]
          stage_updated_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_marketplace"
            referencedColumns: ["id"]
          },
        ]
      }
      job_marketplace: {
        Row: {
          application_deadline: string | null
          category: string | null
          company: string
          company_id: string | null
          created_at: string
          description: string | null
          discipline: string | null
          experience_level: string | null
          id: string
          is_featured: boolean
          is_live: boolean
          is_remote: boolean
          job_title: string
          job_type: string | null
          location: string | null
          requirements: string[]
          salary_range: string | null
        }
        Insert: {
          application_deadline?: string | null
          category?: string | null
          company: string
          company_id?: string | null
          created_at?: string
          description?: string | null
          discipline?: string | null
          experience_level?: string | null
          id?: string
          is_featured?: boolean
          is_live?: boolean
          is_remote?: boolean
          job_title: string
          job_type?: string | null
          location?: string | null
          requirements?: string[]
          salary_range?: string | null
        }
        Update: {
          application_deadline?: string | null
          category?: string | null
          company?: string
          company_id?: string | null
          created_at?: string
          description?: string | null
          discipline?: string | null
          experience_level?: string | null
          id?: string
          is_featured?: boolean
          is_live?: boolean
          is_remote?: boolean
          job_title?: string
          job_type?: string | null
          location?: string | null
          requirements?: string[]
          salary_range?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_marketplace_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_modules: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          discipline: string
          documentation_body: string | null
          id: string
          resources: Json
          section_slug: string
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          discipline: string
          documentation_body?: string | null
          id?: string
          resources?: Json
          section_slug: string
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          discipline?: string
          documentation_body?: string | null
          id?: string
          resources?: Json
          section_slug?: string
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          discipline: string | null
          id: string
          name: string | null
          skills: string[]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          discipline?: string | null
          id: string
          name?: string | null
          skills?: string[]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          discipline?: string | null
          id?: string
          name?: string | null
          skills?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      skill_quizzes: {
        Row: {
          choices: string[]
          correct_answer: string
          created_at: string
          id: string
          module_id: string
          question: string
        }
        Insert: {
          choices: string[]
          correct_answer: string
          created_at?: string
          id?: string
          module_id: string
          question: string
        }
        Update: {
          choices?: string[]
          correct_answer?: string
          created_at?: string
          id?: string
          module_id?: string
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_quizzes_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "learning_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      user_credentials: {
        Row: {
          credential_name: string
          id: string
          module_id: string | null
          score: number
          user_id: string
          verified_at: string
        }
        Insert: {
          credential_name: string
          id?: string
          module_id?: string | null
          score: number
          user_id: string
          verified_at?: string
        }
        Update: {
          credential_name?: string
          id?: string
          module_id?: string | null
          score?: number
          user_id?: string
          verified_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_credentials_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "learning_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      default_company_logo: { Args: { _name: string }; Returns: string }
      is_super_admin_email: { Args: { _email: string }; Returns: boolean }
      slugify_company: { Args: { _name: string }; Returns: string }
    }
    Enums: {
      app_role: "admin" | "student" | "employer"
      application_stage:
        | "applied"
        | "screening"
        | "interview"
        | "offer"
        | "hired"
        | "rejected"
        | "withdrawn"
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
      app_role: ["admin", "student", "employer"],
      application_stage: [
        "applied",
        "screening",
        "interview",
        "offer",
        "hired",
        "rejected",
        "withdrawn",
      ],
    },
  },
} as const
