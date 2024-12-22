export interface EurostatTables {
  EC01_eurostat_gdp_main_components: {
    Row: {
      md_source: string | null;
      md_table: string | null;
      md_last_update: string | null;
      UNIT_CODE: string | null;
      COUNTRY: string | null;
      DATE: string | null;
      YEAR: number | null;
      VALUE: number | null;
    };
  };
  EC01_eurostat_employment: {
    Row: {
      md_source: string | null;
      md_table: string | null;
      md_last_update: string | null;
      UNIT_CODE: string | null;
      COUNTRY: string | null;
      SEX: string | null;
      AGE: string | null;
      DATE: string | null;
      YEAR: number | null;
      VALUE: number | null;
    };
  };
}

export interface MarketTables {
  ME01_gme_mgp_prices: {
    Row: {
      md_source: string | null;
      md_table: string | null;
      md_last_update: string | null;
      DATE: string | null;
      TIME: string | null;
      HOUR: string | null;
      MARKET: string | null;
      ZONE: string | null;
      VALUE: number | null;
      UNIT: string | null;
    };
  };
  TS01_entsoe_dam_prices: {
    Row: {
      md_source: string | null;
      md_table: string | null;
      md_update: string | null;
      COUNTRY: string | null;
      CODE_ENTSOE: string | null;
      DATE: string | null;
      TIME: string | null;
      POSITION: number | null;
      RESOLUTION: string | null;
      VALUE: number | null;
      UNIT: string | null;
    };
  };
  TS01_entsoe_actual_generation: {
    Row: {
      md_source: string | null;
      md_table: string | null;
      md_update: string | null;
      DATE: string | null;
      TIME: string | null;
      HOUR: number | null;
      RESOLUTION: string | null;
      CODE_MAP: string | null;
      CODE_EIC: string | null;
      PRODUCTION_TYPE: string | null;
      ASSET_CATEGORY: string | null;
      UPDATETIME: string | null;
      VARIABLE: string | null;
      VALUE: number | null;
    };
  };
}