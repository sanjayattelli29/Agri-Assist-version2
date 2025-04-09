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
      agricultural_knowledge: {
        Row: {
          content: string | null
          created_at: string
          id: string
          keywords: string
          response_en: string
          response_hi: string | null
          response_kn: string | null
          response_ml: string | null
          response_te: string | null
          source: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          keywords: string
          response_en: string
          response_hi?: string | null
          response_kn?: string | null
          response_ml?: string | null
          response_te?: string | null
          source?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          keywords?: string
          response_en?: string
          response_hi?: string | null
          response_kn?: string | null
          response_ml?: string | null
          response_te?: string | null
          source?: string | null
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          created_at: string | null
          id: string
          key: string
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          value?: string
        }
        Relationships: []
      }
      crop_predictions: {
        Row: {
          created_at: string
          humidity: number
          id: string
          latitude: number | null
          longitude: number | null
          nitrogen: number
          ph: number
          phosphorus: number
          potassium: number
          predicted_crop: string | null
          rainfall: number
          temperature: number
        }
        Insert: {
          created_at?: string
          humidity: number
          id?: string
          latitude?: number | null
          longitude?: number | null
          nitrogen: number
          ph: number
          phosphorus: number
          potassium: number
          predicted_crop?: string | null
          rainfall: number
          temperature: number
        }
        Update: {
          created_at?: string
          humidity?: number
          id?: string
          latitude?: number | null
          longitude?: number | null
          nitrogen?: number
          ph?: number
          phosphorus?: number
          potassium?: number
          predicted_crop?: string | null
          rainfall?: number
          temperature?: number
        }
        Relationships: []
      }
      crop_rotation_rules: {
        Row: {
          benefits: string | null
          created_at: string
          current_crop: string
          id: string
          next_crop: string
          notes: string | null
          rotation_months: number
        }
        Insert: {
          benefits?: string | null
          created_at?: string
          current_crop: string
          id?: string
          next_crop: string
          notes?: string | null
          rotation_months: number
        }
        Update: {
          benefits?: string | null
          created_at?: string
          current_crop?: string
          id?: string
          next_crop?: string
          notes?: string | null
          rotation_months?: number
        }
        Relationships: []
      }
      crop_suitability: {
        Row: {
          alternative_crops: Json
          created_at: string
          id: string
          instructions: string | null
          primary_crop: string
          rules: string | null
          suggestions: string | null
        }
        Insert: {
          alternative_crops: Json
          created_at?: string
          id?: string
          instructions?: string | null
          primary_crop: string
          rules?: string | null
          suggestions?: string | null
        }
        Update: {
          alternative_crops?: Json
          created_at?: string
          id?: string
          instructions?: string | null
          primary_crop?: string
          rules?: string | null
          suggestions?: string | null
        }
        Relationships: []
      }
      crop_training_data: {
        Row: {
          created_at: string
          humidity: number
          id: number
          label: string
          nitrogen: number
          ph: number
          phosphorus: number
          potassium: number
          rainfall: number
          temperature: number
        }
        Insert: {
          created_at?: string
          humidity: number
          id?: never
          label: string
          nitrogen: number
          ph: number
          phosphorus: number
          potassium: number
          rainfall: number
          temperature: number
        }
        Update: {
          created_at?: string
          humidity?: number
          id?: never
          label?: string
          nitrogen?: number
          ph?: number
          phosphorus?: number
          potassium?: number
          rainfall?: number
          temperature?: number
        }
        Relationships: []
      }
      fertilizer_products: {
        Row: {
          created_at: string | null
          crop_name: string
          high_cost_buy_link: string
          high_cost_fertilizer: string
          high_cost_image: string | null
          high_cost_rating: number
          id: number
          low_cost_buy_link: string
          low_cost_fertilizer: string
          low_cost_image: string | null
          low_cost_rating: number
          medium_cost_buy_link: string
          medium_cost_fertilizer: string
          medium_cost_image: string | null
          medium_cost_rating: number
        }
        Insert: {
          created_at?: string | null
          crop_name: string
          high_cost_buy_link: string
          high_cost_fertilizer: string
          high_cost_image?: string | null
          high_cost_rating: number
          id?: number
          low_cost_buy_link: string
          low_cost_fertilizer: string
          low_cost_image?: string | null
          low_cost_rating: number
          medium_cost_buy_link: string
          medium_cost_fertilizer: string
          medium_cost_image?: string | null
          medium_cost_rating: number
        }
        Update: {
          created_at?: string | null
          crop_name?: string
          high_cost_buy_link?: string
          high_cost_fertilizer?: string
          high_cost_image?: string | null
          high_cost_rating?: number
          id?: number
          low_cost_buy_link?: string
          low_cost_fertilizer?: string
          low_cost_image?: string | null
          low_cost_rating?: number
          medium_cost_buy_link?: string
          medium_cost_fertilizer?: string
          medium_cost_image?: string | null
          medium_cost_rating?: number
        }
        Relationships: []
      }
      pesticide_products: {
        Row: {
          created_at: string | null
          crop_name: string
          high_cost_buy_link: string
          high_cost_image: string | null
          high_cost_pesticide: string
          high_cost_rating: number
          id: number
          low_cost_buy_link: string
          low_cost_image: string | null
          low_cost_pesticide: string
          low_cost_rating: number
          medium_cost_buy_link: string
          medium_cost_image: string | null
          medium_cost_pesticide: string
          medium_cost_rating: number
        }
        Insert: {
          created_at?: string | null
          crop_name: string
          high_cost_buy_link: string
          high_cost_image?: string | null
          high_cost_pesticide: string
          high_cost_rating: number
          id?: number
          low_cost_buy_link: string
          low_cost_image?: string | null
          low_cost_pesticide: string
          low_cost_rating: number
          medium_cost_buy_link: string
          medium_cost_image?: string | null
          medium_cost_pesticide: string
          medium_cost_rating: number
        }
        Update: {
          created_at?: string | null
          crop_name?: string
          high_cost_buy_link?: string
          high_cost_image?: string | null
          high_cost_pesticide?: string
          high_cost_rating?: number
          id?: number
          low_cost_buy_link?: string
          low_cost_image?: string | null
          low_cost_pesticide?: string
          low_cost_rating?: number
          medium_cost_buy_link?: string
          medium_cost_image?: string | null
          medium_cost_pesticide?: string
          medium_cost_rating?: number
        }
        Relationships: []
      }
      soil_requirements: {
        Row: {
          created_at: string
          crop_name: string
          humidity_max: number
          humidity_min: number
          id: string
          nitrogen_max: number
          nitrogen_min: number
          ph_max: number
          ph_min: number
          phosphorus_max: number
          phosphorus_min: number
          potassium_max: number
          potassium_min: number
          rainfall_max: number
          rainfall_min: number
          temperature_max: number
          temperature_min: number
        }
        Insert: {
          created_at?: string
          crop_name: string
          humidity_max: number
          humidity_min: number
          id?: string
          nitrogen_max: number
          nitrogen_min: number
          ph_max: number
          ph_min: number
          phosphorus_max: number
          phosphorus_min: number
          potassium_max: number
          potassium_min: number
          rainfall_max: number
          rainfall_min: number
          temperature_max: number
          temperature_min: number
        }
        Update: {
          created_at?: string
          crop_name?: string
          humidity_max?: number
          humidity_min?: number
          id?: string
          nitrogen_max?: number
          nitrogen_min?: number
          ph_max?: number
          ph_min?: number
          phosphorus_max?: number
          phosphorus_min?: number
          potassium_max?: number
          potassium_min?: number
          rainfall_max?: number
          rainfall_min?: number
          temperature_max?: number
          temperature_min?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_unique_crop_labels: {
        Args: Record<PropertyKey, never>
        Returns: {
          label: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
