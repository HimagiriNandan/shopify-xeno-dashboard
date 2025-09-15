import axios from "axios";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const shopifyAppInstall = async (req, res) => {
  const { shop } = req.query;

  if (!shop) {
    return res.status(400).json({ error: "Shop domain is required" });
  }

  try {
    // Add userId from your JWT middleware
    const stateData = JSON.stringify({
      userId: req.userId, // must be set earlier by auth middleware
      timestamp: Date.now(),
      shop,
    });
    const encodedState = Buffer.from(stateData).toString("base64");

    const redirectUri = process.env.SHOPIFY_REDIRECT_URI;

    const authUrl =
      `https://${shop}/admin/oauth/authorize?` +
      `client_id=${encodeURIComponent(process.env.SHOPIFY_API_KEY)}&` +
      `scope=${encodeURIComponent(process.env.SHOPIFY_SCOPES)}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `state=${encodeURIComponent(encodedState)}`;

    res.redirect(authUrl);
  } catch (error) {
    console.error("OAuth URL generation error:", error);
    res.status(500).json({ error: "Failed to generate OAuth URL" });
  }
};



// Create a simple test endpoint to verify your callback works
const callback = async (req, res) => {
  const { shop, code, host, hmac, state, ...rest } = req.query;

  if (!shop || !code) {
    return res.status(400).send("Missing shop or code");
  }

  // --- HMAC validation ---
  const queryParams = { shop, code, host, state, ...rest };
  const message = Object.keys(queryParams)
    .sort()
    .map((key) => `${key}=${queryParams[key]}`)
    .join("&");

  const generatedHmac = crypto
    .createHmac("sha256", process.env.SHOPIFY_API_SECRET)
    .update(message)
    .digest("hex");

  if (generatedHmac !== hmac) {
    return res.status(400).send("HMAC validation failed");
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      `https://${shop}/admin/oauth/access_token`,
      {
        client_id: process.env.SHOPIFY_API_KEY,
        client_secret: process.env.SHOPIFY_API_SECRET,
        code,
      }
    );

    const { access_token } = tokenResponse.data;

    // Decode state (recover userId from install step)
    const stateData = JSON.parse(Buffer.from(state, "base64").toString());
    const userId = stateData.userId;

    // Create or update tenant
    const tenant = await prisma.tenant.upsert({
      where: { shop_domain: shop },
      update: {
        access_token,
        host,
        users: { connect: { id: userId } },
      },
      create: {
        shop_domain: shop,
        access_token,
        host,
        users: { connect: { id: userId } },
      },
    });

    // Redirect back to frontend with shop + host
    res.redirect(`${process.env.FRONTEND_URL}?shop=${shop}&host=${host}`);
  } catch (error) {
    console.error("Token exchange failed:", error.response?.data || error);
    res.status(500).send("OAuth failed");
  }
};


export default {shopifyAppInstall,callback};