import {ERequestTypes, GraphQL} from '../ts/GraphQL';
import {ECurrency, EProductKeys, IProduct, IProperty} from "../types";

describe('GraphQL', () => {
    it('mutate correctly', async () => {
        let mutation = `mutation CreateProduct($name: String!, $price: Int!, $currency: String!, $description: String!
            $properties: [[String]]!) { 
            createProduct(name: $name, price: $price, currency: $currency, description: $description, properties: $properties) 
            { name } }`;
        const currentState: IProduct = {
            name: 'Ручка',
            price: 10,
            description: 'Просто ручка',
            currency: ECurrency.Ruble,
            properties: [{
                name: 'Качество',
                value: 'Наивысшее'
            } as IProperty],
            pictures: []

        };
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

        /*await GraphQL.fetch({
            query: mutation,
            variables: params
        }, ERequestTypes.CreateProduct)
            .then(result => console.log(result));*/
    });

    it('query specified products works correctly', async () => {
        let query = `query Products($price: [Int], $currency: String) {
        products(price: $price, currency: $currency) {
            id, name, price, currency, properties, posted
        }
    }`;
        let cond1 = {
            price: [10, 500]
        };

        let cond2 = {
            price: [100]
        };

        let cond3 = {
            price: [0, 100]
        };

        let cond4 = {
            currency: null
        };

        let cond5 = {
            currency: 'Ruble'
        };

        let cond6 = {
            price: [100],
            currency: 'Euro'
        };

        await GraphQL.fetch({
            query: query,
            variables: cond1
        }, ERequestTypes.Products)
            .then(result => {
                console.log(result);
                expect(result.length).toStrictEqual(3);
            })
            .catch(error => console.log(error));

        await GraphQL.fetch({
            query: query,
            variables: cond2
        }, ERequestTypes.Products)
            .then(result => {
                console.log(result);
                expect(result.length).toStrictEqual(2);
            })
            .catch(error => console.log(error));

        await GraphQL.fetch({
            query: query,
            variables: cond3
        }, ERequestTypes.Products)
            .then(result => {
                console.log(result);
                expect(result.length).toStrictEqual(3);
            })
            .catch(error => console.log(error));

        await GraphQL.fetch({
            query: query,
            variables: cond4
        }, ERequestTypes.Products)
            .then(result => {
                console.log(result);
                expect(result.length).toStrictEqual(4);
            })
            .catch(error => console.log(error));

        await GraphQL.fetch({
            query: query,
            variables: cond5
        }, ERequestTypes.Products)
            .then(result => {
                console.log(result);
                expect(result.length).toStrictEqual(1);
            })
            .catch(error => console.log(error));
    });
});