import React from 'react';
import {Options} from './Options';
import ILang from '../lang/ILang';
import Lang from '../lang';
import {ERequestTypes, GraphQL, IIdentifiedProduct} from "../ts/GraphQL";
import Products from './Products';
import {IProduct} from "../types";
import FileReceiver from "../ts/FileReceiver";

export interface IProductsListProps {
    language: string
}

interface IStates {
    products: Array<IProduct>
}

export class ProductsList extends React.Component<IProductsListProps, IStates> {
    private _langData: ILang;

    constructor(props: IProductsListProps) {
        super(props);
        this._langData = Lang(props.language);
        this.state = {
            products: []
        }
    }

    componentDidMount(): void {
        let query = `query AllProducts { allProducts
            { id, name, price, currency, description, properties, posted} }`;
        GraphQL.fetch({
            query: query
        }, ERequestTypes.AllProducts)
            .then(result => {
                this.handleFetchedProducts(result);
            })
    }

    private handleFetchedProducts(products: Array<IIdentifiedProduct>) {
        let clearProducts: Array<IProduct> = [];

        products.forEach((product) => {
            clearProducts.push(product.product);
        });

        this.setState({
            products: clearProducts
        });

        this.downloadPictures(products);
    }

    private downloadPictures(products: Array<IIdentifiedProduct>) {
        return new Promise(async (resolve, reject) => {
            for (let i = 0; i < products.length; i++) {
                let product = products[i];
                let fr = new FileReceiver(product.id);
                await fr.download()
                    .then(result => {
                        let pictures: Array<File> = [];

                        result.forEach((file) => {
                            pictures.push(new File([file.buffer], 'picture'));
                        });

                        const currentState = this.state;
                        currentState.products[i].pictures = pictures;
                        this.setState(currentState);
                    })
                    .catch(error => console.log(error));
            }
        })
    }

    render() {
        return(
            <div>
                <Options language={this.props.language} productsCount={this.state.products.length}/>
                <Products language={this.props.language} products={this.state.products}/>
            </div>
        )
    }
}

export default ProductsList;