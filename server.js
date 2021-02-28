import path, { dirname } from 'path';
import express from 'express';
import http from 'http';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import formatMessage from './utils/messages.js';
import {
  userJoin,
  userLeave,
  getRoomUsers,
  getCurrentUser,
} from './utils/users.js';

//to use module type instead of commonjs, in package.json, we have to add type:"module"

const app = express();
const server = http.createServer(app);
const io = new Server(server);

//we cannot directly use __dirname in module type, we must follow this way:
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));
const botName = 'ChatCord';

//Run when client connects
io.on('connection', (socket) => {
  socket.on('joinRoom', ({ username, room }) => {
    //This will add the user to the users array in users.js
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    //This will send the message who connected to the server
    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord'));

    //broadcast when a user connects (this will send everybody except the one who newly connected to the server and fired this function);
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    //Users in room info :
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  socket.on('writing', ({ username, room, typing }) => {
    socket.broadcast.to(room).emit('isWriting', {
      isWriting: typing,
      name: username,
    });
  });

  //When a user disconnects, we will use :
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});
