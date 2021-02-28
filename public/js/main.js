const chatForm = document.getElementById('chat-form');

const socket = io();

socket.on('message', async (message) => {
  console.log(message);
});

socket.on('leftMessage', async (message) => {
  console.log(message);
});

socket.on('user', async (data) => {
  console.log(data);
});

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  //Get message text from input element under the form
  const message = e.target.elements.msg.value;

  // const data = {
  //   name: 'Aytac',
  //   surname: 'Guley',
  //   age: 41,
  // };

  //Emit message to server
  //socket.emit('chatMessage', data);

  socket.emit('chatMessage', message);
});
