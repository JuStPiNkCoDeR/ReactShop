import React from 'react';
import Lang from '../lang';
import ILang from "../lang/ILang";
import {CurrencyEntities, ECurrency, IProduct} from "../types";
import HTMLTricks from "../ts/HTMLTricks";

export interface IProductProps {
    language: string,
    product: IProduct
}

export class Product extends React.Component<IProductProps> {
    private _langData: ILang;

    constructor(props: IProductProps) {
        super(props);
        this._langData = Lang(props.language);
    }

    render() {
        const product = this.props.product;
        let pictures = product.pictures;
        let images: Array<JSX.Element> = [];
        let properties: Array<JSX.Element> = [];

        for (let i = 0; i < pictures.length; i++) {
            let picture = pictures[i];
            let src = URL.createObjectURL(picture);
            images.push(<img src={src} key={i} alt="Product"/>);
        }

        for (let i = 0; i < product.properties.length; i++) {
            let property = product.properties[i];
            properties.push(<li key={i}><span>{property.name}</span>{property.value}</li>);
        }

        return(
            <div className="product">
                <div className="textData">
                    <p className="name">{product.name}</p>
                    <p><span>{this._langData.productsList.product.price}</span>{product.price}({product.currency === ECurrency.Unknown ? this._langData.productsList.product.unknown : HTMLTricks.entityToChar(CurrencyEntities[product.currency])})</p>
                    <p><span>{this._langData.productsList.product.description}</span>{product.description}</p>
                    <p>
                        <span>{this._langData.productsList.product.properties}</span>
                    </p>
                    <ul>
                        {properties.map((property) => property)}
                    </ul>
                    <p>{this._langData.productsList.product.date} {product.posted ? product.posted.toLocaleDateString() : this._langData.productsList.product.unknown}</p>
                </div>
                <span className="images">
                    {images.map((image) => image)}
                </span>
            </div>
        )
    }
}

export default Product;