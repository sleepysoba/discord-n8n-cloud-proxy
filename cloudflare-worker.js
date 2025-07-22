const DISCORD_PUBLIC_KEY = "PASTE_YOUR_DISCORD_PUBLIC_KEY";
const N8N_WEBHOOK_URL = "https://your-n8n-cloud-instance.n8n.cloud/webhook/discord-production";

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("X-Signature-Ed25519");
  const timestamp = request.headers.get("X-Signature-Timestamp");

  const isValid = await verifySignature(rawBody, signature, timestamp, DISCORD_PUBLIC_KEY);
  if (!isValid) {
    return new Response("invalid request signature", { status: 401 });
  }

  const json = JSON.parse(rawBody);

  if (json.type === 1) {
    return new Response(JSON.stringify({ type: 1 }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  await fetch(N8N_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(json),
  });

  return new Response("ok", { status: 200 });
}

async function verifySignature(body, sig, timestamp, publicKey) {
  const encoder = new TextEncoder();
  const message = encoder.encode(timestamp + body);
  const sigBytes = hexToUint8Array(sig);
  const pubKeyBytes = hexToUint8Array(publicKey);

  const key = await crypto.subtle.importKey(
    "raw",
    pubKeyBytes,
    { name: "NODE-ED25519", namedCurve: "NODE-ED25519" },
    false,
    ["verify"]
  );

  return crypto.subtle.verify("NODE-ED25519", key, sigBytes, message);
}

function hexToUint8Array(hex) {
  return new Uint8Array(hex.match(/.{1,2}/g).map(b => parseInt(b, 16)));
}
