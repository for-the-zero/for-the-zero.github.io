import type { Context } from "@netlify/edge-functions";

const ipMap = new Map();

export default async (request: Request, context: Context) => {
    const headers = request.headers;
    const ua = (headers.get("user-agent") || "").toLowerCase();
    const accept = headers.get("accept") || "";
    const secChUa = headers.get("sec-ch-ua");
    const ip = context.ip || "unknown";
    const now = Date.now();
    if (ua.includes("chrome") && !secChUa) {
        return new Response("Forbidden: Missing Sec-CH-UA Header", { status: 403 });
    }
    if (!accept || accept === "*/*") {
        if (!ua.includes("bot") && !ua.includes("spider")) {
            return new Response("Forbidden: Invalid Request Headers", { status: 403 });
        }
    }
    const record = ipMap.get(ip) || { count: 0, reset: now + 10000 };
    if (now > record.reset) {
        record.count = 1;
        record.reset = now + 10000;
    } else {
        record.count++;
    }
    ipMap.set(ip, record);
    if (record.count > 30) {
        return new Response("Too Many Requests", { status: 429 });
    }
    return context.next();
};

export const config = { path: "/*" };