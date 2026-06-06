import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabase as publicClient } from "@/integrations/supabase/client";
import { z } from "zod";

export const listJobsPublic = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient
    .from("job_marketplace")
    .select("*")
    .eq("is_live", true)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getJobPublic = createServerFn({ method: "GET" })
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    const { data: job, error } = await publicClient
      .from("job_marketplace")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return job;
  });

export const getMyApplicationForJob = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ jobId: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: app, error } = await context.supabase
      .from("job_applications")
      .select("id, status, created_at, cover_note")
      .eq("job_id", data.jobId)
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return app;
  });

export const listCompaniesPublic = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient.from("companies").select("*").order("name");
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getCompanyBySlug = createServerFn({ method: "GET" })
  .inputValidator((i: unknown) => z.object({ slug: z.string().min(1).max(120) }).parse(i))
  .handler(async ({ data }) => {
    const { data: company, error } = await publicClient
      .from("companies")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!company) return null;
    const { data: jobs } = await publicClient
      .from("job_marketplace")
      .select("*")
      .eq("is_live", true)
      .or(`company_id.eq.${company.id},company.eq.${company.name}`)
      .order("created_at", { ascending: false });
    return { company, jobs: jobs ?? [] };
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
  category: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  experience_level: z.string().optional().nullable(),
  job_type: z.string().optional().nullable(),
  application_deadline: z.string().optional().nullable(),
  is_featured: z.boolean().optional(),
  company_id: z.string().uuid().optional().nullable(),
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

/* Applications */

export const applyToJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({ jobId: z.string().uuid(), coverNote: z.string().max(2000).optional() }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("job_applications")
      .insert({ job_id: data.jobId, user_id: context.userId, cover_note: data.coverNote ?? null });
    if (error && !error.message.toLowerCase().includes("duplicate")) throw new Error(error.message);
    return { ok: true };
  });

export const listMyApplications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("job_applications")
      .select("id, status, created_at, cover_note, job:job_marketplace(id, job_title, company, location, is_remote, application_deadline)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const withdrawApplication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { id: string }) => i)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("job_applications")
      .delete()
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* Companies admin */

const companySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "lowercase letters, numbers, dashes only"),
  logo_url: z.string().url().optional().nullable().or(z.literal("")),
  website: z.string().url().optional().nullable().or(z.literal("")),
  industry: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export const adminListCompanies = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase.from("companies").select("*").order("name");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminUpsertCompany = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => companySchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const payload = { ...data, logo_url: data.logo_url || null, website: data.website || null };
    const { error } = data.id
      ? await context.supabase.from("companies").update(payload).eq("id", data.id)
      : await context.supabase.from("companies").insert(payload);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteCompany = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { id: string }) => i)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("companies").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
