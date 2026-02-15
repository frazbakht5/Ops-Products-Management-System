import { DataSource } from 'typeorm';
import { config } from '../config/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,
  synchronize: true, // dev only
  logging: false,
  entities: [__dirname + '/../modules/**/*.entity.{ts,js}'],
});
