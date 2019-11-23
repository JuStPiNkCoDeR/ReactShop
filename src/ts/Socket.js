const io = require('socket.io-client');
const socket = io('http://localhost:3001');

export default {
    $on(event, handler) {
        socket.on(event, handler);
    },
    $emit(event, data) {
        socket.emit(event, data);
    }
}