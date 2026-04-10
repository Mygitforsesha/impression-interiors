const OWNER = process.env.REACT_APP_GITHUB_OWNER;
const REPO = process.env.REACT_APP_GITHUB_REPO;
const BRANCH = process.env.REACT_APP_GITHUB_BRANCH || "main";
const TOKEN = process.env.REACT_APP_GITHUB_TOKEN;
const LEADS_PATH = process.env.REACT_APP_GITHUB_LEADS_PATH || "data/leads.json";

function requireConfig() {
  if (!OWNER || !REPO || !LEADS_PATH) {
    throw new Error(
      "GitHub leads config missing. Set REACT_APP_GITHUB_OWNER, REACT_APP_GITHUB_REPO and REACT_APP_GITHUB_LEADS_PATH.",
    );
  }
}

function headers() {
  const h = { Accept: "application/vnd.github+json" };
  if (TOKEN) h.Authorization = `Bearer ${TOKEN}`;
  return h;
}

function decodeBase64Json(base64) {
  if (!base64) return [];
  const binary = atob(base64.replace(/\n/g, ""));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  const json = new TextDecoder().decode(bytes);
  return JSON.parse(json);
}

function encodeBase64Json(data) {
  const json = JSON.stringify(data, null, 2);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function normalizeLead(item) {
  if (!item || typeof item !== "object") return null;
  return {
    id: typeof item.id === "number" ? item.id : Date.now(),
    name: typeof item.name === "string" ? item.name : "",
    phone: typeof item.phone === "string" ? item.phone : "",
    message: typeof item.message === "string" ? item.message : "",
    budget: typeof item.budget === "string" ? item.budget : "",
    propertyType: typeof item.propertyType === "string" ? item.propertyType : "",
    createdAt: typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString(),
  };
}

export async function fetchLeads() {
  requireConfig();
  const res = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${LEADS_PATH}?ref=${encodeURIComponent(
      BRANCH,
    )}`,
    { headers: headers() },
  );

  if (res.status === 404) return { leads: [], fileMeta: null };

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Leads fetch failed (${res.status}). ${text}`);
  }

  const data = await res.json();
  const decoded = data?.content ? decodeBase64Json(data.content) : [];
  const leads = Array.isArray(decoded)
    ? decoded.map(normalizeLead).filter(Boolean)
    : [];

  return { leads, fileMeta: data };
}

export async function saveLeads(updatedLeads, sha) {
  requireConfig();
  if (!TOKEN) {
    throw new Error("GitHub token missing. Set REACT_APP_GITHUB_TOKEN.");
  }

  const content = encodeBase64Json(updatedLeads);
  const res = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${LEADS_PATH}`,
    {
      method: "PUT",
      headers: {
        ...headers(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "update leads",
        content,
        branch: BRANCH,
        ...(sha ? { sha } : {}),
      }),
    },
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Leads save failed (${res.status}). ${text}`);
  }

  return res.json();
}

export async function addLead(newLead) {
  const lead = normalizeLead(newLead);
  if (!lead) throw new Error("Invalid lead");

  const { leads, fileMeta } = await fetchLeads();
  const updated = [lead, ...leads];
  await saveLeads(updated, fileMeta?.sha);
  return lead;
}

