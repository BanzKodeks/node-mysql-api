import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorHandler from '../_middleware/error-handler';
import swaggerRouter from '../_helpers/swagger';

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Allow CORS from any origin
app.use(cors({
    origin: (origin: any, callback: any) => callback(null, true),
    credentials: true
}));

// Swagger docs route
app.use('/api-docs', swaggerRouter);

// API routes
// e.g. app.use('/accounts', require('./accounts/accounts.controller').default);

// Global error handler (must be last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});