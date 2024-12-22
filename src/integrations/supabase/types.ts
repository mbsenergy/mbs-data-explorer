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
      MS01_dt_alba_gas: {
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
      MS01_dt_alba_power: {
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
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_cerved: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          is_cerved?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_cerved?: boolean | null
          updated_at?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_available_tables: {
        Args: Record<PropertyKey, never>
        Returns: {
          tablename: string
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
