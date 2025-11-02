// src/server.js

import express from 'express';
import 'dotenv/config';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import cors from 'cors';
import { ConnectMongoDB } from './db/connectMongoDB.js';
import notesRoutes from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cookieParser from "cookie-parser";
import helmet from 'helmet';
import userRoutes from './routes/userRoutes.js';
import { errors } from 'celebrate';
import { sanitizeRequest } from './middleware/sanitizeRequest.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(logger);
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(sanitizeRequest);
app.use(cookieParser());

app.use(authRoutes);

app.use(notesRoutes);

app.use(userRoutes);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

await ConnectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
