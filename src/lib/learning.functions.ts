import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabase as publicClient } from "@/integrations/supabase/client";
import { z } from "zod";

export const listModulesPublic = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient
    .from("learning_modules")
    .select("id, discipline, section_slug, title, description")
    .order("discipline")
    .order("title");
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getModulePublic = createServerFn({ method: "GET" })
  .inputValidator((i: { discipline: string; slug: string }) => i)
  .handler(async ({ data }) => {
    const { data: mod, error } = await publicClient
      .from("learning_modules")
      .select("*")
      .eq("discipline", data.discipline)
      .eq("section_slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!mod) return null;
    const { data: quizzes } = await publicClient
      .from("skill_quizzes")
      .select("id, question, choices")
      .eq("module_id", mod.id);
    return { module: mod, quizzes: quizzes ?? [] };
  });

const moduleSchema = z.object({
  id: z.string().uuid().optional(),
  discipline: z.string().min(1),
  section_slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  video_url: z.string().optional().nullable(),
  documentation_body: z.string().optional().nullable(),
});

export const adminUpsertModule = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => moduleSchema.parse(i))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userId);
    if (!roles?.some((r: { role: string }) => r.role === "admin")) throw new Error("Forbidden");
    const payload = { ...data, updated_at: new Date().toISOString(), created_by: userId };
    const { error } = data.id
      ? await supabase.from("learning_modules").update(payload).eq("id", data.id)
      : await supabase.from("learning_modules").insert(payload);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteModule = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { id: string }) => i)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userId);
    if (!roles?.some((r: { role: string }) => r.role === "admin")) throw new Error("Forbidden");
    const { error } = await supabase.from("learning_modules").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
