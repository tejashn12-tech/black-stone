/**
 * High-performance, quota-safe local photo storage using browser IndexedDB.
 * Works seamlessly alongside Firestore cloud database to ensure member photos
 * are permanently saved, load instantly on page load, and never get deleted on refresh.
 */

const DB_NAME = 'BSF_PHOTO_CACHE_DB';
const DB_VERSION = 1;
const STORE_NAME = 'member_photos';

let dbInstance: IDBDatabase | null = null;

function openPhotoDB(): Promise<IDBDatabase> {
  if (dbInstance) {
    return Promise.resolve(dbInstance);
  }

  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        dbInstance = (event.target as IDBOpenDBRequest).result;
        resolve(dbInstance);
      };

      request.onerror = (event) => {
        console.warn('IndexedDB photo cache open error:', (event.target as IDBOpenDBRequest).error);
        reject((event.target as IDBOpenDBRequest).error);
      };
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Save a member's photo data URL to IndexedDB.
 */
export async function savePhotoToIndexedDB(memberId: string, photoUrl: string): Promise<void> {
  if (!memberId || !photoUrl) return;
  try {
    const db = await openPhotoDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const record = {
        id: memberId,
        photoUrl,
        updatedAt: Date.now()
      };
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`[PhotoCache] Failed to save photo to IndexedDB for ${memberId}:`, err);
  }
}

/**
 * Retrieve a member's photo from IndexedDB.
 */
export async function getPhotoFromIndexedDB(memberId: string): Promise<string | null> {
  if (!memberId) return null;
  try {
    const db = await openPhotoDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(memberId);
      req.onsuccess = () => {
        if (req.result && req.result.photoUrl) {
          resolve(req.result.photoUrl);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Retrieve all member photos as a key-value dictionary { [memberId]: photoUrl }.
 */
export async function getAllPhotosFromIndexedDB(): Promise<Record<string, string>> {
  try {
    const db = await openPhotoDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const result: Record<string, string> = {};
        if (Array.isArray(req.result)) {
          for (const item of req.result) {
            if (item && item.id && item.photoUrl) {
              result[item.id] = item.photoUrl;
            }
          }
        }
        resolve(result);
      };
      req.onerror = () => resolve({});
    });
  } catch {
    return {};
  }
}

/**
 * Delete a photo from IndexedDB for a given member.
 */
export async function deletePhotoFromIndexedDB(memberId: string): Promise<void> {
  if (!memberId) return;
  try {
    const db = await openPhotoDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(memberId);
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
    });
  } catch {
    // Ignore
  }
}

/**
 * Helper to compress and format image files or data URLs into an optimized,
 * clean square JPEG (default 500x500, quality 0.82) suitable for Firestore & avatars.
 */
export function compressImageToDataUrl(
  input: File | Blob | string,
  targetDimension = 500,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const loadImage = (src: string) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const size = Math.min(img.width, img.height);
          const startX = (img.width - size) / 2;
          const startY = (img.height - size) / 2;

          canvas.width = targetDimension;
          canvas.height = targetDimension;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(src);
            return;
          }

          // Render high-quality scaled image
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, startX, startY, size, size, 0, 0, targetDimension, targetDimension);

          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed);
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = (e) => reject(e);
      img.src = src;
    };

    if (typeof input === 'string') {
      loadImage(input);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          loadImage(e.target.result as string);
        } else {
          reject(new Error('Failed to read image file'));
        }
      };
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(input);
    }
  });
}
