import React from 'react';
import ILang from "../lang/ILang";
import Lang from '../lang';
import Product from './Product';
import {IProduct} from "../types";

export interface IProductsProps {
    language: string,
    products: Array<IProduct>
}

export class Products extends React.Component<IProductsProps> {
    private _langData: ILang;

    constructor(props: IProductsProps) {
        super(props);
        this._langData = Lang(props.language);
    }

    render() {
        let products = this.props.products;
        let productsAsJSX = [];

        for (let i = 0; i < products.length; i++) {
            productsAsJSX.push(<Product key={i} language={this.props.language} product={products[i]}/>);
        }

        return(
            <div className="productsList">
                {productsAsJSX.map((product) => product)}
            </div>
        )
    }
}

export default Products;