import Socket from './Socket';

export class FileReceiver {
    private _productId: string;
    private _isDownloaded: boolean = false;
    private _files: Array<Buffer> = [];
    private _filesSize: Array<number> = [];
    private _seek: number = 0;

    constructor(id: string) {
        this._productId = id;
    }

    public download() {
        let id = this._productId;
        return new Promise<Array<Buffer>>((resolve, reject) => {
            if (this._isDownloaded) reject(new Error('Pictures already downloaded'));
            Socket.$emit('file:status:prepareDownload', id);

            Socket.$on('file:status:prepared', () => {
                Socket.$emit('file:status:ready');
                Socket.$on('file:send:chunk', (data: any) => {
                    let buffer = this.arrayBufferToBuffer(data);

                    if (!this._files[this._seek]) this._files[this._seek] = buffer;
                    else {
                        try {
                            let newBuffer = Buffer.concat([this._files[this._seek], buffer]);
                            this._files[this._seek] = newBuffer;
                        } catch (e) {
                            reject(e);
                        }
                    }

                    Socket.$emit('file:status:ready');
                });
                Socket.$on('file:status:next', () => {
                    this._seek++;
                    Socket.$emit('file:status:ready');
                });
                Socket.$on('file:status:error', (data: any) => {
                    reject(data);
                });
                Socket.$on('file:status:done', () => {
                    this._isDownloaded = true;
                    resolve(this._files);
                })
            });
        });
    }

    private arrayBufferToBuffer(array: ArrayBuffer): Buffer {
        let buffer = new Buffer(array.byteLength);
        let view = new Uint8Array(array);
        for (let i = 0; i < buffer.length; ++i) {
            buffer[i] = view[i];
        }
        return buffer;
    }
}

export default FileReceiver;