import React from 'react';
import ILang from "../lang/ILang";
import Lang from "../lang";
import {onFilesChange} from "./CreateForm";
import Validation from "../ts/Validation";

export interface IDragAndDropFile {
    language: string,
    mimeType: string,
    handleFileChange: onFilesChange
}

export class DragAndDropFile extends React.Component<IDragAndDropFile> {
    private _langData: ILang;
    private _ref: React.RefObject<HTMLDivElement> = React.createRef();

    constructor(props: IDragAndDropFile) {
        super(props);
        this._langData = Lang(props.language);
    }

    private preventDefault(event: React.DragEvent) {
        event.preventDefault();
        event.stopPropagation();
    }

    private handleDragEnter(event: React.DragEvent<HTMLLabelElement>) {
        this.preventDefault(event);
        event.currentTarget.classList.add('dragEnter');
    }

    private handleDragLeave(event: React.DragEvent<HTMLLabelElement>) {
        this.preventDefault(event);
        event.currentTarget.classList.remove('dragEnter');
    }

    private returnFiles(fileList: FileList) {
        let files: Array<File> = [];
        let images: Array<HTMLSpanElement> = [];

        for (let i = 0; i < fileList.length; i++) {
            let file = fileList.item(i);
            if (file && Validation.checkMIMEType('image/*', file)) files.push(file);
        }

        if (this._ref && this._ref.current) {
            let div = this._ref.current;
            div.innerHTML = "";
            files.forEach((file) => {
                let url = URL.createObjectURL(file);
                let image = new Image();
                let span = document.createElement('span') as HTMLSpanElement;
                image.src = url;
                span.insertAdjacentElement('beforeend', image);
                div.insertAdjacentElement('beforeend', span);
                images.push(span);
            })
        }

        // @ts-ignore
        this.props.handleFileChange(files, images);
    }

    private handleFileDrop(event: React.DragEvent<HTMLLabelElement>) {
        this.preventDefault(event);
        event.currentTarget.classList.remove('dragEnter');
        this.returnFiles(event.dataTransfer.files);
    }

    private handleChange(event: React.FormEvent<HTMLInputElement>) {
        let fileList = event.currentTarget.files;

        if (fileList) this.returnFiles(fileList);
    }

    render() {
        return(
            <label
                htmlFor="pictures-field"
                className="block fileUpload"
                onDragEnter={(e: React.DragEvent<HTMLLabelElement>) => this.handleDragEnter(e)}
                onDragOver={(e: React.DragEvent<HTMLLabelElement>) => this.handleDragEnter(e)}
                onDrop={(e: React.DragEvent<HTMLLabelElement>) => this.handleFileDrop(e)}
                onDragLeave={(e: React.DragEvent<HTMLLabelElement>) => this.handleDragLeave(e)}>
                {this._langData.form.product.pictures}
                <div ref={this._ref}>
                    {this._langData.form.product.putPictures}
                </div>
                <input id="pictures-field" type="file" multiple onChange={(e: React.FormEvent<HTMLInputElement>) => this.handleChange(e)}/>
            </label>
        )
    }
}