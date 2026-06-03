import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Fetches real remote jobs from the public Remotive API (no auth required, CORS-free server-side).
 * https://remotive.com/api-documentation
 */
export const listRemoteJobsExternal = createServerFn({ method: "GET" })
  .inputValidator((i: unknown) =>
    z
      .object({
        search: z.string().max(120).optional(),
        category: z.string().max(80).optional(),
        limit: z.number().int().min(1).max(50).optional(),
      })
      .parse(i ?? {}),
  )
  .handler(async ({ data }) => {
    const params = new URLSearchParams();
    if (data.search) params.set("search", data.search);
    if (data.category) params.set("category", data.category);
    if (data.limit) params.set("limit", String(data.limit));
    const url = `https://remotive.com/api/remote-jobs?${params.toString()}`;

    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "TalentBD/1.0 (+https://talentbd.app)" },
      });
      if (!res.ok) throw new Error(`Remotive responded ${res.status}`);
      const json: any = await res.json();
      const jobs = Array.isArray(json?.jobs) ? json.jobs : [];
      return jobs.slice(0, data.limit ?? 30).map((j: any) => ({
        id: String(j.id),
        title: j.title ?? "Untitled role",
        company: j.company_name ?? "Unknown company",
        company_logo: j.company_logo ?? null,
        category: j.category ?? null,
        job_type: j.job_type ?? null,
        location: j.candidate_required_location ?? "Worldwide",
        salary: j.salary ?? null,
        url: j.url ?? null,
        publication_date: j.publication_date ?? null,
        tags: Array.isArray(j.tags) ? j.tags.slice(0, 8) : [],
      }));
    } catch (e: any) {
      // Fail soft so the page still renders
      return [];
    }
  });
