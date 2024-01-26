// Referencias HTML
const lblDesktop = document.querySelector('h1');
const btnNextTicket = document.querySelector('button');
const lblTicketNumber = document.querySelector('small');
const lblAlert = document.querySelector('div.alert');
const lblPendientes = document.querySelector('#lblPendientes');

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('escritorio')) {
    window.location = 'index.html';
    throw new Error('Desktop is required');
}

const desktop = searchParams.get('escritorio');
lblDesktop.innerText = desktop;
lblAlert.style.display = 'none';

const socket = io();

socket.on('connect', () => {
    // console.log('Connected');

    btnNextTicket.disabled = false;
});

socket.on('disconnect', () => {
    // console.log('Disconnected from server');

    btnNextTicket.disabled = true;
});

socket.on('send-message', payload => {
    console.log(payload);
});

// socket.on('last-ticket', ticket => lblNuevoTicket.innerText = ticket);

socket.on('remaining-tickets', remainingTickets => {
    if (remainingTickets > 0) {
        lblPendientes.innerText = remainingTickets;
        lblPendientes.style.display = '';
        lblAlert.style.display = 'none';
    }
    else {
        lblPendientes.style.display = 'none';
        lblAlert.style.display = '';
    }
});

btnNextTicket.addEventListener('click', () => {
    socket.emit('take-ticket', { desktop }, ({ ok, msg, ticket }) => {
        console.log(ticket);
        if (!ok) {
            lblTicketNumber.innerText = 'nadie';
            lblAlert.innerText = msg;
            lblAlert.style.display = '';
        } else lblTicketNumber.innerText = ticket.ticketNumber;
    }); 
});

