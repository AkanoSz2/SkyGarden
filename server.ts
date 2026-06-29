import 'dotenv/config';

import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getPlayerData, getProfileData } from './src/features/playerStats';
import { getBazaarPrice } from './src/features/itemPrices';
import { readCache, writeCache, isCacheFresh } from './src/cache/cache';

const PLAYER_CACHE_FILE = './src/cache/playerCache.json';
// const PLAYER_CACHE_TTL = 1000 * 60 * 5 ; // 5 minutes
const PLAYER_CACHE_TTL = 1000; // 1s dev mode


const BAZAAR_CACHE_FILE = './src/cache/bazaarCache.json';
const BAZAAR_CACHE_TTL = 1000 * 60 * 60; // 1 hour

const getCachedPlayer = (key: string) => {
    const cache = readCache<Record<string, any>>(PLAYER_CACHE_FILE);
    if (!cache) return null;
    const entry = cache.data[key];
    if (!entry || Date.now() - entry.timestamp > PLAYER_CACHE_TTL) return null;
    return entry.data;
};

const cachePlayer = (key: string, data: any) => {
    // console.log(data)
    const cache = readCache<Record<string, any>>(PLAYER_CACHE_FILE)?.data ?? {};
    cache[key] = { data, timestamp: Date.now() };
    writeCache(PLAYER_CACHE_FILE, cache);
};

async function refreshBazaarCache() {
    const data = await getBazaarPrice();
    writeCache(BAZAAR_CACHE_FILE, data);
    console.log('Bazaar cache updated');
}

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
        const cached = getCachedPlayer(cacheKey);
        if (cached) {
            console.log('Cache hit:', cacheKey);
            return c.json(cached);
        }
        const { uuid, profiles } = await getPlayerData(name);
        const data = await getProfileData(uuid, profiles, profile);
        cachePlayer(cacheKey, data);
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
        const cached = getCachedPlayer(cacheKey);
        if (cached) {
            console.log('Cache hit:', cacheKey);
            return c.json(cached);
        }
        const { uuid, profiles } = await getPlayerData(name);
        const data = await getProfileData(uuid, profiles, profile);
        cachePlayer(cacheKey, data);
        return c.json(data);
    } catch (e) {
        return c.json({ error: e instanceof Error ? e.message : 'Unknown error' }, 500);
    }
});


async function onLoad() {
    console.log("Server initializing...");
    if (isCacheFresh(BAZAAR_CACHE_FILE, BAZAAR_CACHE_TTL)) {
        console.log('Bazaar cache hit');
    } else {
        await refreshBazaarCache();
    }
    setInterval(refreshBazaarCache, BAZAAR_CACHE_TTL);
}

onLoad()
    .then(() => {
        serve({ fetch: app.fetch, port: 3001 });
        console.log('Server running on http://localhost:3001');
    })
    .catch((e) => {
        console.error('Startup encountered an error, starting server regardless:', e);
        serve({ fetch: app.fetch, port: 3001 });
        console.log('Server running on http://localhost:3001 (degraded startup)');
    });