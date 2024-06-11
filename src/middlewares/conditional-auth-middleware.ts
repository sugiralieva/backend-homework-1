// middlewares/conditionalAuthMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import AuthService from '../auth/auth-service';
import EventController from '../events/event-controller';
import EventService from '../events/event-service';

const authService = new AuthService();
const eventService = new EventService();
const eventController = new EventController(eventService, authService);

export const conditionalAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
        const user = await authService.getUserCityFromToken(token);
        if (user) {
            return eventController.getEventsByCity(req, res, next);
        }
    }

    return eventController.getEvents(req, res, next);
};
