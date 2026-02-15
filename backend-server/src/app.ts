import express from 'express';
import 'reflect-metadata';
import { registerRoutes } from './modules/route.index';

const app = express();

app.use(express.json());

registerRoutes(app);

export default app;
