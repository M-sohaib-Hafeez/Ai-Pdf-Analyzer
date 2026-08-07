import { AnalysisResult, BatchAnalysisResult } from '../types';

const DB_NAME = 'pdf_analyzer_db';
const DB_VERSION = 1;
const STORE_NAME = 'analysis_history';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser environment.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(request.error || new Error('Failed to open IndexedDB.'));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

/**
 * Load all stored history entries from IndexedDB.
 */
export async function loadHistoryFromIDB(): Promise<Array<AnalysisResult | BatchAnalysisResult>> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const results = request.result as Array<AnalysisResult | BatchAnalysisResult>;
        // Sort descending by processedAt or createdAt if present
        results.sort((a, b) => {
          const timeA = 'processedAt' in a ? a.processedAt : ('createdAt' in a ? a.createdAt : '');
          const timeB = 'processedAt' in b ? b.processedAt : ('createdAt' in b ? b.createdAt : '');
          return timeB.localeCompare(timeA);
        });
        resolve(results);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (err) {
    console.warn('Failed to load history from IndexedDB:', err);
    return [];
  }
}

/**
 * Save an analysis result entry to IndexedDB.
 */
export async function saveAnalysisToIDB(item: AnalysisResult | BatchAnalysisResult): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(item);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error || new Error('Failed to save to IndexedDB'));
  });
}

/**
 * Delete an analysis entry by ID from IndexedDB.
 */
export async function deleteAnalysisFromIDB(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error || new Error('Failed to delete from IndexedDB'));
  });
}

/**
 * Clear all history entries from IndexedDB.
 */
export async function clearAllHistoryFromIDB(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error || new Error('Failed to clear IndexedDB'));
  });
}
