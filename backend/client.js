
const clients = [];

module.exports = {
    clients,
    connection: (socket) => {
        const client = {
            send: (event, data) => {
                socket.emit(event, data);
            },
        };
        clients.push(client);
    }
};
