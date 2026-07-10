import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../firebase.config';

function safeFileName(file) {
  const extension = file.name.includes('.') ? file.name.split('.').pop().toLowerCase() : 'jpg';
  const uniqueId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${uniqueId}.${extension}`;
}

export async function uploadReviewPhotos(files, userId, orderId) {
  return Promise.all(files.map(async (file) => {
    const path = `reviews/${userId}/${orderId}/${safeFileName(file)}`;
    const photoRef = ref(storage, path);
    await uploadBytes(photoRef, file, { contentType: file.type });
    return { path, url: await getDownloadURL(photoRef) };
  }));
}

export async function removeUploadedReviewPhotos(photos) {
  await Promise.allSettled(photos.map((photo) => deleteObject(ref(storage, photo.path))));
}
