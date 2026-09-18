const { ensureSupabase, supabaseAuth, supabaseAdmin } = require("../config/supabase");

function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    username: user.user_metadata?.username || null,
  };
}

function resolveFrontendUrl(req) {
  // Always prefer the explicitly configured FRONTEND_URL.
  // Only fall back to the request origin/host for local dev without a configured env var.
  const envUrl = process.env.FRONTEND_URL;
  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/$/, "");
  }
  const fallback = req.headers.origin || `${req.protocol}://${req.get("host")}`;
  return fallback.trim().replace(/\/$/, "");
}

exports.register = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" });
    }

    const supabase = ensureSupabase(supabaseAuth);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username: username || email.split("@")[0] },
        emailRedirectTo: `${resolveFrontendUrl(req)}/login`,
      },
    });

    if (error) return res.status(400).json({ success: false, error: error.message });

    return res.status(201).json({
      success: true,
      user: publicUser(data.user),
      session: data.session,
      message: data.session ? "Registered successfully" : "Check your email to confirm your account",
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" });
    }

    const supabase = ensureSupabase(supabaseAuth);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(401).json({ success: false, error: error.message });

    return res.json({
      success: true,
      user: publicUser(data.user),
      session: data.session,
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (_req, res) => {
  return res.json({ success: true });
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email, redirectToUrl } = req.body;
    if (!email) return res.status(400).json({ success: false, error: "Email is required" });

    const redirectTo = redirectToUrl || `${resolveFrontendUrl(req)}/reset-password`;

    const supabase = ensureSupabase(supabaseAuth);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) return res.status(400).json({ success: false, error: error.message });

    return res.json({ success: true, message: "Password reset email sent" });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { accessToken, password } = req.body;
    if (!accessToken || !password) {
      return res.status(400).json({ success: false, error: "Reset token and password are required" });
    }

    const supabase = ensureSupabase(supabaseAuth);
    const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);
    if (userError || !userData?.user) {
      return res.status(401).json({ success: false, error: "Invalid or expired reset session. Please request a new reset email." });
    }

    const adminSupabase = ensureSupabase(supabaseAdmin);
    const { error: updateError } = await adminSupabase.auth.admin.updateUserById(userData.user.id, { password });
    if (updateError) return res.status(400).json({ success: false, error: updateError.message });

    return res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};
