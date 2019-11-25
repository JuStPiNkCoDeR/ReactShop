import React from 'react';
import {Options} from './Options';
import ILang from '../lang/ILang';
import Lang from '../lang';
import {ERequestTypes, GraphQL, IIdentifiedProduct} from "../ts/GraphQL";
import Products from './Products';
import {ECurrency, IProduct} from "../types";
import FileReceiver from "../ts/FileReceiver";
import {IPriceConditions} from "./SortProducts";

export type HandleSortOptionsChange = (conditionals: ISortConditionals) => void;

export interface ISortConditionals {
    price: IPriceConditions | null,
    currency: ECurrency | null
}

export interface IProductsListProps {
    language: string
}

interface IGraphParam {
    price: Array<number> | null,
    currency: ECurrency | null
}

interface IStates {
    products: Array<IProduct>
}

interface IGenerator {
    product: IIdentifiedProduct,
    count: number
}

function* getProducts(products: Array<IIdentifiedProduct>): Generator<IGenerator> {
    for (let i = 0; i < products.length; i++) {
        yield {
            count: i,
            product: products[i]
        };
    }
}

function downloadPictures(iterator: Generator<IGenerator>) {
    let product = iterator.next();

    if (!product.done) {
        let fr = FileReceiver.getInstance(product.value.product.id, (result: Array<Buffer>) => {
            let pictures: Array<File> = [];

            result.forEach((file) => {
                pictures.push(new File([file.buffer], 'picture'));
            });

            //@ts-ignore
            const currentState = this.state;
            currentState.products[product.value.count].pictures = pictures;
            //@ts-ignore
            this.setState(currentState);
            //@ts-ignore
            let nextStep = downloadPictures.bind(this);
            nextStep(iterator);
        });
        fr.download();
    }
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

    private handleSortChange: HandleSortOptionsChange = (conditionals => {
        let query = `query Products($price: [Int], $currency: String) {
            products(price: $price, currency: $currency) {
                id, name, price, currency, properties, posted
            }
        }`;

        let params: IGraphParam = {
            price: null,
            currency: null
        };

        if (conditionals.price) {
            let price = conditionals.price;
            if (price.from || price.to) {
                params.price = [];

                if (price.from) params.price[0] = price.from;
                if (price.to) {
                    if (params.price.length === 0) params.price[0] = 0;
                    params.price[1] = price.to;
                }
            }
        }

        if (conditionals.currency && conditionals.currency !== ECurrency.Unknown) params.currency = conditionals.currency;

        GraphQL.fetch({
            query: query,
            variables: params
        }, ERequestTypes.Products)
            .then(result => {
                this.handleFetchedProducts(result);
            })
    });

    private handleFetchedProducts(products: Array<IIdentifiedProduct>) {
        let clearProducts: Array<IProduct> = [];

        products.forEach((product) => {
            clearProducts.push(product.product);
        });

        this.setState({
            products: clearProducts
        });

        this.downloadResources(products);
    }

    private downloadResources(products: Array<IIdentifiedProduct>) {
        let iterator = getProducts(products);
        let download = downloadPictures.bind(this);
        download(iterator);
    }

    render() {
        return(
            <div>
                <Options handleChange={this.handleSortChange} language={this.props.language} productsCount={this.state.products.length}/>
                <Products language={this.props.language} products={this.state.products}/>
            </div>
        )
    }
}

export default ProductsList;