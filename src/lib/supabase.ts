import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const LOCATION_SCOPE = {
  id: process.env.NEXT_PUBLIC_ACTIVE_LOCATION_ID || 'LOC_IN_MH_SHA_421601',
  name: process.env.NEXT_PUBLIC_ACTIVE_LOCATION_NAME || 'Shahapur',
  pincode: process.env.NEXT_PUBLIC_ACTIVE_LOCATION_PINCODE || '421601',
  district: 'Thane',
  state: 'Maharashtra',
  defaultCoords: { lat: 19.4530, lng: 73.3280 }
};
