export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { code } = req.body || {};

    if (!code || typeof code !== "string") {
      return res.status(400).json({ error: "Missing authorization code" });
    }

    const appId = process.env.META_APP_ID;
    const appSecret = process.env.META_APP_SECRET;
    const version = process.env.GRAPH_API_VERSION || "v26.0";

    if (!appId || !appSecret) {
      return res.status(500).json({ error: "Server configuration missing" });
    }

    const url = new URL(
      `https://graph.facebook.com/${version}/oauth/access_token`
    );

    url.searchParams.set("client_id", appId);
    url.searchParams.set("client_secret", appSecret);
    url.searchParams.set("code", code);

    const metaResponse = await fetch(url.toString());
    const data = await metaResponse.json();

    if (!metaResponse.ok || !data.access_token) {
      console.error("Meta token exchange failed:", data.error?.type || "Unknown error");
      return res.status(400).json({ error: "Meta token exchange failed" });
    }

    // Do not return or log the token to the browser.
    // Secure token storage and WABA/phone ID setup must be added before production use.
    return res.status(200).json({
      success: true,
      message: "Authorization code exchanged. Secure token storage is not configured yet."
    });
  } catch (error) {
    console.error("Token exchange error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}
