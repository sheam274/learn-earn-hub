import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabase as publicClient } from "@/integrations/supabase/client";
import { z } from "zod";

export const listJobsPublic = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient
    .from("job_marketplace")
    .select("*")
    .eq("is_live", true)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

const jobSchema = z.object({
  id: z.string().uuid().optional(),
  job_title: z.string().min(1),
  company: z.string().min(1),
  description: z.string().optional().nullable(),
  is_remote: z.boolean(),
  salary_range: z.string().optional().nullable(),
  requirements: z.array(z.string()),
  discipline: z.string().optional().nullable(),
  is_live: z.boolean(),
});

async function assertAdmin(supabase: any, userId: string) {
  const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  if (!roles?.some((r: { role: string }) => r.role === "admin")) throw new Error("Forbidden");
}

export const adminListJobs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("job_marketplace")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminUpsertJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => jobSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = data.id
      ? await context.supabase.from("job_marketplace").update(data).eq("id", data.id)
      : await context.supabase.from("job_marketplace").insert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminToggleJobLive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { id: string; is_live: boolean }) => i)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("job_marketplace")
      .update({ is_live: data.is_live })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { id: string }) => i)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("job_marketplace").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
