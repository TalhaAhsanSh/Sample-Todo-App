import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
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

// Serve static files from 'public' (formerly 'frontend.ts')
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.use('/api', routes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.send('🚀 Todo App Backend is running');
});

// Serve index.html for non-API routes
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.originalUrl.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 404 handler (only for API routes ideally)
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

export default app;
