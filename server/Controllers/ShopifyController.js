import axios from "axios";
import dotenv from "dotenv";

dotenv.config();


const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SHOPIFY_SCOPES, SHOPIFY_REDIRECT_URI } = process.env;
 

// Add this debug endpoint to check your configuration
// app.get('/api/debug/oauth-config', (req, res) => {
//     res.json({
//         shopifyApiKey: process.env.SHOPIFY_API_KEY ? 'Set' : 'Not set',
//         redirectUri: process.env.SHOPIFY_REDIRECT_URI,
//         baseUrl: process.env.BASE_URL,
//         scopes: process.env.SHOPIFY_SCOPES,
//         environment: process.env.NODE_ENV || 'development'
//     });
// });

// Enhanced OAuth initiation with better error handling
const shopifyAppInstall =  (req, res) => {
    const { shop } = req.body;
    
    // Validation
    if (!shop) {
        return res.status(400).json({ error: 'Shop domain is required' });
    }
    
    if (!process.env.SHOPIFY_API_KEY) {
        return res.status(500).json({ error: 'Shopify API key not configured' });
    }
    
    if (!process.env.SHOPIFY_REDIRECT_URI) {
        return res.status(500).json({ error: 'Redirect URI not configured' });
    }
    
    // Clean and validate shop domain
    let shopDomain = shop.replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    // Ensure it ends with .myshopify.com if it doesn't already
    if (!shopDomain.includes('.')) {
        shopDomain = `${shopDomain}.myshopify.com`;
    }
    
    // Validate shop domain format
    if (!shopDomain.includes('myshopify.com') && !shopDomain.includes('.shopify.com')) {
        return res.status(400).json({ 
            error: 'Invalid shop domain. Use format: shop-name.myshopify.com' 
        });
    }
    
    try {
        // Generate secure state
        const stateData = JSON.stringify({
            userId: req.userId,
            timestamp: Date.now(),
            shop: shopDomain
        });
        const encodedState = Buffer.from(stateData).toString('base64');
        
        const redirectUri = process.env.SHOPIFY_REDIRECT_URI;
        
        // Build OAuth URL
        const authUrl = `https://${shopDomain}/admin/oauth/authorize?` +
            `client_id=${encodeURIComponent(process.env.SHOPIFY_API_KEY)}&` +
            `scope=${encodeURIComponent(process.env.SHOPIFY_SCOPES)}&` +
            `redirect_uri=${encodeURIComponent(redirectUri)}&` +
            `state=${encodeURIComponent(encodedState)}`;
        
        // Log for debugging (remove in production)
        console.log('Generated OAuth URL:', {
            shopDomain,
            redirectUri,
            clientId: process.env.SHOPIFY_API_KEY,
            scopes: process.env.SHOPIFY_SCOPES
        });
        
        res.redirect(authUrl);
        
    } catch (error) {
        console.error('OAuth URL generation error:', error);
        res.status(500).json({ error: 'Failed to generate OAuth URL' });
    }
};



// Create a simple test endpoint to verify your callback works
const callback = async (req, res) => {
  const { shop, code } = req.query;

  if (!shop || !code) {
    return res.status(400).send('Missing shop or code');
  }

  try {
    const tokenResponse = await axios.post(`https://${shop}/admin/oauth/access_token`, {
      client_id: process.env.SHOPIFY_API_KEY,
      client_secret: process.env.SHOPIFY_API_SECRET,
      code
    });

    const { access_token } = tokenResponse.data;
    console.log(access_token);

    // Save to Prisma
    // await prisma.tenant.upsert({
    //   where: { shopDomain: shop },
    //   update: { accessToken: access_token },
    //   create: { shopDomain: shop, accessToken: access_token }
    // });

    res.redirect(`${process.env.FRONTEND_URL}?shop=${shop}`);
  } catch (error) {
    console.error('Token exchange failed:', error);
    res.status(500).send('OAuth failed');
  }
};


export default {shopifyAppInstall,callback};