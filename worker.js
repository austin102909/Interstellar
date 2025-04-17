export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    const baseUrls = {
      "/e/1/": "https://raw.githubusercontent.com/qrs/x/fixy/",
      "/e/2/": "https://raw.githubusercontent.com/3v1/V5-Assets/main/",
      "/e/3/": "https://raw.githubusercontent.com/3v1/V5-Retro/master/",
    };

    let targetUrl = null;
    for (const [prefix, base] of Object.entries(baseUrls)) {
      if (pathname.startsWith(prefix)) {
        targetUrl = base + pathname.slice(prefix.length);
        break;
      }
    }

    if (!targetUrl) {
      return new Response("Not found", { status: 404 });
    }

    try {
      const asset = await fetch(targetUrl);
      if (!asset.ok) return new Response("Failed to fetch asset", { status: 500 });

      const contentType = asset.headers.get("content-type") || "application/octet-stream";
      const headers = {
        "Content-Type": contentType,
        "Cache-Control": "max-age=2592000", // 30 days
      };

      return new Response(await asset.body, { status: 200, headers });
    } catch (e) {
      return new Response("Error: " + e.message, { status: 500 });
    }
  },
};
