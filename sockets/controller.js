const { TicketControl } = require('../models/ticketControl');

const ticketControl = new TicketControl();

const socketController = socket => {
    socket.emit('last-ticket', `Ticket: ${ticketControl.lastTicket}`);
    socket.broadcast.emit('current-state', ticketControl.last4Tickets);

    const remainingTickets = ticketControl.tickets.length > 0 ?
        ticketControl.tickets.length :
        '--';
    socket.broadcast.emit('remaining-tickets', remainingTickets);
    socket.emit('remaining-tickets', remainingTickets);

    socket.on('disconnect', id => {
        console.log('Client disconnected: ', socket.id);
    });

    socket.on('add-ticket', (payload, callback) => {
        const nextTicket = ticketControl.nextTicket();
        callback(nextTicket);

        // TODO: notify that there is a pending ticket
        const remainingTickets = ticketControl.tickets.length > 0 ?
            ticketControl.tickets.length :
            '--';
        socket.broadcast.emit('remaining-tickets', remainingTickets);
    });

    socket.on('take-ticket', async ({ desktop }, callback) => {
        if (!desktop) return callback({
            ok: false,
            msg: 'desktop is required.'
        });

        const ticket = await ticketControl.takeTicket(desktop);

        socket.broadcast.emit('current-state', ticketControl.last4Tickets);

        if(!ticket) return callback({
            ok: false,
            msg: 'there are no pending tickets'
        });
        else callback({
            ok: true,
            ticket
        });

        const remainingTickets = ticketControl.tickets.length > 0 ?
            ticketControl.tickets.length :
            '--';
        socket.broadcast.emit('remaining-tickets', remainingTickets);
        socket.emit('remaining-tickets', remainingTickets);
    });

};


module.exports = { socketController };
