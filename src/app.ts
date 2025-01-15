import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
const app: Application = express();

// Parsers
app.use(express.json());
app.use(cors());

// app.use('/api/v1/students', StudentRoutes);
app.use('/api/v1', router);
const getAController = (req: Request, res: Response) => {
  const a = 'Hello World!';
  res.send(a);
};
app.get('/', getAController);
app.use(globalErrorHandler);
export default app;
