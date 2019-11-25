import {ECurrency, IProduct, IProperty} from "../types";

export interface IFetchData {
    query: string,
    variables?: any
}

export enum ERequestTypes {
    CreateProduct = 'createProduct', AllProducts = 'allProducts', Products = 'products'
}

interface IFetchedProductData {
    id?: string,
    name?: string,
    price?: number,
    currency?: ECurrency,
    description?: string,
    properties?: Array<Array<string>>,
    posted?: Date
}

function convert(data: IFetchedProductData): IIdentifiedProduct {
    let props: Array<IProperty> = [];
    let pictures: Array<File> = [];

    if (data.properties) {
        data.properties.forEach((property) => {
           props.push({
               name: property[0],
               value: property[1]
           })
        });
    }

    return {
        product: {
            name: data.name ? data.name : "",
            price: data.price ? data.price : -1,
            currency: data.currency ? data.currency : ECurrency.Unknown,
            description: data.description ? data.description : "",
            properties: props,
            posted: data.posted ? new Date(data.posted) : null,
            pictures: pictures
        },
        id: data.id ? data.id : ""
    }
}

function* converter(array: Array<IFetchedProductData>) {
    for (let i = 0; i < array.length; i++) {
        yield convert(array[i]);
    }
}

function convertFetchedData(data: Array<IFetchedProductData> | IFetchedProductData): Array<IIdentifiedProduct> {
    let products: Array<IIdentifiedProduct> = [];

    if (Array.isArray(data)) {
        let converterIterator = converter(data);
        let product = converterIterator.next();

        while (!product.done) {
            products.push(product.value);
            product = converterIterator.next();
        }
    } else {
        products.push(convert(data));
    }

    return products;
}

export interface IIdentifiedProduct {
    product: IProduct,
    id: string
}

export const GraphQL = {
    fetch(args: IFetchData, type: ERequestTypes): Promise<Array<IIdentifiedProduct>> {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://localhost:3001/graphql', true);
            xhr.responseType = 'json';
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(args));

            xhr.onreadystatechange = function () {
                if (this.readyState === 4) {
                    let ans = xhr.response.data[type] as IFetchedProductData;

                    if (ans) {
                        resolve(convertFetchedData(ans));
                    }
                }
            };

            xhr.onerror = function () {
                reject(this.response);
            }
        });
    },
    files: {}
};