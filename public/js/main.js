const chatForm = document.getElementById('chat-form');
const usersList = document.getElementById('users');
const roomName = document.getElementById('room-name');
const leaveRoom = document.getElementById('');
const input = document.getElementById('msg');
let typingTimer;
const typingInterval = 400;
let typing = false;
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

//Add room name to DOM :
const outputRoomName = (room) => {
  roomName.innerText = room;
};

//Add users to DOM :
const outputUsers = (users) => {
  usersList.innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join('')}

  `;
};

//Join Chat room
socket.emit('joinRoom', { username, room });

input.addEventListener('keyup', () => {
  typingTimer = setTimeout(() => {
    typing = false;
    socket.emit('writing', { username, room, typing });
  }, typingInterval);
});

//Writing
input.addEventListener('keypress', () => {
  clearTimeout(typingTimer);
  typing = true;
  socket.emit('writing', { username, room, typing });
});

socket.on('isWriting', ({ isWriting, name }) => {
  const writing = document.querySelector('.isWriting');
  if (isWriting) {
    writing.innerHTML = `${name} is writing...`;
  } else {
    writing.innerHTML = '';
  }
});

//Get room and users:
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

socket.on('message', async (message) => {
  outputMessage(message);
});

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  //Get message text from input element under the form
  const message = e.target.elements.msg.value;
  cleanInput();

  socket.emit('chatMessage', message);
});
