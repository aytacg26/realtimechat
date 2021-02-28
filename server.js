import path, { dirname } from 'path';
import express from 'express';
import http from 'http';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';

//to use module type instead of commonjs, in package.json, we have to add type:"module"

const app = express();
const server = http.createServer(app);
const io = new Server(server);

//we cannot directly use __dirname in module type, we must follow this way:
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

//Run when client connects
io.on('connection', (socket) => {
  console.log('New ws Connection...');
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});
