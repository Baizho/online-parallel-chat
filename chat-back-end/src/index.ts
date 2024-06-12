import 'dotenv/config';
import express from 'express';
import connectDB from './db';
import globalRouter from './global-router';
import { logger } from './logger';

import { Server } from 'socket.io';
import {createServer} from "node:http";

import MessageController from './events/message-controller';
import MessageService from './events/message-service';
import User from './auth/models/User';
import AuthService from './auth/auth-service';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors : {
      origin: "*"
  }
});
const PORT = process.env.PORT;

const messageService = new MessageService();
const authService = new AuthService();

let id = 15;

connectDB();

app.use(logger);
app.use(express.json());
app.use(globalRouter);

io.on("connect", (socket) => {
  // console.log("a user connected");
  const fetchData = async () => {
    const res = await messageService.getMessages(); 
    // console.log("Fetching", res);
    socket.emit("messages", res);
  }
  setInterval(() => {
    fetchData()
  }, 2000);
  socket.on("sendMessage", (message) => {
    const sendData = async () => {
      const res = await messageService.createMessage({
        username:message.username,
        content:message.message,
      });
      // console.log(res);
    }
    sendData();
  })

  socket.on("sendRegister", (user) => {
    const sendData = async () => {
      const res = await authService.registerUser({
        username:user.username,
        password:user.password,
      });
      // console.log(res);
    }
    sendData();
  })

  socket.on("sendLogin", (user) => {
    const sendData = async () => {
      const res = await authService.loginUser(user.username, user.password);
      // console.log(res);
      socket.emit("checkLogin", res?.user.username);
    }
    sendData();
  })
  
  // it works? no
});

server.listen(4000, () => {
  console.log("server running at http://localhost:4000");
});
