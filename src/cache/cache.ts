import { readFileSync, writeFileSync, existsSync } from 'fs';

type CacheEntry<T> = {
    data: T;
    timestamp: number;
};

export function readCache<T>(file: string): CacheEntry<T> | null {
    if (!existsSync(file)) return null;
    return JSON.parse(readFileSync(file, 'utf-8'));
}

export function writeCache<T>(file: string, data: T) {
    writeFileSync(file, JSON.stringify({ data, timestamp: Date.now() }, null, 2));
}

export function isCacheFresh(file: string, ttl: number): boolean {
    const cache = readCache(file);
    if (!cache) return false;
    return Date.now() - cache.timestamp < ttl;
}

export function getCached<T>(file: string, ttl: number): T | null {
    if (!isCacheFresh(file, ttl)) return null;
    return readCache<T>(file)!.data;
}