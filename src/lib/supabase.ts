import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kytgqotbdihhhjaoawgb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_p-vLP9OCwqj164tlLUliaA_xN29SccV';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
