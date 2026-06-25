import { c as createServerRpc } from "./createServerRpc-DsKw3SU9.mjs";
import { c as createServerFn } from "./server-XhNC2-Ux.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, n as numberType, s as stringType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
const listRemoteJobsExternal_createServerFn_handler = createServerRpc({
  id: "4cb63ed0d692bb9d7aac965617c99fbdf92832cb1010db00e07395aa7083dc49",
  name: "listRemoteJobsExternal",
  filename: "src/lib/external-jobs.functions.ts"
}, (opts) => listRemoteJobsExternal.__executeServer(opts));
const listRemoteJobsExternal = createServerFn({
  method: "GET"
}).inputValidator((i) => objectType({
  search: stringType().max(120).optional(),
  category: stringType().max(80).optional(),
  limit: numberType().int().min(1).max(50).optional()
}).parse(i ?? {})).handler(listRemoteJobsExternal_createServerFn_handler, async ({
  data
}) => {
  const params = new URLSearchParams();
  if (data.search) params.set("search", data.search);
  if (data.category) params.set("category", data.category);
  if (data.limit) params.set("limit", String(data.limit));
  const url = `https://remotive.com/api/remote-jobs?${params.toString()}`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "TalentBD/1.0 (+https://talentbd.app)"
      }
    });
    if (!res.ok) throw new Error(`Remotive responded ${res.status}`);
    const json = await res.json();
    const jobs = Array.isArray(json?.jobs) ? json.jobs : [];
    return jobs.slice(0, data.limit ?? 30).map((j) => ({
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
      tags: Array.isArray(j.tags) ? j.tags.slice(0, 8) : []
    }));
  } catch (e) {
    return [];
  }
});
export {
  listRemoteJobsExternal_createServerFn_handler
};
