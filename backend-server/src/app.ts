import express from 'express';
import cors from 'cors';
import 'reflect-metadata';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { registerRoutes } from './modules/route.index';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

registerRoutes(app);

export default app;
