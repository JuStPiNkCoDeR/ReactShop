import React from 'react';
import {ProductPropertiesField} from './ProductPropertiesField';
import ILang from "../lang/ILang";
import Lang from '../lang';
import {CurrencyEntities, ECurrency, EProductKeys, IProduct, IProperty} from '../types';
import {ERequestTypes, GraphQL} from '../ts/GraphQL';
import FileUploader from '../ts/FileUploader';
import { DragAndDropFile } from './DragAndDropFile';
import HTMLTricks from '../ts/HTMLTricks';

export interface ICreateFormProps {
    language: string
}

interface IStates {
    product: IProduct,
    imgs: Array<HTMLSpanElement>
}

export type onPropertiesChange = (properties: Array<IProperty>) => void;

export type onFilesChange = (files: Array<File>, imgs: HTMLSpanElement) => void;

export class CreateForm extends React.Component<ICreateFormProps, IStates> {
    private _handleSubmit: any;
    private _handleFileChange: any;
    private _langData: ILang;
    private _isResourcesReady: boolean = true;

    constructor(props: ICreateFormProps) {
        super(props);
        this._langData = Lang(props.language);
        this._handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            product: {
                name: '',
                price: -1,
                description: '',
                currency: ECurrency.Ruble,
                pictures: [],
                properties: []
            },
            imgs: []
        }
    }

    private handleSubmit(event: any) {
        event.preventDefault();

        if (this._isResourcesReady) {
            let mutation = `mutation CreateProduct($name: String!, $price: Int!, $currency: String!, $description: String!
            $properties: [[String]]!) { 
            createProduct(name: $name, price: $price, currency: $currency, description: $description, properties: $properties)
            { id } }`;
            const currentState = this.state.product;
            let properties: Array<Array<String>> = [];

            currentState[EProductKeys.Properties].forEach((property) => {
               properties.push([property.name, property.value.toString()]);
            });

            let params = {
                name: currentState[EProductKeys.Name],
                price: currentState[EProductKeys.Price],
                currency: currentState[EProductKeys.Currency],
                description: currentState[EProductKeys.Description],
                properties: properties
            };

            GraphQL.fetch({
                query: mutation,
                variables: params
            }, ERequestTypes.CreateProduct)
                .then(result => {
                    const files = this.state.product.pictures;
                    const images = this.state.imgs;
                    const fp = new FileUploader(files, result[0].id);

                    for (let i = 0; i < files.length; i++) {
                        let file = files[i];
                        let image = images[i];
                        image.classList.add('uploading');
                        let progress = document.createElement('progress') as HTMLProgressElement;
                        progress.max = 100;

                        image.insertAdjacentElement('afterbegin', progress);
                        fp.addUploadedBytesListener(file, () => {
                            progress.value = fp.uploadedBytes[i] / (file.size / 100);
                        });
                    }

                    fp.upload();
                });
        }
    }

    private handleStringValueChange(event: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLTextAreaElement>, key: EProductKeys.Name | EProductKeys.Description) {
        let currentState = Object.create(this.state) as IStates;
        currentState.product[key] = event.currentTarget.value;
        this.setState(currentState);
    }

    private handleNumberValueChange(event: React.FormEvent<HTMLInputElement>, key: EProductKeys.Price) {
        let currentState = Object.create(this.state) as IStates;
        currentState.product[key] = parseInt(event.currentTarget.value);
        this.setState(currentState);
    }

    private handleCurrencyValueChange(event: React.FormEvent<HTMLSelectElement>) {
        let currentState = Object.create(this.state) as IStates;
        currentState.product[EProductKeys.Currency] = event.currentTarget.value as ECurrency;
        this.setState(currentState);
    }

    private handlePropertiesValueChange: onPropertiesChange = (properties: Array<IProperty>) => {
        let currentState = Object.create(this.state) as IStates;
        currentState.product[EProductKeys.Properties] = properties;
        this.setState(currentState);
    };

    //@ts-ignore
    private handlePicturesChange: onFilesChange = (files: Array<File>, imgs: Array<HTMLSpanElement>) => {
        let currentState = Object.create(this.state) as IStates;
        currentState.product[EProductKeys.Pictures] = files;
        currentState.imgs = imgs;
        this.setState(currentState);
    };

    render() {
        return(
            <div>
                <form className="container column mutationForm" action="" onSubmit={this._handleSubmit}>
                    <label className="block" htmlFor="name-field">
                        {this._langData.form.product.name}
                        <input id="name-field" type="text" placeholder={this._langData.form.product.writeName} onChange={(e) => this.handleStringValueChange(e, EProductKeys.Name)}/>
                    </label>
                    <label className="block" htmlFor="price-field">
                        {this._langData.form.product.price}
                        <input id="price-field" type="number" min="0" placeholder={this._langData.form.product.writePrice} onChange={(e) => this.handleNumberValueChange(e, EProductKeys.Price)}/>
                    </label>
                    <label className="block" htmlFor="currency-field">
                        {this._langData.form.product.currency}
                        <select id="currency-field" defaultValue={ECurrency.Ruble} onChange={(e) => {this.handleCurrencyValueChange(e)}}>
                            <option value={ECurrency.Ruble}>{HTMLTricks.entityToChar(CurrencyEntities[ECurrency.Ruble])}</option>
                            <option value={ECurrency.Dollar}>{HTMLTricks.entityToChar(CurrencyEntities[ECurrency.Dollar])}</option>
                            <option value={ECurrency.Euro}>{HTMLTricks.entityToChar(CurrencyEntities[ECurrency.Euro])}</option>
                        </select>
                    </label>
                    <label className="block container column" htmlFor="description-field">
                        {this._langData.form.product.description}
                        <textarea id="description-field" placeholder={this._langData.form.product.writeDescription} cols={30} rows={10} onChange={(e) => this.handleStringValueChange(e, EProductKeys.Description)}/>
                    </label>
                    <span className="block">
                        <ProductPropertiesField language={this.props.language} onChangeHandler={this.handlePropertiesValueChange}/>
                    </span>
                    <DragAndDropFile language={this.props.language} handleFileChange={this.handlePicturesChange}/>
                    <button>{this._langData.form.product.submit}</button>
                </form>
            </div>
        )
    }
}

export default CreateForm;