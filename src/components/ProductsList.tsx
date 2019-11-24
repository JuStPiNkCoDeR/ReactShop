import React from 'react';
import {Options} from './Options';
import ILang from '../lang/ILang';
import Lang from '../lang';
import {ERequestTypes, GraphQL, IIdentifiedProduct} from "../ts/GraphQL";
import Products from './Products';
import {IProduct} from "../types";
import FileReceiver from "../ts/FileReceiver";
import {func} from "prop-types";

export interface IProductsListProps {
    language: string
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
                <Options language={this.props.language} productsCount={this.state.products.length}/>
                <Products language={this.props.language} products={this.state.products}/>
            </div>
        )
    }
}

export default ProductsList;