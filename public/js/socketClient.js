const lblOnline = document.querySelector('#lblOnline');
const lblOffline = document.querySelector('#lblOffline');
const txtMessage = document.querySelector('#txtMessage');
const btnEnviar = document.querySelector('#btnEnviar');

const socket = io();

socket.on('connect', () => {
    console.log('Connected');

    lblOnline.style.display = '';
    lblOffline.style.display = 'none';
});

socket.on('send-message', payload => {
    console.log(payload);
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
    lblOnline.style.display = 'none';
    lblOffline.style.display = '';
});

btnEnviar.addEventListener('click', () => {
    const payload = {
        id: '123',
        msg: txtMessage.value,
        date: Date.now().toString()
    };


    
    socket.emit('send-message', payload, id => console.log('from server: ', id)); 
});