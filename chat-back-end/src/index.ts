import 'dotenv/config';
import express from 'express';
import connectDB from './db';
import globalRouter from './global-router';
import { logger } from './logger';

import { Server } from 'socket.io';
import {createServer} from "node:http";

const app = express();
const server = createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

// connectDB();

app.use(logger);
app.use(express.json());
app.use('/api/v1/',globalRouter);

io.on("connection", (socket) => {
  console.log("a user connected");

});

app.listen(PORT, () => {
  console.log(`Server runs at http://localhost:${PORT}`);
});
