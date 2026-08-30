// =========================
// Supabase 연결
// =========================

const supabaseUrl = "https://dtwtvjrqrweclbkrckeh.supabase.co";

const supabaseKey = "sb_publishable_th-F0YuEsB6JNtOjT8s-bw_gSPocZdU";

const supabase = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);