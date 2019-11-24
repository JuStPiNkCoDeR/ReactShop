import Socket from './Socket';

export class FileReceiver {
    private static instance: FileReceiver | null;
    private _productId: string;
    private _isDownloaded: boolean = false;
    private _files: Array<Buffer> = [];
    private _filesSize: Array<number> = [];
    private _seek: number = 0;
    private _callback: (result: Array<Buffer>) => void;

    private constructor(id: string, callback: (result: Array<Buffer>) => void) {
        this._productId = id;
        this._callback = callback;
    }

    public static getInstance(id: string, callback: (result: Array<Buffer>) => void): FileReceiver {
        if (!this.instance) this.instance = new FileReceiver(id, callback);
        else {
            this.instance.productId = id;
            this.instance.callback = callback;
        }

        return this.instance;
    }

    public download() {
        let id = this._productId;

        if (this._isDownloaded) new Error('Pictures already downloaded');
        Socket.$emit('file:status:prepareDownload', id);
    }

    private _handlePrepared() {
        Socket.$emit('file:status:ready');
    }

    private _handleChunkSend(data: any) {
        let buffer = this.arrayBufferToBuffer(data);

        if (!this._files[this._seek]) this._files[this._seek] = buffer;
        else {
            try {
                let newBuffer = Buffer.concat([this._files[this._seek], buffer]);
                this._files[this._seek] = newBuffer;
            } catch (e) {
                //reject(e);
            }
        }

        Socket.$emit('file:status:ready');
    }

    private _handleFileNext() {
        this._seek++;
        Socket.$emit('file:status:ready');
    }

    private _handleFileDone() {
        this._isDownloaded = true;
        this._callback(this._files);
        this._files = [];
    }

    private arrayBufferToBuffer(array: ArrayBuffer): Buffer {
        let buffer = new Buffer(array.byteLength);
        let view = new Uint8Array(array);
        for (let i = 0; i < buffer.length; ++i) {
            buffer[i] = view[i];
        }
        return buffer;
    }

    set productId(value: string) {
        this._productId = value;
        this._isDownloaded = false;
    }

    set callback(value: (result: Array<Buffer>) => void) {
        this._callback = value;
    }

    get handlePrepared(): () => void {
        return this._handlePrepared.bind(this);
    }

    get handleChunkSend(): (data: any) => void {
        return this._handleChunkSend.bind(this);
    }

    get handleFileNext(): () => void {
        return this._handleFileNext.bind(this);
    }

    get handleFileDone(): () => void {
        return this._handleFileDone.bind(this);
    }
}

export default FileReceiver;