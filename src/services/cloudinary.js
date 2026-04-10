const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

export async function uploadImage(file, { onProgress } = {}) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary is not configured. Set REACT_APP_CLOUDINARY_CLOUD_NAME and REACT_APP_CLOUDINARY_UPLOAD_PRESET.",
    );
  }
  if (!file) throw new Error("No file provided");

  // Use XHR to support upload progress (fetch doesn't expose it reliably).
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const secureUrl = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.upload.onprogress = (evt) => {
      if (!onProgress || !evt.lengthComputable) return;
      const pct = Math.round((evt.loaded / evt.total) * 100);
      onProgress(pct);
    };

    xhr.onerror = () => reject(new Error("Cloudinary upload failed"));
    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (!data?.secure_url) {
          reject(new Error(data?.error?.message || "Cloudinary upload failed"));
          return;
        }
        resolve(data.secure_url);
      } catch {
        reject(new Error("Cloudinary upload failed"));
      }
    };

    xhr.send(formData);
  });

  return secureUrl;
}

export async function uploadImages(files, { onProgress } = {}) {
  const list = Array.from(files || []);
  const urls = [];

  for (let i = 0; i < list.length; i++) {
    const file = list[i];
    const url = await uploadImage(file, {
      onProgress: (pct) => {
        if (!onProgress) return;
        onProgress({ index: i, total: list.length, pct });
      },
    });
    urls.push(url);
  }

  return urls;
}

