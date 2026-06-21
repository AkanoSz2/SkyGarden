import 'dotenv/config';
import { readFileSync, writeFileSync, existsSync } from 'fs';

import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getPlayerData, getProfileData } from './src/features/playerStats';

const CACHE_FILE = './cache.json';
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

type CacheEntry = { data: any; timestamp: number };
type Cache = Record<string, CacheEntry>;

const cache: Cache = existsSync(CACHE_FILE)
    ? JSON.parse(readFileSync(CACHE_FILE, 'utf-8'))
    : {};

const saveCache = () => writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));

const getCached = (key: string) => {
    const entry = cache[key];
    if (entry && Date.now() - entry.timestamp < CACHE_TTL) return entry.data;
    return null;
};

const app = new Hono();
app.use('*', cors());

app.get('/player/:name', async (c) => {
    const name = c.req.param('name');
    if (!name) return c.json({ error: 'Missing name' }, 400);
    try {
        const { uuid, profiles } = await getPlayerData(name);
        return c.json({
            uuid,
            profiles: profiles.map(p => ({ name: p.cute_name, selected: p.selected ?? false }))
        });
    } catch (e) {
        return c.json({ error: e instanceof Error ? e.message : 'Unknown error' }, 500);
    }
});

app.get('/player/:name/:profile', async (c) => {
    const name = c.req.param('name');
    const profile = c.req.param('profile');
    if (!name || !profile) return c.json({ error: 'Missing params' }, 400);
    try {
        const cacheKey = `${name}_${profile}`;
        const cached = getCached(cacheKey);
        if (cached) {
            console.log('Cache hit:', cacheKey);
            return c.json(cached);
        }
        const { uuid, profiles } = await getPlayerData(name);
        const data = await getProfileData(uuid, profiles, profile);
        cache[cacheKey] = { data, timestamp: Date.now() };
        saveCache();
        return c.json(data);
    } catch (e) {
        return c.json({ error: e instanceof Error ? e.message : 'Unknown error' }, 500);
    }
});

app.get('/player/:name/:profile.json', async (c) => {
    const name = c.req.param('name');
    const profile = c.req.param('profile')?.replace('.json', '');
    if (!name || !profile) return c.json({ error: 'Missing params' }, 400);
    try {
        const cacheKey = `${name}_${profile}`;
        const cached = getCached(cacheKey);
        if (cached) {
            console.log('Cache hit:', cacheKey);
            return c.json(cached);
        }
        const { uuid, profiles } = await getPlayerData(name);
        const data = await getProfileData(uuid, profiles, profile);
        cache[cacheKey] = { data, timestamp: Date.now() };
        saveCache();
        return c.json(data);
    } catch (e) {
        return c.json({ error: e instanceof Error ? e.message : 'Unknown error' }, 500);
    }
});

serve({ fetch: app.fetch, port: 3001 });
console.log('Server running on http://localhost:3001');