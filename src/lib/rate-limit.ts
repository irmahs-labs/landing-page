import "server-only";

const WINDOW_MS = 60_000;
/** Questions one visitor can ask a minute, so nobody runs up the bill */
export const MAX_PER_WINDOW = 8;

// When each visitor's current window started and how much of it they've used
const visitors = new Map<string, { count: number; start: number }>();

/** Whether this visitor may ask another question now, counting it if so */
export const allowRequest = (visitor: string, now = Date.now()): boolean => {
  // Forget windows that have run out, so the map doesn't grow forever
  for (const [key, entry] of visitors) {
    if (now - entry.start >= WINDOW_MS) {
      visitors.delete(key);
    }
  }
  const entry = visitors.get(visitor);
  if (!entry) {
    visitors.set(visitor, { count: 1, start: now });
    return true;
  }
  if (entry.count >= MAX_PER_WINDOW) {
    return false;
  }
  entry.count += 1;
  return true;
};
