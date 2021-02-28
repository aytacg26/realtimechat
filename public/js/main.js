const socket = io();

socket.on('message', async (message) => {
  console.log(message);
});
