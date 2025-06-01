import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { errorHandler } from './middlewares/error_handler.middleware';
import { responseInterceptor } from './middlewares/response_intercepter.middleware';
import { authenticate } from './middlewares/authenticate.middleware';
import routes from './routes/routes';

const app: Application = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(responseInterceptor);
app.use(authenticate);

app.use('/', routes);

// Health check or root route
app.get('/', (req: Request, res: Response) => {
  res.send('🚀 Todo App Backend is running');
});

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler (optional, for later use)

app.use(errorHandler);

export default app;
