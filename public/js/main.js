const chatForm = document.getElementById('chat-form');

//Get Username and Room from URL:
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

const cleanInput = () => {
  const inputElement = document.getElementById('msg');
  inputElement.value = '';
  inputElement.focus();
};

const scrollUp = () => {
  const chatMessages = document.querySelector('.chat-messages');
  chatMessages.scrollTop = chatMessages.scrollHeight;
};

const outputMessage = (message) => {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p><p class="text">${message.text}</p>`;
  document.querySelector('.chat-messages').appendChild(div);
  scrollUp();
};

socket.emit('joinRoom', { username, room });

socket.on('message', async (message) => {
  outputMessage(message);
});

socket.on('user', async (data) => {
  console.log(data);
});

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  //Get message text from input element under the form
  const message = e.target.elements.msg.value;
  cleanInput();

  // const data = {
  //   name: 'Aytac',
  //   surname: 'Guley',
  //   age: 41,
  // };

  //Emit message to server
  //socket.emit('chatMessage', data);

  socket.emit('chatMessage', message);
});
