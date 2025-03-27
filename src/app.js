import express from 'express';
import 'express-async-errors';
import { employee } from './features/employee/index.js';

export const app = express();

app.use(express.json());

app.use('/api/v1/employees', employee.router);

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message || 'An error occurred while processing the request' });
});
