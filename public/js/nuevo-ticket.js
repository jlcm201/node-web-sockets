// HTML references
const lblNuevoTicket = document.querySelector('#lblNuevoTicket');
const btnNewTicket = document.querySelector('button');

const socket = io();

socket.on('connect', () => {
    // console.log('Connected');

    btnNewTicket.disabled = false;
});

socket.on('disconnect', () => {
    // console.log('Disconnected from server');

    btnNewTicket.disabled = true;
});

socket.on('send-message', payload => {
    console.log(payload);
});

socket.on('last-ticket', ticket => lblNuevoTicket.innerText = ticket);


btnNewTicket.addEventListener('click', () => {
    socket.emit('add-ticket', null, ticket => lblNuevoTicket.innerText = ticket); 
});
