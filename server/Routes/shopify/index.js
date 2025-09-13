import { Router } from "express";
import ShopifyController  from "../../Controllers/ShopifyController.js";

const shopifyRoutes = Router();

// shopifyRoutes.get("/install", shopifyAppInstall);
shopifyRoutes.get("/callback", ShopifyController.callback);
shopifyRoutes.post("/connect-shopify", ShopifyController.shopifyAppInstall);


export {shopifyRoutes};