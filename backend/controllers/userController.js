const { ensureSupabase, supabaseAdmin } = require("../config/supabase");
const { encrypt } = require("../utils/encryption");

function publicProfile(profile) {
  if (!profile) return null;
  return {
    id: profile.id,
    username: profile.username,
    email: profile.email,
    useOwnKey: Boolean(profile.use_own_key),
    hasGroqKey: Boolean(profile.groq_api_key_encrypted),
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  };
}

exports.getMe = async (req, res, next) => {
  try {
    const supabase = ensureSupabase(supabaseAdmin);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, email, use_own_key, groq_api_key_encrypted, created_at, updated_at")
      .eq("id", req.user.id)
      .single();

    if (error) return res.status(404).json({ success: false, error: error.message });
    return res.json({ success: true, profile: publicProfile(data) });
  } catch (error) {
    next(error);
  }
};

exports.updateApiKey = async (req, res, next) => {
  try {
    const { groqApiKey, useOwnKey = true } = req.body;
    if (!groqApiKey || !String(groqApiKey).startsWith("gsk_")) {
      return res.status(400).json({ success: false, error: "Enter a valid Groq API key" });
    }

    const supabase = ensureSupabase(supabaseAdmin);
    const { data, error } = await supabase
      .from("profiles")
      .update({
        groq_api_key_encrypted: encrypt(groqApiKey),
        use_own_key: Boolean(useOwnKey),
      })
      .eq("id", req.user.id)
      .select("id, username, email, use_own_key, groq_api_key_encrypted, created_at, updated_at")
      .single();

    if (error) return res.status(400).json({ success: false, error: error.message });
    return res.json({ success: true, profile: publicProfile(data) });
  } catch (error) {
    next(error);
  }
};

exports.toggleKey = async (req, res, next) => {
  try {
    const { useOwnKey } = req.body;
    const supabase = ensureSupabase(supabaseAdmin);
    const { data, error } = await supabase
      .from("profiles")
      .update({ use_own_key: Boolean(useOwnKey) })
      .eq("id", req.user.id)
      .select("id, username, email, use_own_key, groq_api_key_encrypted, created_at, updated_at")
      .single();

    if (error) return res.status(400).json({ success: false, error: error.message });
    return res.json({ success: true, profile: publicProfile(data) });
  } catch (error) {
    next(error);
  }
};
