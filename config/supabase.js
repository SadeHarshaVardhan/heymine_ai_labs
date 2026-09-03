const { createClient } = require("@supabase/supabase-js");

function requireEnv(name) {
  const value = process.env[name];
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`${name} is required in production`);
  }
  return value;
}

const supabaseUrl = requireEnv("SUPABASE_URL");
const supabaseServiceKey = requireEnv("SUPABASE_SERVICE_KEY");
const supabaseAnonKey = requireEnv("SUPABASE_ANON_KEY");

function createSupabaseClient(key) {
  if (!supabaseUrl || !key) return null;
  return createClient(supabaseUrl, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

const supabaseAdmin = createSupabaseClient(supabaseServiceKey);
const supabaseAuth = createSupabaseClient(supabaseAnonKey);

function ensureSupabase(client = supabaseAdmin) {
  if (!client) {
    throw new Error("Supabase is not configured. Add SUPABASE_URL and keys to .env.");
  }
  return client;
}

module.exports = {
  supabaseAdmin,
  supabaseAuth,
  ensureSupabase,
};
