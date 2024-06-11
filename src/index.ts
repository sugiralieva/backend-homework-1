import 'dotenv/config';
import express from 'express';
import connectDB from './db';
import globalRouter from './global-router';
import { logger } from './logger';
import AuthService from "./auth/auth-service";
import EventService from "./events/event-service";
import eventRouter from "./events/event-router";

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(logger);
app.use(express.json());
app.use('/api/v1/',globalRouter);
app.use('/', eventRouter);

app.listen(PORT, () => {
  console.log(`Server runs at http://localhost:${PORT}`);
});
