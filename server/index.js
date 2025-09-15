import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import {authRoutes} from './Routes/AuthRoutes.js';
import { shopifyRoutes } from './Routes/shopify/index.js';

const app = express();
dotenv.config();

const PORT = process.env.PORT;

app.use(cors({
  origin: ["https://store-dashboard-tau.vercel.app", "http://localhost:5173"],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/shopify',shopifyRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});