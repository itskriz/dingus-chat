const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const userCount = document.getElementById('user-count');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

console.log({username, room})

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  if (message.username == "DingusChat") {
    const div = document.createElement('div');
    div.classList.add('alert', 'alert-info', 'my-2', 'px-2', 'py-1');
    div.innerHTML = `<strong>${message.time}:</strong> ${message.text}`;
    document.querySelector('.chat-messages').appendChild(div);
  } else {
    const figure = document.createElement('figure');
    figure.classList.add('message', 'my-2', 'message--hide');
    const blockquote = document.createElement('blockquote');
    figure.appendChild(blockquote);
    const p = document.createElement('p');
    p.classList.add('mb-0', 'px-2', 'py-1');
    p.innerText = message.text;
    blockquote.appendChild(p);
    const figcaption = document.createElement('figcaption');
    figcaption.classList.add('blockquote-footer', 'pt-1');
    figcaption.innerText = `${message.username} @ ${message.time}`;
    figure.appendChild(figcaption);
    if (message.username == username) {
      figure.classList.add('message-client');
      blockquote.classList.add('bg-light');
    } else {
      figure.classList.add('message-user', 'text-light');
      blockquote.classList.add('bg-primary');
    }
    document.querySelector('.chat-messages').appendChild(figure);
    setTimeout(function() {
      figure.classList.remove('message--hide');
    }, 0);
  }
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = `${room} Room`;
}

// Add users to DOM
function outputUsers(users) {
 console.log({users})
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
  userCount.innerText = users.length;
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});