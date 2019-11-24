import FileReceiver from "./FileReceiver";

const io = require('socket.io-client');
const socket = io('http://localhost:3001');

const fr = FileReceiver.getInstance('', (r) => {});

export default {
    init() {
        socket.on('file:status:prepared', fr.handlePrepared);
        socket.on('file:send:chunk', fr.handleChunkSend);
        socket.on('file:status:next', fr.handleFileNext);
        socket.on('file:status:done', fr.handleFileDone);
    },
    $on(event, handler) {
        socket.on(event, handler);
    },
    $emit(event, data) {
        socket.emit(event, data);
    }
}