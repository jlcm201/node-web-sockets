const path = require('path');
const fs = require('fs');

class Ticket {
    constructor(ticketNumber, desktop) {
        this.ticketNumber = ticketNumber;
        this.desktop = desktop;
    }
};

class TicketControl {
    constructor() {
        this.lastTicket = 0;
        this.today = new Date().getDate();
        this.tickets = [];
        this.last4Tickets = [];

        this.init();
    }

    get toJSON() {
        return {
            lastTicket: this.lastTicket,
            today: this.today,
            tickets: this.tickets,
            last4Tickets: this.last4Tickets
        };
    };

    init() {
        const { lastTicket, today, tickets, last4Tickets } = require('../db/data.json');
        
        if (today === this.today) {
            this.tickets = tickets;
            this.lastTicket = lastTicket;
            this.last4Tickets = last4Tickets;
        } else {
            this.saveDB();
        }
    };

    saveDB() {
        const dbPath = path.join(__dirname, '../db/data.json');
        fs.writeFileSync(dbPath, JSON.stringify(this.toJSON));
    };

    nextTicket() {
        this.lastTicket += 1;
        const ticket = new Ticket(this.lastTicket, null);

        this.tickets.push(ticket);

        this.saveDB();

        return `Ticket: ${ticket.ticketNumber}`;
    };

    takeTicket(desktop) {
        // we does not have tickets
        if ( this.tickets.length === 0) {
            return null;
        }

        const ticket = this.tickets.shift(); // this.tickets[0];
        
        ticket.desktop = desktop;

        this.last4Tickets.unshift(ticket);
        
        if (this.last4Tickets.length > 4) {
            this.last4Tickets.splice(-1, 1);
        }
        
        this.saveDB();

        return ticket;
    };
};

module.exports = { TicketControl };
