import {ECurrency, IProduct, IProperty} from "../types";

export interface IFetchData {
    query: string,
    variables?: any
}

export enum ERequestTypes {
    CreateProduct = 'createProduct'
}

interface IFetchedProductData {
    id?: string,
    name?: string,
    price?: number,
    currency?: ECurrency,
    description?: string,
    properties?: Array<Array<string>>,
    posted?: number
}

function convert(data: IFetchedProductData, downloadFiles: boolean): IIdentifiedProduct {
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

    if (downloadFiles) {
        //TODO("Загружать картинки")
    }

    return {
        product: {
            name: data.name ? data.name : "",
            price: data.price ? data.price : -1,
            currency: data.currency ? data.currency : ECurrency.Unknown,
            description: data.description ? data.description : "",
            properties: props,
            posted: data.posted ? data.posted : -1,
            pictures: pictures
        },
        id: data.id ? data.id : ""
    }
}

function* converter(array: Array<IFetchedProductData>, downloadFiles: boolean) {
    for (let i = 0; i < array.length; i++) {
        yield convert(array[i], downloadFiles);
    }
}

function convertFetchedData(data: Array<IFetchedProductData> | IFetchedProductData, downloadFiles: boolean = false): Array<IIdentifiedProduct> {
    let products: Array<IIdentifiedProduct> = [];

    if (data instanceof Array) {
        let converterIterator = converter(data, downloadFiles);
        let product = converterIterator.next();

        while (!product.done) {
            products.push(product.value);
            product = converterIterator.next();
        }
    } else {
        products.push(convert(data, downloadFiles));
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
                        if (type === ERequestTypes.CreateProduct)
                            resolve(convertFetchedData(ans, false));
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