const OWNER = process.env.REACT_APP_GITHUB_OWNER;
const REPO = process.env.REACT_APP_GITHUB_REPO;
const BRANCH = process.env.REACT_APP_GITHUB_BRANCH || "main";
const PATH = process.env.REACT_APP_GITHUB_PROJECTS_PATH || "data/projects.json";
const TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

function requireConfig() {
  if (!OWNER || !REPO || !PATH) {
    throw new Error(
      "GitHub is not configured. Set REACT_APP_GITHUB_OWNER, REACT_APP_GITHUB_REPO, and REACT_APP_GITHUB_PROJECTS_PATH.",
    );
  }
}

function headers() {
  const h = {
    Accept: "application/vnd.github+json",
  };
  if (TOKEN) h.Authorization = `Bearer ${TOKEN}`;
  return h;
}

function decodeBase64Json(base64) {
  if (!base64) return [];
  const json = atob(base64.replace(/\n/g, ""));
  return JSON.parse(json);
}

function encodeBase64Json(data) {
  return btoa(JSON.stringify(data, null, 2));
}

export async function fetchProjects() {
  requireConfig();

  const res = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}?ref=${encodeURIComponent(
      BRANCH,
    )}`,
    { headers: headers() },
  );

  if (res.status === 404) {
    return { projects: [], fileMeta: null };
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GitHub fetch failed (${res.status}). ${text}`);
  }

  const data = await res.json();
  const projects = data?.content ? decodeBase64Json(data.content) : [];

  return { projects: Array.isArray(projects) ? projects : [], fileMeta: data };
}

export async function updateProjects(updatedData, { sha, message } = {}) {
  requireConfig();
  if (!TOKEN) {
    throw new Error(
      "GitHub token is missing. Set REACT_APP_GITHUB_TOKEN to enable updates.",
    );
  }

  const content = encodeBase64Json(updatedData);

  const res = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`,
    {
      method: "PUT",
      headers: {
        ...headers(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message || "update projects",
        content,
        branch: BRANCH,
        ...(sha ? { sha } : {}),
      }),
    },
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GitHub update failed (${res.status}). ${text}`);
  }

  const data = await res.json();
  return data;
}

