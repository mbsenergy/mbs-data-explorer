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
      analytics: {
        Row: {
          created_at: string | null
          dataset_name: string
          downloaded_at: string | null
          id: string
          is_custom_query: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          dataset_name: string
          downloaded_at?: string | null
          id?: string
          is_custom_query?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          dataset_name?: string
          downloaded_at?: string | null
          id?: string
          is_custom_query?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      api_tokens: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          last_used_at: string | null
          name: string | null
          token: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          last_used_at?: string | null
          name?: string | null
          token: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          last_used_at?: string | null
          name?: string | null
          token?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_analytics: {
        Row: {
          created_at: string
          id: string
          message_content: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_content: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message_content?: string
          user_id?: string
        }
        Relationships: []
      }
      developer_analytics: {
        Row: {
          created_at: string | null
          downloaded_at: string | null
          file_name: string
          file_section: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          downloaded_at?: string | null
          file_name: string
          file_section: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          downloaded_at?: string | null
          file_name?: string
          file_section?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      EC01_eurostat_electricity: {
        Row: {
          COUNTRY: string | null
          DATE: string | null
          md_last_update: string | null
          md_source: string | null
          md_table: string | null
          SECTOR: string | null
          UNIT: string | null
          VALUE: number | null
          YEAR: number | null
        }
        Insert: {
          COUNTRY?: string | null
          DATE?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          SECTOR?: string | null
          UNIT?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Update: {
          COUNTRY?: string | null
          DATE?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          SECTOR?: string | null
          UNIT?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Relationships: []
      }
      EC01_eurostat_electricity_price_household: {
        Row: {
          CONSUMPTION_TYPE: string | null
          COUNTRY: string | null
          CURRENCY: string | null
          DATE: string | null
          md_source: string | null
          md_table: string | null
          VALUE: number | null
          YEAR: number | null
        }
        Insert: {
          CONSUMPTION_TYPE?: string | null
          COUNTRY?: string | null
          CURRENCY?: string | null
          DATE?: string | null
          md_source?: string | null
          md_table?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Update: {
          CONSUMPTION_TYPE?: string | null
          COUNTRY?: string | null
          CURRENCY?: string | null
          DATE?: string | null
          md_source?: string | null
          md_table?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Relationships: []
      }
      EC01_eurostat_electricity_price_no_household: {
        Row: {
          CONSUMPTION_TYPE: string | null
          COUNTRY: string | null
          CURRENCY: string | null
          DATE: string | null
          md_source: string | null
          md_table: string | null
          VALUE: number | null
          YEAR: number | null
        }
        Insert: {
          CONSUMPTION_TYPE?: string | null
          COUNTRY?: string | null
          CURRENCY?: string | null
          DATE?: string | null
          md_source?: string | null
          md_table?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Update: {
          CONSUMPTION_TYPE?: string | null
          COUNTRY?: string | null
          CURRENCY?: string | null
          DATE?: string | null
          md_source?: string | null
          md_table?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Relationships: []
      }
      EC01_eurostat_employment: {
        Row: {
          AGE: string | null
          COUNTRY: string | null
          DATE: string | null
          md_last_update: string | null
          md_source: string | null
          md_table: string | null
          SEX: string | null
          UNIT_CODE: string | null
          VALUE: number | null
          YEAR: number | null
        }
        Insert: {
          AGE?: string | null
          COUNTRY?: string | null
          DATE?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          SEX?: string | null
          UNIT_CODE?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Update: {
          AGE?: string | null
          COUNTRY?: string | null
          DATE?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          SEX?: string | null
          UNIT_CODE?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Relationships: []
      }
      EC01_eurostat_energy_efficiency: {
        Row: {
          COUNTRY: string | null
          DATE: string | null
          md_last_update: string | null
          md_source: string | null
          md_table: string | null
          SECTOR: string | null
          UNIT: string | null
          VALUE: number | null
          YEAR: number | null
        }
        Insert: {
          COUNTRY?: string | null
          DATE?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          SECTOR?: string | null
          UNIT?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Update: {
          COUNTRY?: string | null
          DATE?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          SECTOR?: string | null
          UNIT?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Relationships: []
      }
      EC01_eurostat_gas_price_household: {
        Row: {
          CONSUMPTION_TYPE: string | null
          COUNTRY: string | null
          CURRENCY: string | null
          DATE: string | null
          md_source: string | null
          md_table: string | null
          VALUE: number | null
          YEAR: number | null
        }
        Insert: {
          CONSUMPTION_TYPE?: string | null
          COUNTRY?: string | null
          CURRENCY?: string | null
          DATE?: string | null
          md_source?: string | null
          md_table?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Update: {
          CONSUMPTION_TYPE?: string | null
          COUNTRY?: string | null
          CURRENCY?: string | null
          DATE?: string | null
          md_source?: string | null
          md_table?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Relationships: []
      }
      EC01_eurostat_gas_price_no_household: {
        Row: {
          CONSUMPTION_TYPE: string | null
          COUNTRY: string | null
          CURRENCY: string | null
          DATE: string | null
          md_source: string | null
          md_table: string | null
          VALUE: number | null
          YEAR: number | null
        }
        Insert: {
          CONSUMPTION_TYPE?: string | null
          COUNTRY?: string | null
          CURRENCY?: string | null
          DATE?: string | null
          md_source?: string | null
          md_table?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Update: {
          CONSUMPTION_TYPE?: string | null
          COUNTRY?: string | null
          CURRENCY?: string | null
          DATE?: string | null
          md_source?: string | null
          md_table?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Relationships: []
      }
      EC01_eurostat_gdp_main_components: {
        Row: {
          COUNTRY: string | null
          DATE: string | null
          md_last_update: string | null
          md_source: string | null
          md_table: string | null
          UNIT_CODE: string | null
          VALUE: number | null
          YEAR: number | null
        }
        Insert: {
          COUNTRY?: string | null
          DATE?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          UNIT_CODE?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Update: {
          COUNTRY?: string | null
          DATE?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          UNIT_CODE?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Relationships: []
      }
      EC01_eurostat_gdp_main_components_q: {
        Row: {
          COUNTRY: string | null
          DATE: string | null
          md_last_update: string | null
          md_source: string | null
          md_table: string | null
          UNIT_CODE: string | null
          VALUE: number | null
          YEAR: number | null
        }
        Insert: {
          COUNTRY?: string | null
          DATE?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          UNIT_CODE?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Update: {
          COUNTRY?: string | null
          DATE?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          UNIT_CODE?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Relationships: []
      }
      EC01_eurostat_gva_q: {
        Row: {
          COUNTRY: string | null
          DATE: string | null
          md_last_update: string | null
          md_source: string | null
          md_table: string | null
          UNIT_CODE: string | null
          VALUE: number | null
          YEAR: number | null
        }
        Insert: {
          COUNTRY?: string | null
          DATE?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          UNIT_CODE?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Update: {
          COUNTRY?: string | null
          DATE?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          UNIT_CODE?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Relationships: []
      }
      EC01_eurostat_gva_temp: {
        Row: {
          COUNTRY: string | null
          DATE: string | null
          md_last_update: string | null
          md_source: string | null
          md_table: string | null
          UNIT_CODE: string | null
          VALUE: number | null
          YEAR: number | null
        }
        Insert: {
          COUNTRY?: string | null
          DATE?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          UNIT_CODE?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Update: {
          COUNTRY?: string | null
          DATE?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          UNIT_CODE?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Relationships: []
      }
      EC01_eurostat_HICP: {
        Row: {
          COUNTRY: string | null
          DATE: string | null
          md_last_update: string | null
          md_source: string | null
          md_table: string | null
          UNIT_CODE: string | null
          VALUE: number | null
          YEAR: number | null
        }
        Insert: {
          COUNTRY?: string | null
          DATE?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          UNIT_CODE?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Update: {
          COUNTRY?: string | null
          DATE?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          UNIT_CODE?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Relationships: []
      }
      EC01_eurostat_industrial_production_m: {
        Row: {
          COUNTRY: string | null
          DATE: string | null
          md_source: string | null
          md_table: string | null
          UNIT: string | null
          VALUE: number | null
          YEAR: number | null
        }
        Insert: {
          COUNTRY?: string | null
          DATE?: string | null
          md_source?: string | null
          md_table?: string | null
          UNIT?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Update: {
          COUNTRY?: string | null
          DATE?: string | null
          md_source?: string | null
          md_table?: string | null
          UNIT?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Relationships: []
      }
      EC01_eurostat_ip_capital_g: {
        Row: {
          COUNTRY: string | null
          DATE: string | null
          md_source: string | null
          md_table: string | null
          UNIT: string | null
          VALUE: number | null
          YEAR: number | null
        }
        Insert: {
          COUNTRY?: string | null
          DATE?: string | null
          md_source?: string | null
          md_table?: string | null
          UNIT?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Update: {
          COUNTRY?: string | null
          DATE?: string | null
          md_source?: string | null
          md_table?: string | null
          UNIT?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Relationships: []
      }
      EC01_eurostat_ip_consumer_d: {
        Row: {
          COUNTRY: string | null
          DATE: string | null
          md_source: string | null
          md_table: string | null
          UNIT: string | null
          VALUE: number | null
          YEAR: number | null
        }
        Insert: {
          COUNTRY?: string | null
          DATE?: string | null
          md_source?: string | null
          md_table?: string | null
          UNIT?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Update: {
          COUNTRY?: string | null
          DATE?: string | null
          md_source?: string | null
          md_table?: string | null
          UNIT?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Relationships: []
      }
      EC01_eurostat_ip_consumer_nd: {
        Row: {
          COUNTRY: string | null
          DATE: string | null
          md_source: string | null
          md_table: string | null
          UNIT: string | null
          VALUE: number | null
          YEAR: number | null
        }
        Insert: {
          COUNTRY?: string | null
          DATE?: string | null
          md_source?: string | null
          md_table?: string | null
          UNIT?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Update: {
          COUNTRY?: string | null
          DATE?: string | null
          md_source?: string | null
          md_table?: string | null
          UNIT?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Relationships: []
      }
      EC01_eurostat_ip_energy: {
        Row: {
          COUNTRY: string | null
          DATE: string | null
          md_source: string | null
          md_table: string | null
          UNIT: string | null
          VALUE: number | null
          YEAR: number | null
        }
        Insert: {
          COUNTRY?: string | null
          DATE?: string | null
          md_source?: string | null
          md_table?: string | null
          UNIT?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Update: {
          COUNTRY?: string | null
          DATE?: string | null
          md_source?: string | null
          md_table?: string | null
          UNIT?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Relationships: []
      }
      EC01_eurostat_ip_intermediate_g: {
        Row: {
          COUNTRY: string | null
          DATE: string | null
          md_source: string | null
          md_table: string | null
          UNIT: string | null
          VALUE: number | null
          YEAR: number | null
        }
        Insert: {
          COUNTRY?: string | null
          DATE?: string | null
          md_source?: string | null
          md_table?: string | null
          UNIT?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Update: {
          COUNTRY?: string | null
          DATE?: string | null
          md_source?: string | null
          md_table?: string | null
          UNIT?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Relationships: []
      }
      EC01_eurostat_ip_manufacturing: {
        Row: {
          COUNTRY: string | null
          DATE: string | null
          md_source: string | null
          md_table: string | null
          UNIT: string | null
          VALUE: number | null
          YEAR: number | null
        }
        Insert: {
          COUNTRY?: string | null
          DATE?: string | null
          md_source?: string | null
          md_table?: string | null
          UNIT?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Update: {
          COUNTRY?: string | null
          DATE?: string | null
          md_source?: string | null
          md_table?: string | null
          UNIT?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Relationships: []
      }
      EC01_eurostat_ip_total: {
        Row: {
          COUNTRY: string | null
          DATE: string | null
          md_source: string | null
          md_table: string | null
          UNIT: string | null
          VALUE: number | null
          YEAR: number | null
        }
        Insert: {
          COUNTRY?: string | null
          DATE?: string | null
          md_source?: string | null
          md_table?: string | null
          UNIT?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Update: {
          COUNTRY?: string | null
          DATE?: string | null
          md_source?: string | null
          md_table?: string | null
          UNIT?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Relationships: []
      }
      EC01_eurostat_unemployment: {
        Row: {
          AGE: string | null
          COUNTRY: string | null
          DATE: string | null
          md_last_update: string | null
          md_source: string | null
          md_table: string | null
          SEX: string | null
          UNIT_CODE: string | null
          VALUE: number | null
          YEAR: number | null
        }
        Insert: {
          AGE?: string | null
          COUNTRY?: string | null
          DATE?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          SEX?: string | null
          UNIT_CODE?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Update: {
          AGE?: string | null
          COUNTRY?: string | null
          DATE?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          SEX?: string | null
          UNIT_CODE?: string | null
          VALUE?: number | null
          YEAR?: number | null
        }
        Relationships: []
      }
      exports: {
        Row: {
          created_at: string | null
          downloaded_at: string | null
          export_name: string
          export_type: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          downloaded_at?: string | null
          export_name: string
          export_type: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          downloaded_at?: string | null
          export_name?: string
          export_type?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      gdp_eurozone: {
        Row: {
          country: string
          created_at: string | null
          gdp_per_capita: number
          id: number
          year: number
        }
        Insert: {
          country: string
          created_at?: string | null
          gdp_per_capita: number
          id?: never
          year: number
        }
        Update: {
          country?: string
          created_at?: string | null
          gdp_per_capita?: number
          id?: never
          year?: number
        }
        Relationships: []
      }
      level_features: {
        Row: {
          created_at: string
          feature_name: string
          id: string
          is_enabled: boolean | null
          level: Database["public"]["Enums"]["user_level"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          feature_name: string
          id?: string
          is_enabled?: boolean | null
          level: Database["public"]["Enums"]["user_level"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          feature_name?: string
          id?: string
          is_enabled?: boolean | null
          level?: Database["public"]["Enums"]["user_level"]
          updated_at?: string
        }
        Relationships: []
      }
      ME01_gme_mb_altriservizi: {
        Row: {
          DATE: string | null
          FIELD: string | null
          HOUR: string | null
          MARKET: string | null
          md_last_update: string | null
          md_source: string | null
          md_table: string | null
          TIME: string | null
          UNIT: string | null
          VALUE: string | null
          VARIABLE: string | null
          ZONE: string | null
        }
        Insert: {
          DATE?: string | null
          FIELD?: string | null
          HOUR?: string | null
          MARKET?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          TIME?: string | null
          UNIT?: string | null
          VALUE?: string | null
          VARIABLE?: string | null
          ZONE?: string | null
        }
        Update: {
          DATE?: string | null
          FIELD?: string | null
          HOUR?: string | null
          MARKET?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          TIME?: string | null
          UNIT?: string | null
          VALUE?: string | null
          VARIABLE?: string | null
          ZONE?: string | null
        }
        Relationships: []
      }
      ME01_gme_mb_offers: {
        Row: {
          ADJ_ENERGY_PRICE_NO: string | null
          ADJ_QUANTITY_NO: number | null
          AWARDED_PRICE_NO: number | null
          AWARDED_QUANTITY_NO: number | null
          BATYPE: string | null
          BID_OFFER_DATE_DT: string | null
          BID_OFFER_DATE_DT_PARSED: string | null
          BILATERAL_IN: string | null
          ENERGY_PRICE_NO: number | null
          GRID_SUPPLY_POINT_NO: string | null
          INTERVAL_NO: number | null
          MARKET_CD: string | null
          md_last_update: string | null
          md_source: string | null
          md_table: string | null
          MERIT_ORDER_NO: number | null
          OPERATORE: string | null
          PARTIAL_QTY_ACCEPTED_IN: string | null
          PURPOSE_CD: string | null
          QUANTITY_NO: number | null
          QUARTER_NO: string | null
          SCOPE: string | null
          STATUS_CD: string | null
          SUBMITTED_DT: string | null
          TIME: string | null
          TRANSACTION_REFERENCE_NO: string | null
          TYPE_CD: string | null
          UNIT_REFERENCE_NO: string | null
          ZONE_CD: string | null
        }
        Insert: {
          ADJ_ENERGY_PRICE_NO?: string | null
          ADJ_QUANTITY_NO?: number | null
          AWARDED_PRICE_NO?: number | null
          AWARDED_QUANTITY_NO?: number | null
          BATYPE?: string | null
          BID_OFFER_DATE_DT?: string | null
          BID_OFFER_DATE_DT_PARSED?: string | null
          BILATERAL_IN?: string | null
          ENERGY_PRICE_NO?: number | null
          GRID_SUPPLY_POINT_NO?: string | null
          INTERVAL_NO?: number | null
          MARKET_CD?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          MERIT_ORDER_NO?: number | null
          OPERATORE?: string | null
          PARTIAL_QTY_ACCEPTED_IN?: string | null
          PURPOSE_CD?: string | null
          QUANTITY_NO?: number | null
          QUARTER_NO?: string | null
          SCOPE?: string | null
          STATUS_CD?: string | null
          SUBMITTED_DT?: string | null
          TIME?: string | null
          TRANSACTION_REFERENCE_NO?: string | null
          TYPE_CD?: string | null
          UNIT_REFERENCE_NO?: string | null
          ZONE_CD?: string | null
        }
        Update: {
          ADJ_ENERGY_PRICE_NO?: string | null
          ADJ_QUANTITY_NO?: number | null
          AWARDED_PRICE_NO?: number | null
          AWARDED_QUANTITY_NO?: number | null
          BATYPE?: string | null
          BID_OFFER_DATE_DT?: string | null
          BID_OFFER_DATE_DT_PARSED?: string | null
          BILATERAL_IN?: string | null
          ENERGY_PRICE_NO?: number | null
          GRID_SUPPLY_POINT_NO?: string | null
          INTERVAL_NO?: number | null
          MARKET_CD?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          MERIT_ORDER_NO?: number | null
          OPERATORE?: string | null
          PARTIAL_QTY_ACCEPTED_IN?: string | null
          PURPOSE_CD?: string | null
          QUANTITY_NO?: number | null
          QUARTER_NO?: string | null
          SCOPE?: string | null
          STATUS_CD?: string | null
          SUBMITTED_DT?: string | null
          TIME?: string | null
          TRANSACTION_REFERENCE_NO?: string | null
          TYPE_CD?: string | null
          UNIT_REFERENCE_NO?: string | null
          ZONE_CD?: string | null
        }
        Relationships: []
      }
      ME01_gme_mb_riservasecondaria: {
        Row: {
          DATE: string | null
          FIELD: string | null
          HOUR: number | null
          MARKET: string | null
          md_last_update: string | null
          md_source: string | null
          md_table: string | null
          TIME: string | null
          UNIT: string | null
          VALUE: string | null
          VARIABLE: string | null
          ZONE: string | null
        }
        Insert: {
          DATE?: string | null
          FIELD?: string | null
          HOUR?: number | null
          MARKET?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          TIME?: string | null
          UNIT?: string | null
          VALUE?: string | null
          VARIABLE?: string | null
          ZONE?: string | null
        }
        Update: {
          DATE?: string | null
          FIELD?: string | null
          HOUR?: number | null
          MARKET?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          TIME?: string | null
          UNIT?: string | null
          VALUE?: string | null
          VARIABLE?: string | null
          ZONE?: string | null
        }
        Relationships: []
      }
      ME01_gme_mb_totali: {
        Row: {
          DATE: string | null
          FIELD: string | null
          HOUR: number | null
          MARKET: string | null
          md_last_update: string | null
          md_source: string | null
          md_table: string | null
          TIME: string | null
          UNIT: string | null
          VALUE: string | null
          VARIABLE: string | null
          ZONE: string | null
        }
        Insert: {
          DATE?: string | null
          FIELD?: string | null
          HOUR?: number | null
          MARKET?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          TIME?: string | null
          UNIT?: string | null
          VALUE?: string | null
          VARIABLE?: string | null
          ZONE?: string | null
        }
        Update: {
          DATE?: string | null
          FIELD?: string | null
          HOUR?: number | null
          MARKET?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          TIME?: string | null
          UNIT?: string | null
          VALUE?: string | null
          VARIABLE?: string | null
          ZONE?: string | null
        }
        Relationships: []
      }
      ME01_gme_mgp_fabbisogno: {
        Row: {
          DATE: string | null
          HOUR: string | null
          MARKET: string | null
          md_last_update: string | null
          md_source: string | null
          md_table: string | null
          TIME: string | null
          UNIT: string | null
          VALUE: number | null
          ZONE: string | null
        }
        Insert: {
          DATE?: string | null
          HOUR?: string | null
          MARKET?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          TIME?: string | null
          UNIT?: string | null
          VALUE?: number | null
          ZONE?: string | null
        }
        Update: {
          DATE?: string | null
          HOUR?: string | null
          MARKET?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          TIME?: string | null
          UNIT?: string | null
          VALUE?: number | null
          ZONE?: string | null
        }
        Relationships: []
      }
      ME01_gme_mgp_liquidity: {
        Row: {
          DATE: string | null
          HOUR: number | null
          MARKET: string | null
          md_last_update: string | null
          md_source: string | null
          md_table: string | null
          TIME: string | null
          UNIT: string | null
          VALUE: number | null
          ZONE: string | null
        }
        Insert: {
          DATE?: string | null
          HOUR?: number | null
          MARKET?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          TIME?: string | null
          UNIT?: string | null
          VALUE?: number | null
          ZONE?: string | null
        }
        Update: {
          DATE?: string | null
          HOUR?: number | null
          MARKET?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          TIME?: string | null
          UNIT?: string | null
          VALUE?: number | null
          ZONE?: string | null
        }
        Relationships: []
      }
      ME01_gme_mgp_offers: {
        Row: {
          ADJ_ENERGY_PRICE_NO: string | null
          ADJ_QUANTITY_NO: number | null
          AWARDED_PRICE_NO: number | null
          AWARDED_QUANTITY_NO: number | null
          BID_OFFER_DATE_DT: string | null
          BID_OFFER_DATE_DT_PARSED: string | null
          BILATERAL_IN: string | null
          ENERGY_PRICE_NO: number | null
          GRID_SUPPLY_POINT_NO: string | null
          INTERVAL_NO: number | null
          MARKET_CD: string | null
          md_last_update: string | null
          md_source: string | null
          md_table: string | null
          MERIT_ORDER_NO: number | null
          OPERATORE: string | null
          PARTIAL_QTY_ACCEPTED_IN: string | null
          PURPOSE_CD: string | null
          QUANTITY_NO: number | null
          SCOPE: string | null
          STATUS_CD: string | null
          SUBMITTED_DT: string | null
          TIME: string | null
          TRANSACTION_REFERENCE_NO: string | null
          TYPE_CD: string | null
          UNIT_REFERENCE_NO: string | null
          ZONE_CD: string | null
        }
        Insert: {
          ADJ_ENERGY_PRICE_NO?: string | null
          ADJ_QUANTITY_NO?: number | null
          AWARDED_PRICE_NO?: number | null
          AWARDED_QUANTITY_NO?: number | null
          BID_OFFER_DATE_DT?: string | null
          BID_OFFER_DATE_DT_PARSED?: string | null
          BILATERAL_IN?: string | null
          ENERGY_PRICE_NO?: number | null
          GRID_SUPPLY_POINT_NO?: string | null
          INTERVAL_NO?: number | null
          MARKET_CD?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          MERIT_ORDER_NO?: number | null
          OPERATORE?: string | null
          PARTIAL_QTY_ACCEPTED_IN?: string | null
          PURPOSE_CD?: string | null
          QUANTITY_NO?: number | null
          SCOPE?: string | null
          STATUS_CD?: string | null
          SUBMITTED_DT?: string | null
          TIME?: string | null
          TRANSACTION_REFERENCE_NO?: string | null
          TYPE_CD?: string | null
          UNIT_REFERENCE_NO?: string | null
          ZONE_CD?: string | null
        }
        Update: {
          ADJ_ENERGY_PRICE_NO?: string | null
          ADJ_QUANTITY_NO?: number | null
          AWARDED_PRICE_NO?: number | null
          AWARDED_QUANTITY_NO?: number | null
          BID_OFFER_DATE_DT?: string | null
          BID_OFFER_DATE_DT_PARSED?: string | null
          BILATERAL_IN?: string | null
          ENERGY_PRICE_NO?: number | null
          GRID_SUPPLY_POINT_NO?: string | null
          INTERVAL_NO?: number | null
          MARKET_CD?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          MERIT_ORDER_NO?: number | null
          OPERATORE?: string | null
          PARTIAL_QTY_ACCEPTED_IN?: string | null
          PURPOSE_CD?: string | null
          QUANTITY_NO?: number | null
          SCOPE?: string | null
          STATUS_CD?: string | null
          SUBMITTED_DT?: string | null
          TIME?: string | null
          TRANSACTION_REFERENCE_NO?: string | null
          TYPE_CD?: string | null
          UNIT_REFERENCE_NO?: string | null
          ZONE_CD?: string | null
        }
        Relationships: []
      }
      ME01_gme_mgp_prices: {
        Row: {
          DATE: string | null
          HOUR: string | null
          MARKET: string | null
          md_last_update: string | null
          md_source: string | null
          md_table: string | null
          TIME: string | null
          UNIT: string | null
          VALUE: number | null
          ZONE: string | null
        }
        Insert: {
          DATE?: string | null
          HOUR?: string | null
          MARKET?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          TIME?: string | null
          UNIT?: string | null
          VALUE?: number | null
          ZONE?: string | null
        }
        Update: {
          DATE?: string | null
          HOUR?: string | null
          MARKET?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          TIME?: string | null
          UNIT?: string | null
          VALUE?: number | null
          ZONE?: string | null
        }
        Relationships: []
      }
      ME01_gme_mgp_quantity: {
        Row: {
          DATE: string | null
          HOUR: number | null
          MARKET: string | null
          md_last_update: string | null
          md_source: string | null
          md_table: string | null
          TIME: string | null
          UNIT: string | null
          VALUE: number | null
          ZONE: string | null
        }
        Insert: {
          DATE?: string | null
          HOUR?: number | null
          MARKET?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          TIME?: string | null
          UNIT?: string | null
          VALUE?: number | null
          ZONE?: string | null
        }
        Update: {
          DATE?: string | null
          HOUR?: number | null
          MARKET?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          TIME?: string | null
          UNIT?: string | null
          VALUE?: number | null
          ZONE?: string | null
        }
        Relationships: []
      }
      ME01_gme_mgp_transit: {
        Row: {
          DATE: string | null
          HOUR: number | null
          MARKET: string | null
          md_last_update: string | null
          md_source: string | null
          md_table: string | null
          TIME: string | null
          UNIT: string | null
          VALUE: number | null
          ZONE: string | null
        }
        Insert: {
          DATE?: string | null
          HOUR?: number | null
          MARKET?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          TIME?: string | null
          UNIT?: string | null
          VALUE?: number | null
          ZONE?: string | null
        }
        Update: {
          DATE?: string | null
          HOUR?: number | null
          MARKET?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          TIME?: string | null
          UNIT?: string | null
          VALUE?: number | null
          ZONE?: string | null
        }
        Relationships: []
      }
      ME01_gme_mgp_transitlimit: {
        Row: {
          DATE: string | null
          HOUR: number | null
          MARKET: string | null
          md_last_update: string | null
          md_source: string | null
          md_table: string | null
          TIME: string | null
          UNIT: string | null
          VALUE: number | null
          VARIABLE: string | null
          ZONE: string | null
        }
        Insert: {
          DATE?: string | null
          HOUR?: number | null
          MARKET?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          TIME?: string | null
          UNIT?: string | null
          VALUE?: number | null
          VARIABLE?: string | null
          ZONE?: string | null
        }
        Update: {
          DATE?: string | null
          HOUR?: number | null
          MARKET?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          TIME?: string | null
          UNIT?: string | null
          VALUE?: number | null
          VARIABLE?: string | null
          ZONE?: string | null
        }
        Relationships: []
      }
      ME01_gme_msd: {
        Row: {
          DATE: string | null
          HOUR: number | null
          MARKET: string | null
          md_last_update: string | null
          md_source: string | null
          md_table: string | null
          TIME: string | null
          UNIT: string | null
          VALUE: string | null
          VARIABLE: string | null
          ZONE: string | null
        }
        Insert: {
          DATE?: string | null
          HOUR?: number | null
          MARKET?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          TIME?: string | null
          UNIT?: string | null
          VALUE?: string | null
          VARIABLE?: string | null
          ZONE?: string | null
        }
        Update: {
          DATE?: string | null
          HOUR?: number | null
          MARKET?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          TIME?: string | null
          UNIT?: string | null
          VALUE?: string | null
          VARIABLE?: string | null
          ZONE?: string | null
        }
        Relationships: []
      }
      ME01_gme_msd_offers: {
        Row: {
          ADJ_ENERGY_PRICE_NO: string | null
          ADJ_QUANTITY_NO: number | null
          AWARDED_PRICE_NO: number | null
          AWARDED_QUANTITY_NO: number | null
          BID_OFFER_DATE_DT: string | null
          BID_OFFER_DATE_DT_PARSED: string | null
          BILATERAL_IN: string | null
          ENERGY_PRICE_NO: number | null
          GRANULARITY: string | null
          GRID_SUPPLY_POINT_NO: string | null
          INTERVAL_NO: number | null
          MARKET_CD: string | null
          md_last_update: string | null
          md_source: string | null
          md_table: string | null
          MERIT_ORDER_NO: number | null
          OPERATORE: string | null
          PARTIAL_QTY_ACCEPTED_IN: string | null
          PERIOD: string | null
          PURPOSE_CD: string | null
          QUANTITY_NO: number | null
          SCOPE: string | null
          STATUS_CD: string | null
          SUBMITTED_DT: string | null
          TIME: string | null
          TRANSACTION_REFERENCE_NO: string | null
          TYPE_CD: string | null
          UNIT_REFERENCE_NO: string | null
          ZONE_CD: string | null
        }
        Insert: {
          ADJ_ENERGY_PRICE_NO?: string | null
          ADJ_QUANTITY_NO?: number | null
          AWARDED_PRICE_NO?: number | null
          AWARDED_QUANTITY_NO?: number | null
          BID_OFFER_DATE_DT?: string | null
          BID_OFFER_DATE_DT_PARSED?: string | null
          BILATERAL_IN?: string | null
          ENERGY_PRICE_NO?: number | null
          GRANULARITY?: string | null
          GRID_SUPPLY_POINT_NO?: string | null
          INTERVAL_NO?: number | null
          MARKET_CD?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          MERIT_ORDER_NO?: number | null
          OPERATORE?: string | null
          PARTIAL_QTY_ACCEPTED_IN?: string | null
          PERIOD?: string | null
          PURPOSE_CD?: string | null
          QUANTITY_NO?: number | null
          SCOPE?: string | null
          STATUS_CD?: string | null
          SUBMITTED_DT?: string | null
          TIME?: string | null
          TRANSACTION_REFERENCE_NO?: string | null
          TYPE_CD?: string | null
          UNIT_REFERENCE_NO?: string | null
          ZONE_CD?: string | null
        }
        Update: {
          ADJ_ENERGY_PRICE_NO?: string | null
          ADJ_QUANTITY_NO?: number | null
          AWARDED_PRICE_NO?: number | null
          AWARDED_QUANTITY_NO?: number | null
          BID_OFFER_DATE_DT?: string | null
          BID_OFFER_DATE_DT_PARSED?: string | null
          BILATERAL_IN?: string | null
          ENERGY_PRICE_NO?: number | null
          GRANULARITY?: string | null
          GRID_SUPPLY_POINT_NO?: string | null
          INTERVAL_NO?: number | null
          MARKET_CD?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          MERIT_ORDER_NO?: number | null
          OPERATORE?: string | null
          PARTIAL_QTY_ACCEPTED_IN?: string | null
          PERIOD?: string | null
          PURPOSE_CD?: string | null
          QUANTITY_NO?: number | null
          SCOPE?: string | null
          STATUS_CD?: string | null
          SUBMITTED_DT?: string | null
          TIME?: string | null
          TRANSACTION_REFERENCE_NO?: string | null
          TYPE_CD?: string | null
          UNIT_REFERENCE_NO?: string | null
          ZONE_CD?: string | null
        }
        Relationships: []
      }
      ME01_gme_xbid: {
        Row: {
          DATE: string | null
          HOUR: number | null
          MARKET: string | null
          md_last_update: string | null
          md_source: string | null
          md_table: string | null
          TIME: string | null
          UNIT: string | null
          VALUE: number | null
          VARIABLE: string | null
          ZONE: string | null
        }
        Insert: {
          DATE?: string | null
          HOUR?: number | null
          MARKET?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          TIME?: string | null
          UNIT?: string | null
          VALUE?: number | null
          VARIABLE?: string | null
          ZONE?: string | null
        }
        Update: {
          DATE?: string | null
          HOUR?: number | null
          MARKET?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          TIME?: string | null
          UNIT?: string | null
          VALUE?: number | null
          VARIABLE?: string | null
          ZONE?: string | null
        }
        Relationships: []
      }
      ME01_gme_xbid_offers: {
        Row: {
          AWARDED_PRICE_NO: number | null
          AWARDED_QUANTITY_NO: number | null
          MARKET_CD: string | null
          md_last_update: string | null
          md_source: string | null
          md_table: string | null
          OPERATORE: string | null
          PREZZO_UNITARIO: string | null
          PRODOTTO: string | null
          PURPOSE_CD: string | null
          QUANTITY_NO: number | null
          STATUS_CD: string | null
          TIMESTAMP: string | null
          TRANSACTION_REFERENCE_NO: string | null
          UNIT_REFERENCE_NO: string | null
        }
        Insert: {
          AWARDED_PRICE_NO?: number | null
          AWARDED_QUANTITY_NO?: number | null
          MARKET_CD?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          OPERATORE?: string | null
          PREZZO_UNITARIO?: string | null
          PRODOTTO?: string | null
          PURPOSE_CD?: string | null
          QUANTITY_NO?: number | null
          STATUS_CD?: string | null
          TIMESTAMP?: string | null
          TRANSACTION_REFERENCE_NO?: string | null
          UNIT_REFERENCE_NO?: string | null
        }
        Update: {
          AWARDED_PRICE_NO?: number | null
          AWARDED_QUANTITY_NO?: number | null
          MARKET_CD?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          OPERATORE?: string | null
          PREZZO_UNITARIO?: string | null
          PRODOTTO?: string | null
          PURPOSE_CD?: string | null
          QUANTITY_NO?: number | null
          STATUS_CD?: string | null
          TIMESTAMP?: string | null
          TRANSACTION_REFERENCE_NO?: string | null
          UNIT_REFERENCE_NO?: string | null
        }
        Relationships: []
      }
      MS01_agsi_gas_raw: {
        Row: {
          CODE_2: string | null
          DATE: string | null
          md_last_update: string | null
          md_source: string | null
          md_table: string | null
          VALUE: string | null
          VARIABLE: string | null
        }
        Insert: {
          CODE_2?: string | null
          DATE?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          VALUE?: string | null
          VARIABLE?: string | null
        }
        Update: {
          CODE_2?: string | null
          DATE?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          VALUE?: string | null
          VARIABLE?: string | null
        }
        Relationships: []
      }
      MS01_alba_gas: {
        Row: {
          DATE: string | null
          md_last_update: string | null
          md_source: string | null
          md_table: string | null
          TYPE: string | null
          VALUE: number | null
          VARIABLE: string | null
        }
        Insert: {
          DATE?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          TYPE?: string | null
          VALUE?: number | null
          VARIABLE?: string | null
        }
        Update: {
          DATE?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          TYPE?: string | null
          VALUE?: number | null
          VARIABLE?: string | null
        }
        Relationships: []
      }
      MS01_alba_power: {
        Row: {
          DATE: string | null
          md_last_update: string | null
          md_source: string | null
          md_table: string | null
          TYPE: string | null
          VALUE: number | null
          VARIABLE: string | null
        }
        Insert: {
          DATE?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          TYPE?: string | null
          VALUE?: number | null
          VARIABLE?: string | null
        }
        Update: {
          DATE?: string | null
          md_last_update?: string | null
          md_source?: string | null
          md_table?: string | null
          TYPE?: string | null
          VALUE?: number | null
          VARIABLE?: string | null
        }
        Relationships: []
      }
      notes: {
        Row: {
          content: string
          created_at: string
          id: string
          is_favorite: boolean | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_favorite?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_favorite?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string
          last_cleared_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          last_cleared_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          last_cleared_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          first_name: string | null
          github_url: string | null
          id: string
          is_cerved: boolean | null
          it_skills: string[] | null
          last_name: string | null
          level: string
          linkedin_url: string | null
          preferred_data: string[] | null
          role: string | null
          subscriptions: string[] | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          github_url?: string | null
          id: string
          is_cerved?: boolean | null
          it_skills?: string[] | null
          last_name?: string | null
          level?: string
          linkedin_url?: string | null
          preferred_data?: string[] | null
          role?: string | null
          subscriptions?: string[] | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          github_url?: string | null
          id?: string
          is_cerved?: boolean | null
          it_skills?: string[] | null
          last_name?: string | null
          level?: string
          linkedin_url?: string | null
          preferred_data?: string[] | null
          role?: string | null
          subscriptions?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          description: string | null
          file_path: string
          format: string
          id: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_path: string
          format: string
          id?: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_path?: string
          format?: string
          id?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      saved_queries: {
        Row: {
          created_at: string
          id: string
          name: string
          query_text: string
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          query_text: string
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          query_text?: string
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scripts: {
        Row: {
          created_at: string
          description: string | null
          file_path: string
          id: string
          language: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_path: string
          id?: string
          language: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_path?: string
          id?: string
          language?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      storage_files: {
        Row: {
          created_at: string
          id: string
          original_name: string
          storage_id: string
          tags: string[] | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          original_name: string
          storage_id: string
          tags?: string[] | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          original_name?: string
          storage_id?: string
          tags?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      TS01_entsoe_actual_generation: {
        Row: {
          ASSET_CATEGORY: string | null
          CODE_EIC: string | null
          CODE_MAP: string | null
          DATE: string | null
          HOUR: number | null
          md_source: string | null
          md_table: string | null
          md_update: string | null
          PRODUCTION_TYPE: string | null
          RESOLUTION: string | null
          TIME: string | null
          UPDATETIME: string | null
          VALUE: number | null
          VARIABLE: string | null
        }
        Insert: {
          ASSET_CATEGORY?: string | null
          CODE_EIC?: string | null
          CODE_MAP?: string | null
          DATE?: string | null
          HOUR?: number | null
          md_source?: string | null
          md_table?: string | null
          md_update?: string | null
          PRODUCTION_TYPE?: string | null
          RESOLUTION?: string | null
          TIME?: string | null
          UPDATETIME?: string | null
          VALUE?: number | null
          VARIABLE?: string | null
        }
        Update: {
          ASSET_CATEGORY?: string | null
          CODE_EIC?: string | null
          CODE_MAP?: string | null
          DATE?: string | null
          HOUR?: number | null
          md_source?: string | null
          md_table?: string | null
          md_update?: string | null
          PRODUCTION_TYPE?: string | null
          RESOLUTION?: string | null
          TIME?: string | null
          UPDATETIME?: string | null
          VALUE?: number | null
          VARIABLE?: string | null
        }
        Relationships: []
      }
      TS01_entsoe_dam_prices: {
        Row: {
          CODE_ENTSOE: string | null
          COUNTRY: string | null
          DATE: string | null
          md_source: string | null
          md_table: string | null
          md_update: string | null
          POSITION: number | null
          RESOLUTION: string | null
          TIME: string | null
          UNIT: string | null
          VALUE: number | null
        }
        Insert: {
          CODE_ENTSOE?: string | null
          COUNTRY?: string | null
          DATE?: string | null
          md_source?: string | null
          md_table?: string | null
          md_update?: string | null
          POSITION?: number | null
          RESOLUTION?: string | null
          TIME?: string | null
          UNIT?: string | null
          VALUE?: number | null
        }
        Update: {
          CODE_ENTSOE?: string | null
          COUNTRY?: string | null
          DATE?: string | null
          md_source?: string | null
          md_table?: string | null
          md_update?: string | null
          POSITION?: number | null
          RESOLUTION?: string | null
          TIME?: string | null
          UNIT?: string | null
          VALUE?: number | null
        }
        Relationships: []
      }
      user_logins: {
        Row: {
          id: string
          logged_in_at: string
          user_id: string
        }
        Insert: {
          id?: string
          logged_in_at?: string
          user_id: string
        }
        Update: {
          id?: string
          logged_in_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_feature_access: {
        Args: {
          feature_name: string
          user_id: string
        }
        Returns: boolean
      }
      execute_query: {
        Args: {
          query_text: string
        }
        Returns: Json
      }
      get_available_tables: {
        Args: Record<PropertyKey, never>
        Returns: {
          tablename: string
        }[]
      }
      get_last_connection: {
        Args: {
          user_uuid: string
        }
        Returns: string
      }
      get_login_count_this_year: {
        Args: {
          user_uuid: string
        }
        Returns: number
      }
      get_table_row_count: {
        Args: {
          table_name: string
        }
        Returns: number
      }
      get_user_features: {
        Args: {
          user_uuid: string
        }
        Returns: {
          feature_name: string
          is_enabled: boolean
        }[]
      }
    }
    Enums: {
      user_level: "basic" | "plus" | "premium"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
