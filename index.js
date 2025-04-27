const express = require('express');
const query = require('source-server-query');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Cache setup
let cachedResponse = null;
let lastCacheTime = 0;
const CACHE_TTL = 30 * 1000; // 30 seconds

async function getPublicIP() {
  try {
    const res = await axios.get('https://api.ipify.org');
    return res.data.trim();
  } catch (error) {
    console.error('Failed to get public IP:', error.message);
    return '127.0.0.1';
  }
}

async function fetchServerInfo(ip, port) {
  try {
    const info = await query.info(ip, port, 1500);
    const players = await query.players(ip, port, 1500);

    const maxPlayers = info.max_players ?? 'N/A';
    const currentPlayers = info.players ?? 'N/A';
    const map = info.map ?? 'N/A';
    const name = info.name ?? 'Unnamed Server';
    const bots = info.bots ?? 0;

    // Human-readable mappings
    const serverTypeMap = { d: 'dedicated', l: 'listen', p: 'SourceTV proxy' };
    const environmentMap = { l: 'Linux', w: 'Windows', m: 'macOS', o: 'macOS' };
    const visibilityMap = { 0: 'public', 1: 'private' };
    const vacStatusMap = { 0: 'disabled', 1: 'enabled' };

    return {
      name,
      address: `${ip}:${port}`,
      map,
      players: `${currentPlayers}/${maxPlayers}`,
      bots,
      server_type: serverTypeMap[info.server_type] ?? info.server_type,
      environment: environmentMap[info.environment] ?? info.environment,
      visibility: visibilityMap[info.visibility] ?? info.visibility,
      vac: vacStatusMap[info.vac] ?? info.vac,
      version: info.version ?? 'unknown',
      player_list: players.map(p => ({
        name: p.name,
        score: p.score,
        duration: p.duration
      }))
    };
  } catch (error) {
    console.warn(`Server offline or unreachable at ${ip}:${port}`);
    return null;
  }
}

app.get('/health-check', async (req, res) => {
  const now = Date.now();
  if (cachedResponse && now - lastCacheTime < CACHE_TTL) {
    return res.json(cachedResponse);
  }

  const publicIP = await getPublicIP();
  const ports = Array.from({ length: 11 }, (_, i) => 27015 + i);

  const results = await Promise.all(
    ports.map(port => fetchServerInfo(publicIP, port))
  );

  const servers = results.filter(server => server !== null);

  cachedResponse = {
    ip: publicIP,
    timestamp: new Date(),
    servers,
  };
  lastCacheTime = now;

  res.json(cachedResponse);
});

app.listen(port, () => {
  console.log(`Health-check running at http://localhost:${port}/health-check`);
});
