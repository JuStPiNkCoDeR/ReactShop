const db = require('../db');
const { ProductModel } = require('../db/models');

function* parsePicturesToUser(pictures) {
    for (let i = 0; i < pictures.length; i++) {
        let chunks = pictures[i];

        for (let j = 0; j < chunks.length; j++) {
            yield {
                completeFile: false,
                data: chunks[j].buffer
            };
        }

        yield {
            completeFile: true
        }
    }
}

module.exports = {
    init(server) {
        const io = require('socket.io')(server);
        io.on('connection', client => {
            let file = [];
            let files = [];
            client.on('file:status:prepared', () => {
                client.emit('file:status:ready');
            });
            client.on('file:send:chunk', data => {
                file.push(data);
                client.emit('file:status:ready', {
                    receivedSize: data.length
                })
            });

            client.on('file:status:uploaded', data => {
                files.push(file);
                file = [];
            });

            client.on('file:status:done', async (data) => {
                files.push(file);
                file = [];

                await db.connect();
                ProductModel.findByIdAndUpdate(data, { pictures: files }, function (err, product) {
                    if (err) client.emit('file:status:error', err);
                    else client.emit('file:status:saved', {
                        files: files
                    });
                });
            });

            let iterator = null;

            client.on('file:status:prepareDownload', async (data) => {
                await db.connect();
                ProductModel.findById(data, function (err, product) {
                    if (err) client.emit('file:status:error', err);
                    else {
                        let files = product.pictures;
                        iterator = parsePicturesToUser(files);

                        client.emit('file:status:prepared');
                    }
                })
            });

            client.on('file:status:ready', () => {
                if (!iterator) return;

                let chunk = iterator.next();

                if (!chunk.done) {
                    if (chunk.value.completeFile) client.emit('file:status:next');
                    else client.emit('file:send:chunk', chunk.value.data);
                } else client.emit('file:status:done');
            });
        })
    }
};