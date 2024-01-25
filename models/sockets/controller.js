
const socketController = socket => {
    console.log('Client connected: ', socket.id);

    socket.on('disconnect', id => {
        console.log('Client disconnected: ', socket.id);
    });

    socket.on('send-message', (payload, callback) => {
        const id = 123;
        callback({id, date: new Date().getTime() });
        socket.broadcast.emit('send-message', payload);
    });
};


module.exports = { socketController };
