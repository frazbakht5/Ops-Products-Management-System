import express from 'express';
import 'reflect-metadata';
import productRoutes from './modules/products/product.routes';

const app = express();

app.use(express.json());

app.use('/products', productRoutes);

export default app;
