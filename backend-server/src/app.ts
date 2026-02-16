import express from 'express';
import cors from 'cors';
import 'reflect-metadata';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { registerRoutes } from './modules/route.index';

const app = express();

// CORS: allow only configured origins. Default includes localhost for dev.
const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:5173')
	.split(',')
	.map((s) => s.trim())
	.filter(Boolean);

const corsOptions: cors.CorsOptions = {
	origin: (origin, callback) => {
		// allow requests with no origin (e.g. server-to-server or Postman)
		if (!origin) return callback(null, true);
		if (allowedOrigins.includes(origin)) return callback(null, true);
		return callback(new Error('Not allowed by CORS'));
	},
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

registerRoutes(app);

export default app;
