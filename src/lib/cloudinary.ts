export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_MB = 5;

/**
 * Unsigned upload straight from the browser to Cloudinary (needs an *unsigned*
 * upload preset). XMLHttpRequest instead of fetch so we get real progress events.
 * Resolves with the secure image URL.
 */
export function uploadImage(file: File, onProgress?: (percent: number) => void, folder = "posts"): Promise<string> {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!cloud || !preset) return Promise.reject(new Error("ছবি আপলোডের সেটিংস দেওয়া হয়নি।"));

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloud}/image/upload`);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const url = (JSON.parse(xhr.responseText) as { secure_url?: string }).secure_url;
          return url ? resolve(url) : reject(new Error("ছবি আপলোড করা যায়নি।"));
        } catch {
          return reject(new Error("ছবি আপলোড করা যায়নি।"));
        }
      }
      reject(new Error("ছবি আপলোড করা যায়নি। আবার চেষ্টা করুন।"));
    };
    xhr.onerror = () => reject(new Error("ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।"));

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", preset);
    form.append("folder", folder);
    xhr.send(form);
  });
}
