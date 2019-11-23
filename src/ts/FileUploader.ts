import Socket from './Socket';

type UpdateUploadedBytes = (bytes: number) => void;

interface IChunk {
    index: number,
    data: Blob
}

type listener = () => void;

export default class FileUploader {
    private _files: Array<File>;
    private _ownerId: string;
    private _seek: number = 0;
    private _uploadedBytes: Array<number> = [];
    private _generateChunks: Generator<IChunk>;
    private _updateUploadedBytes: UpdateUploadedBytes;
    private _listeners: Array<null | undefined | listener> = [];

    public chunkSize: number = 1;

    constructor(files: Array<File>, id: string) {
        this._files = files;
        this._ownerId = id;

        this._updateUploadedBytes = this.updateUploadedBytes.bind(this);
        this._generateChunks = this.getChunk(files, this.chunkSize * 1024 * 1024);
    }

    public upload(): void {
        Socket.$on('file:status:ready', this.sendChunks.bind(this));
        Socket.$on('file:status:saved', this.onSaved.bind(this));

        Socket.$emit('file:status:prepared');
    }

    public addUploadedBytesListener(file: File, handler: () => void) {
        let index = this._files.indexOf(file);

        if (index !== -1) {
            this._listeners[index] = handler;
        }
    }

    private *getChunk(files: Array<File>, range: number) {
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            for (let j = 0; j < file.size; j+=range) {
                yield {
                    index: i,
                    data: file.slice(j, j + range)
                } as IChunk;
            }
        }
    }

    private updateUploadedBytes(bytes: number): void {
        if (this._uploadedBytes.length - 1 < this._seek) {
            this._uploadedBytes.push(0);
        }
        if (this._uploadedBytes[this._seek] < this._files[this._seek].size) {
            this._uploadedBytes[this._seek] += bytes;
        }

        let listener = this._listeners[this._seek];
        if (listener) {
            listener();
        }
    }


    private sendChunks(data: any) {
        if (data) this._updateUploadedBytes(data.receivedSize as number);

        let chunk = this._generateChunks.next();

        if (chunk.done) Socket.$emit('file:status:done', this._ownerId);
        else if (chunk.value.index === this._seek) Socket.$emit('file:send:chunk', chunk.value.data);
        else {
            this._seek++;
            Socket.$emit('file:status:uploaded');
            Socket.$emit('file:send:chunk', chunk.value.data)
        }
    }

    private onSaved(data: any) {
        console.log(data);
    }

    get uploadedBytes(): Array<number> {
        return this._uploadedBytes;
    }
}