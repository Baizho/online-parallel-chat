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
      origin: ["http://online-parallel-chat.onrender.com/", "http://localhost:3000"]
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

const users = {};
const typingUsers = {};

io.on("connect", (socket) => {
  // console.log("a user connected");
  const fetchData = async () => {
    const res = await messageService.getMessages(); 
    // console.log("Fetching", res);
    socket.emit("messages", res);
    socket.emit("onlineUsers", users);
    socket.emit("typingUsers", typingUsers);
  }
  setInterval(() => {
    fetchData()
  }, 1000);
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
      if(res !== null) {
        // console.log(res.user.username);
        users[res.user.username] = "online";
        // console.log(users);
      }
      socket.emit("checkLogin", res?.user.username);
    }
    sendData();
  })

  socket.on("removeTyping", (user) => {
    delete typingUsers[user];
  })
  socket.on("addTyping", (user) => {
    typingUsers[user] = "typing";
  })

  socket.on("disconnectingUser", (user) =>  {
    // console.log("disconnect", user);
    delete users[user];
  });
  // it works? no
});

io.on("disconnect", (socket) => {
  socket.on("disconnectingUser", (user) =>  {
    console.log(user);
    delete users[user];
  });
})

server.listen(4000, () => {
  console.log("server running at http://localhost:4000");
});
