# discord-n8n-cloud-proxy
discord interaction endpoint fix for n8n production webhook url.

# Discord → Cloudflare → n8n Cloud Proxy

This is a plug-and-play setup for securely handling Discord interaction webhooks in **n8n Cloud**, which does not support custom nodes or raw body signature verification.

## 🔐 Why This Exists

Discord requires that incoming webhooks are verified using Ed25519 signatures. n8n Cloud can't handle this natively, so this project uses a Cloudflare Worker to handle signature verification, then forwards valid requests to your n8n Cloud webhook.

---

## 📦 What's Included

- `cloudflare-worker.js`: A deployable Cloudflare Worker script
- `n8n-code-node.js`: A reusable Code node for parsing button click info
- `sample-discord-payload.json`: Example Discord payload
- `README.md`: Setup instructions

---

## 🛠️ Setup

1. Paste `cloudflare-worker.js` into a new Worker at [Cloudflare Workers](https://dash.cloudflare.com)
2. Replace:
   - `DISCORD_PUBLIC_KEY` with your Discord App's public key
   - `N8N_WEBHOOK_URL` with your n8n Cloud webhook (e.g. `/webhook/discord-production`)
3. Deploy your Worker
4. Paste the Worker URL into Discord → Developer Portal → Interactions Endpoint URL
5. In your n8n workflow:
   - Set up a `Webhook` node
   - Use the same path as in the Cloudflare URL
   - Add a `Code` node using the script from `n8n-code-node.js`

---

## ✅ Result

You now have:
- Verified Discord interactions
- Button click actions flowing into n8n
- Data parsed cleanly and ready to act on (e.g., send Gmail)

---

## 🤝 Credits

Built in collab with @brutus on n8n + Discord integration strategy.
 
