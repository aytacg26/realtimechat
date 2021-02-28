import path, { dirname } from 'path';
import express from 'express';
import http from 'http';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import formatMessage from './utils/messages.js';
import userActions from './utils/users.js';

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
  //   console.log('New ws Connection...');
  //   const data = {
  //     name: 'Aytac',
  //     surname: 'Güley',
  //     age: 41,
  //   };

  //   socket.emit('user', data);

  socket.on('joinRoom', ({ username, room }) => {
    //This will send the message who connected to the server
    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord'));

    //broadcast when a user connects (this will send everybody except the one who newly connected to the server and fired this function);
    socket.broadcast.emit(
      'message',
      formatMessage(botName, 'A user has joined the chat')
    );
  });

  socket.on('chatMessage', (msg) => {
    io.emit('message', formatMessage('USER', msg));
  });

  //When a user disconnects, we will use :
  socket.on('disconnect', () => {
    io.emit('message', formatMessage(botName, 'A User has left the chat'));
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});
