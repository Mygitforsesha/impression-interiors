const TRANSFORMS = {
  grid: "w_300,q_auto,f_auto",
  detail: "w_800,q_auto,f_auto",
  fullscreen: "w_1200,q_auto,f_auto",
};

export function transformImage(url, type) {
  if (!url || typeof url !== "string") return url;
  const transform = TRANSFORMS[type];
  if (!transform) return url;

  // Only transform Cloudinary URLs.
  const marker = "/upload/";
  const idx = url.indexOf(marker);
  if (idx === -1) return url;

  const before = url.slice(0, idx + marker.length);
  const after = url.slice(idx + marker.length);

  // If URL already has transformations (e.g. ".../upload/w_300,.../v123/file"),
  // we prepend ours to ensure bandwidth-safe defaults.
  return `${before}${transform}/${after}`;
}

