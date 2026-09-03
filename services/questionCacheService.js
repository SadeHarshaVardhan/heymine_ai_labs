const { ensureSupabase, supabaseAdmin } = require("../config/supabase");

function normalizePart(value, fallback) {
  return String(value || fallback)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || fallback;
}

function buildCacheKey(difficulty, topic) {
  return `${normalizePart(difficulty, "easy")}_${normalizePart(topic, "general")}`;
}

function fromDbQuestion(row) {
  return {
    id: row.id,
    title: row.title,
    difficulty: row.difficulty,
    topic: row.topic,
    description: row.description,
    constraints: row.constraints || [],
    examples: row.examples || [],
    testCases: row.test_cases || [],
    cached: true,
  };
}

async function findCachedQuestion(difficulty, topic, userId) {
  const supabase = ensureSupabase(supabaseAdmin);
  const cacheKey = buildCacheKey(difficulty, topic);

  const { data: attemptedRows, error: attemptsError } = await supabase
    .from("question_attempts")
    .select("question_id")
    .eq("user_id", userId);
  if (attemptsError) throw attemptsError;

  const attemptedIds = (attemptedRows || []).map((row) => row.question_id);
  let query = supabase
    .from("questions")
    .select("*")
    .eq("cache_key", cacheKey)
    .order("usage_count", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(1);

  if (attemptedIds.length) {
    query = query.not("id", "in", `(${attemptedIds.join(",")})`);
  }

  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data ? fromDbQuestion(data) : null;
}

async function saveQuestion(problem, difficulty, topic) {
  const supabase = ensureSupabase(supabaseAdmin);
  const cacheKey = buildCacheKey(difficulty, topic);
  const { data, error } = await supabase
    .from("questions")
    .insert({
      title: problem.title,
      difficulty: normalizePart(difficulty, "easy"),
      topic: normalizePart(topic, "general"),
      cache_key: cacheKey,
      description: problem.description,
      constraints: problem.constraints || [],
      examples: problem.examples || [],
      test_cases: problem.testCases || [],
    })
    .select("*")
    .single();

  if (error) throw error;
  return fromDbQuestion(data);
}

async function incrementUsage(questionId) {
  const supabase = ensureSupabase(supabaseAdmin);
  const { error } = await supabase.rpc("increment_question_usage", {
    question_uuid: questionId,
  });
  if (error) throw error;
}

async function recordAttempt(userId, questionId, language = null, status = "attempted") {
  const supabase = ensureSupabase(supabaseAdmin);
  const { error } = await supabase
    .from("question_attempts")
    .upsert(
      {
        user_id: userId,
        question_id: questionId,
        language,
        status,
      },
      { onConflict: "user_id,question_id" },
    );
  if (error) throw error;
}

module.exports = {
  buildCacheKey,
  findCachedQuestion,
  saveQuestion,
  incrementUsage,
  recordAttempt,
};
