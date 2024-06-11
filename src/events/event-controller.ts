import {NextFunction, Request, Response} from 'express';
import { CreateEventDto } from './dtos/CreateEvent.dot';
import EventService from './event-service';
import AuthService from './../auth/auth-service'

class EventController {
    private eventService : EventService;
    private authService: AuthService;


    constructor(eventService : EventService, authService: AuthService){
        this.eventService = eventService;
        this.authService = authService;
    }


    createEvent = async (req: Request, res: Response,  next: NextFunction): Promise<void> => {
        try {
          const createEventDto: CreateEventDto = req.body;
          const event = await this.eventService.createEvent(createEventDto);
          res.status(201).json(event);
        } catch (error: any) {
          res.status(500).send({ error: error.message });
        }
      }



    getEvents = async (req: Request, res: Response,  next: NextFunction): Promise<void> => {
        try {
          const events = await this.eventService.getEvents();
          res.status(200).json(events);
        } catch (error: any) {
          res.status(500).send({ error: error.message });
        }
      }

    


    getEventById = async (req: Request, res: Response,  next: NextFunction): Promise<void> => {
        try {
          const { id } = req.params;
          const event = await this.eventService.getEventById(id);
          if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
          }
          res.status(200).json(event);
        } catch (error: any) {
          res.status(500).send({ error: error.message });
        }
      }



    getEventsByCity = async (req: Request, res: Response,  next: NextFunction): Promise<void> => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                res.status(401).json({ message: 'No token provided' });
                return;
            }

            const user = await this.authService.getUserCityFromToken(token);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            const city = user.city;
            const events = await this.eventService.getEventsByCity(city);
            res.status(200).json(events);
        } catch (err) {
            res.status(500).json({ message: 'Error retrieving events by city' });
        }
    }
}

export default EventController;