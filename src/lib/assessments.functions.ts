import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const listMyCredentials = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("user_credentials")
      .select("*")
      .eq("user_id", userId)
      .order("verified_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const submitQuiz = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({
      moduleId: z.string().uuid(),
      answers: z.record(z.string(), z.string()),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: mod } = await supabase
      .from("learning_modules")
      .select("id, title")
      .eq("id", data.moduleId)
      .maybeSingle();
    if (!mod) throw new Error("Module not found");
    const { data: quizzes, error } = await supabase
      .from("skill_quizzes")
      .select("id, correct_answer")
      .eq("module_id", data.moduleId);
    if (error) throw new Error(error.message);
    if (!quizzes || quizzes.length === 0) throw new Error("No quiz available");
    const total = quizzes.length;
    let correct = 0;
    for (const q of quizzes as { id: string; correct_answer: string }[]) {
      if (data.answers[q.id] === q.correct_answer) correct++;
    }
    const score = Math.round((correct / total) * 100);
    let credentialId: string | null = null;
    if (score >= 80) {
      const { data: cred, error: cErr } = await supabase
        .from("user_credentials")
        .insert({
          user_id: userId,
          credential_name: `${mod.title} — Certified`,
          score,
          module_id: data.moduleId,
        })
        .select("id")
        .maybeSingle();
      if (cErr) throw new Error(cErr.message);
      credentialId = cred?.id ?? null;
    }
    return { score, correct, total, passed: score >= 80, credentialId };
  });
