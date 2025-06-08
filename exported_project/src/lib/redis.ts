// Simulăm funcționalitatea Redis pentru dezvoltare locală
let cache: { [key: string]: any } = {};

export async function getCache(key: string): Promise<any> {
  return cache[key];
}

export async function setCache(key: string, value: any, ttl?: number): Promise<void> {
  cache[key] = value;
  if (ttl) {
    setTimeout(() => {
      delete cache[key];
    }, ttl * 1000);
  }
}

export async function deleteCache(key: string): Promise<void> {
  delete cache[key];
}

export async function clearCache(): Promise<void> {
  cache = {};
}
