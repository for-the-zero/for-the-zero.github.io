// netlify/edge-functions/rate-limit.js

const ipMap = new Map();

export default async (request, context) => {
    const headers = request.headers;
    const ua = (headers.get("user-agent") || "").trim();
    const ip = context.ip || "unknown";
    const now = Date.now();
    if (!ua || ua.length < 10) {
        return new Response("Forbidden: Invalid User-Agent", { status: 403 });
    }
    const record = ipMap.get(ip) || { count: 0, reset: now + 10000 };
    if (now > record.reset) {
        record.count = 1;
        record.reset = now + 10000;
    } else {
        record.count++;
    }
    ipMap.set(ip, record);
    if (record.count > 80) {
        return new Response("Too Many Requests", {
            status: 429,
            headers: { "Retry-After": "10" }
        });
    }
    return context.next();
};

export const config = { path: "/*" };