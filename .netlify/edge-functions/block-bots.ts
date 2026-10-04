// 白名单：AI 助手（GPT / Gemini / Claude）
const ALLOWED_AI = [
    "GPTBot",               // OpenAI 模型训练
    "ChatGPT-User",         // ChatGPT 用户请求浏览
    "OAI-SearchBot",        // ChatGPT 搜索
    "ChatGPT",              // ChatGPT 客户端
    "Google-Extended",      // Gemini 训练
    "Googlebot",            // Google 搜索 + Gemini grounding
    "Google-InspectionTool",// Search Console 检测
    "ClaudeBot",            // Claude 训练
    "Claude-Web",           // Claude 网页浏览
    "Claude-SearchBot",     // Claude 搜索
    "anthropic-ai",
];
// 白名单：搜索引擎
const ALLOWED_SEARCH = [
    "Bingbot",
    "DuckDuckBot",
    "DuckDuckGo",
    "Slurp",        // Yahoo
    "Baiduspider",  // 百度
    "Sogou",        // 搜狗
    "YisouSpider",  // 神马
    "360Spider",    // 360
    // "YandexBot", // 如需 Yandex 放行则取消注释
];
// 白名单：社交分享预览（被拦会导致分享链接无卡片）
// 不需要可清空数组：[]
const ALLOWED_SOCIAL = [
    "facebookexternalhit",  // Facebook / WhatsApp / Instagram
    "Twitterbot",           // X/Twitter
    "TelegramBot",
    "Slackbot",
    "Discordbot",
    "LinkedInBot",
    "Pinterestbot",
    "SkypeUriPreview",
];
// 黑名单：会伪装成完整浏览器格式的爬虫（优先级最高，防绕过）
const DENY_UA = [
    "amazonbot",           // Amazonbot 伪装成完整 Safari 格式
    "applebot-extended",   // Applebot-Extended 同样伪装成 Safari
    "meta-externalagent",
    "facebookbot",
    "perplexitybot",
    "bytespider",
    "ccbot",
    "headlesschrome",      // 无头浏览器抓取；需 PageSpeed/Lighthouse 测试则删除此行
];
// 浏览器引擎特征（命中任一 + Mozilla 开头 = 视为浏览器）
const BROWSER_ENGINES = [
    "chrome/", "crios/",           // Chrome / Chrome iOS（微信、QQ 等 webview 也带）
    "firefox/", "fxios/",          // Firefox / Firefox iOS
    "safari/", "applewebkit/",     // Safari（Chrome 也带）
    "gecko/", "khtml",
    "edg/", "edge/",               // Edge
    "opr/", "opera",               // Opera
    "samsungbrowser/",
    "ucbrowser", "qqbrowser", "miuibrowser", "huaweibrowser"
];

function blocked() {
    return new Response("403 Forbidden: User-Agent not allowed.\n", {
        status: 403,
        headers: { "content-type": "text/plain; charset=utf-8" },
    });
}
export default async (request: Request, context: any) => {
    const ua = (request.headers.get("user-agent") || "").trim().toLowerCase();
    if (!ua) return blocked();
    if (DENY_UA.some((s) => ua.includes(s))) return blocked();
    if (
        ALLOWED_AI.some((s) => ua.includes(s)) ||
        ALLOWED_SEARCH.some((s) => ua.includes(s)) ||
        ALLOWED_SOCIAL.some((s) => ua.includes(s))
    ) {
        return context.next();
    }
    if (ua.startsWith("mozilla/") && BROWSER_ENGINES.some((s) => ua.includes(s))) {
        return context.next();
    }
    return blocked();
};
export const config = { path: "/*" };
