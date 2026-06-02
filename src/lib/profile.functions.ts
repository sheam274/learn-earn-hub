import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userId);
    const isAdmin = !!roles?.some((r: { role: string }) => r.role === "admin");
    return { profile, isAdmin };
  });

export const upsertMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { name?: string; discipline?: string; skills?: string[] }) => input)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("profiles")
      .update({
        name: data.name ?? null,
        discipline: data.discipline ?? null,
        skills: data.skills ?? [],
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
