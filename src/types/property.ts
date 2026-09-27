export interface SourceListingPreview {
  source_id: string;
  source_name: string;
  price: number;
  original_url: string;
  last_checked: string;
}

export interface PropertyMaster {
  id: string;
  location_id: string;
  title: string;
  property_type: string;
  transaction_type: string;
  bhk: number | null;
  carpet_area_sqft: number | null;
  plot_area_sqft: number | null;
  locality: string;
  village: string | null;
  latitude: number | null;
  longitude: number | null;
  rera_number: string | null;
  builder_name: string | null;
  project_name: string | null;
  possession_status: string | null;
  source_count: number;
  lowest_advertised_price: number | null;
  highest_advertised_price: number | null;
  price_discrepancy_amount: number;
  last_checked_at: string;
  primary_image_url: string | null;
  sources?: SourceListingPreview[];
}