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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      blood_inventory: {
        Row: {
          blood_group: Database["public"]["Enums"]["blood_group_type"]
          id: string
          last_updated: string | null
          units_available: number | null
        }
        Insert: {
          blood_group: Database["public"]["Enums"]["blood_group_type"]
          id?: string
          last_updated?: string | null
          units_available?: number | null
        }
        Update: {
          blood_group?: Database["public"]["Enums"]["blood_group_type"]
          id?: string
          last_updated?: string | null
          units_available?: number | null
        }
        Relationships: []
      }
      blood_requests: {
        Row: {
          blood_group: Database["public"]["Enums"]["blood_group_type"]
          contact: string
          hospital_name: string
          id: string
          processed_at: string | null
          requested_at: string | null
          status: string | null
          units_requested: number
          urgency: string | null
        }
        Insert: {
          blood_group: Database["public"]["Enums"]["blood_group_type"]
          contact: string
          hospital_name: string
          id?: string
          processed_at?: string | null
          requested_at?: string | null
          status?: string | null
          units_requested: number
          urgency?: string | null
        }
        Update: {
          blood_group?: Database["public"]["Enums"]["blood_group_type"]
          contact?: string
          hospital_name?: string
          id?: string
          processed_at?: string | null
          requested_at?: string | null
          status?: string | null
          units_requested?: number
          urgency?: string | null
        }
        Relationships: []
      }
      donations: {
        Row: {
          blood_group: Database["public"]["Enums"]["blood_group_type"]
          created_at: string | null
          donation_date: string | null
          donor_id: string
          id: string
          notes: string | null
          quantity_ml: number
          status: string | null
        }
        Insert: {
          blood_group: Database["public"]["Enums"]["blood_group_type"]
          created_at?: string | null
          donation_date?: string | null
          donor_id: string
          id?: string
          notes?: string | null
          quantity_ml?: number
          status?: string | null
        }
        Update: {
          blood_group?: Database["public"]["Enums"]["blood_group_type"]
          created_at?: string | null
          donation_date?: string | null
          donor_id?: string
          id?: string
          notes?: string | null
          quantity_ml?: number
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["id"]
          },
        ]
      }
      donors: {
        Row: {
          address: string | null
          age: number
          blood_group: Database["public"]["Enums"]["blood_group_type"]
          contact: string
          created_at: string | null
          email: string | null
          gender: Database["public"]["Enums"]["gender_type"]
          id: string
          last_donation_date: string | null
          name: string
          status: Database["public"]["Enums"]["donor_status"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          age: number
          blood_group: Database["public"]["Enums"]["blood_group_type"]
          contact: string
          created_at?: string | null
          email?: string | null
          gender: Database["public"]["Enums"]["gender_type"]
          id?: string
          last_donation_date?: string | null
          name: string
          status?: Database["public"]["Enums"]["donor_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          age?: number
          blood_group?: Database["public"]["Enums"]["blood_group_type"]
          contact?: string
          created_at?: string | null
          email?: string | null
          gender?: Database["public"]["Enums"]["gender_type"]
          id?: string
          last_donation_date?: string | null
          name?: string
          status?: Database["public"]["Enums"]["donor_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      screening_records: {
        Row: {
          blood_pressure: string | null
          donor_id: string
          hemoglobin: number | null
          id: string
          notes: string | null
          pulse: number | null
          screened_at: string | null
          screened_by: string | null
          screening_result: string | null
          temperature: number | null
          weight: number | null
        }
        Insert: {
          blood_pressure?: string | null
          donor_id: string
          hemoglobin?: number | null
          id?: string
          notes?: string | null
          pulse?: number | null
          screened_at?: string | null
          screened_by?: string | null
          screening_result?: string | null
          temperature?: number | null
          weight?: number | null
        }
        Update: {
          blood_pressure?: string | null
          donor_id?: string
          hemoglobin?: number | null
          id?: string
          notes?: string | null
          pulse?: number | null
          screened_at?: string | null
          screened_by?: string | null
          screening_result?: string | null
          temperature?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "screening_records_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
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
      blood_group_type: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
      donor_status:
        | "Eligible"
        | "In Screening Queue"
        | "Not Eligible"
        | "Permanently Defer"
        | "Ready for Collection"
        | "Donation Failed"
        | "Donation Success"
      gender_type: "M" | "F" | "O"
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
      blood_group_type: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      donor_status: [
        "Eligible",
        "In Screening Queue",
        "Not Eligible",
        "Permanently Defer",
        "Ready for Collection",
        "Donation Failed",
        "Donation Success",
      ],
      gender_type: ["M", "F", "O"],
    },
  },
} as const
