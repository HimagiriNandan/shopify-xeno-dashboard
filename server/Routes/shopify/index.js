import { Router } from "express";

const shopifyRoutes = Router();

shopifyRoutes.get("/install", shopifyAppInstall);
shopifyRoutes.get("/callback", shopifyCallback);