import 'dotenv/config';
import express from 'express';
import connectDB from './db';
import globalRouter from './global-router';
import { logger } from './logger';
import AuthService from "./auth/auth-service";
import EventService from "./events/event-service";

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(logger);
app.use(express.json());
app.use('/api/v1/',globalRouter);

app.get('/', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.json(null);
  }

  const authService = new AuthService();
  const eventService = new EventService();

  const user = await authService.getUserCityFromToken(token);
  if (!user) {
    return res.json(null);
  }

  const events = await eventService.getEventsByCity(user.city);
  return res.json(events);
});

app.listen(PORT, () => {
  console.log(`Server runs at http://localhost:${PORT}`);
});
