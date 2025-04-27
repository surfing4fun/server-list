Here’s the README **for your Health-Check Server project**, same nice style, all complete:

---

![Surfing4Fun](https://cdn.discordapp.com/banners/749142414475919420/c644a0faf33aa355463524c3b64512f2.webp?size=1024)

# Server Health-Check API

This project provides a **Node.js Express API** that queries multiple game servers using **Source Server Query** and returns a **live server list** (status, players, map, etc.) in JSON format.  
It also uses **automatic caching** to avoid unnecessary queries.

---

## Features

- **Checks multiple ports** (27015–27025)
- **Queries server info and player list**
- **Returns human-readable values** (server type, VAC status, OS, visibility)
- **Caches responses for 30 seconds** to reduce load
- **Detects public IP automatically**

---

## Installation

```bash
# Clone the project
git clone https://github.com/surfing4fun/server-list.git

# Enter the project folder
cd server-list

# Install dependencies
npm install
```

---

## Usage

```bash
# Start the server
node index.js
```

The server will start at:  
> `http://localhost:3000/health-check`

You can then make a simple HTTP GET request to retrieve the server status.

---

## Example Response

```json
{
  "ip": "123.45.67.89",
  "timestamp": "2025-04-26T02:00:00.000Z",
  "servers": [
    {
      "name": "Surf Server",
      "address": "123.45.67.89:27015",
      "map": "surf_utopia",
      "players": "10/64",
      "bots": 2,
      "server_type": "dedicated",
      "environment": "Linux",
      "visibility": "public",
      "vac": "enabled",
      "version": "1.38.8.0",
      "player_list": [
        {
          "name": "PlayerOne",
          "score": 20,
          "duration": 900.5
        },
        {
          "name": "PlayerTwo",
          "score": 15,
          "duration": 800.2
        }
        // ...
      ]
    }
    // Other servers...
  ]
}
```

---

## Ports Scanned

- 27015
- 27016
- 27017
- ...
- 27025

**(11 ports total)**

---

## Requirements

- Node.js v18+
- Steam Source Server responding to queries
- (Optional) `source-server-query` module (already installed)

---

## Notes

- **Caching:** Results are cached for 30 seconds.  
- **If a server is offline or unresponsive**, it is automatically skipped.
- **IP Detection:** The system uses `https://api.ipify.org` to find your public IP address.

---

## License

MIT License.  
Feel free to adapt it for your game network monitoring!

---

### ⚡ Tip:
You can host this API and point your game server browser, dashboards, or monitoring tools to `/health-check` for a **live server list**!
