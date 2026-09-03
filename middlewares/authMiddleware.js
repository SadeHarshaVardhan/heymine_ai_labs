const { ensureSupabase, supabaseAuth } = require("../config/supabase");

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const token = authHeader.slice("Bearer ".length).trim();
    const supabase = ensureSupabase(supabaseAuth);
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({
        success: false,
        error: "Invalid or expired session",
      });
    }

    req.user = data.user;
    req.accessToken = token;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { requireAuth };
