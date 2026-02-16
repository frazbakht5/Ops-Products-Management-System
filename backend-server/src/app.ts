import express from 'express';
import cors from 'cors';
import 'reflect-metadata';
import { registerRoutes } from './modules/route.index';

const app = express();

app.use(cors());
app.use(express.json());

registerRoutes(app);

export default app;
