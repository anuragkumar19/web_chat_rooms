// Getting Elements
const msgForm = document.getElementById('msgForm');
const messagesCont = document.getElementById('messages-cont');

// Init socket.io
const socket = io();

// Handle Join room
socket.emit('joinRoom', {
    name,
    room: roomId,
});

// Remove Loader
document.querySelector('.loader').remove();

socket.on('message', appendMessage);

socket.on('roomUsers', appendAllUsers);

// Handle Form Submmision
msgForm.addEventListener('submit', (e) => {
    // Prevent from submmiting
    e.preventDefault();

    let msg = e.target.elements.msgInp.value;

    msg = msg.trim();
    if (!msg) {
        return;
    }

    socket.emit('chatMessage', msg);
    // Clear the input
    e.target.elements.msgInp.value = '';
});

function appendMessage(msg, isRight) {
    $('#messages-cont').append(
        ejs.render(
            `<div class="msg <%= msg.user.id == id ? 'right' : 'left' %>"><div class="data-meta"><span class="meta-name"><%= msg.user.user %></span><span class="meta-time"><%= new Date(msg.time).toLocaleTimeString() %></span></div><div><%= msg.text %></div><div>`,
            {
                msg,
                id: socket.id,
            }
        )
    );
    // Scroll Down on new message
    messagesCont.scrollTop = messagesCont.scrollHeight;
}

function appendAllUsers({ users }) {
    $('#userList').html('');
    users.forEach((user) => {
        $('#userList').append(
            ejs.render(
                `<li class="user-card"><img src="/img/user.png" alt="" width="20"><span><%= user.user %></span></li>`,
                {
                    user,
                }
            )
        );
    });
}
