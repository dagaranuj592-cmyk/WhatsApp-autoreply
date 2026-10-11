export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    const { code } = req.body || {};

    if (!code || typeof code !== "string") {
      return res.status(400).json({
        success: false,
        error: "Authorization code missing"
      });
    }

    const appId = process.env.META_APP_ID;
    const appSecret = process.env.META_APP_SECRET;
    const version = process.env.GRAPH_API_VERSION || "v26.0";

    if (!appId || !appSecret) {
      return res.status(500).json({
        success: false,
        error: "Meta environment variables missing"
      });
    }

    const url = new URL(
      `https://graph.facebook.com/${version}/oauth/access_token`
    );

    url.searchParams.set("client_id", appId);
    url.searchParams.set("client_secret", appSecret);
    url.searchParams.set("code", code);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok || !data.access_token) {
      console.error(
        "Token exchange failed:",
        data.error?.type || "Unknown error",
        data.error?.code || ""
      );

      return res.status(400).json({
        success: false,
        error: "Meta token exchange failed"
      });
    }

    // Token is deliberately not returned to the browser.
    // Secure persistent storage must be configured before production use.

    return res.status(200).json({
      success: true,
      message: "Token exchange successful; secure storage is not configured."
    });

  } catch (error) {
    console.error("Exchange error:", error.message);

    return res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
}
