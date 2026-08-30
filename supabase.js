const SUPABASE_URL = "https://dtwtvjrqrweclbkrckeh.supabase.co";
const SUPABASE_KEY = "여기에 네 publishable key";

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);