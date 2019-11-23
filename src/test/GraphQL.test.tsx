import {ERequestTypes, GraphQL} from '../ts/GraphQL';
import {ECurrency, EProductKeys, IProduct, IProperty} from "../types";

it('GraphQL mutate correctly', async () => {
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
        pictures: [],
        posted: Date.now()

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

    await GraphQL.fetch({
        query: mutation,
        variables: params
    }, ERequestTypes.CreateProduct)
        .then(result => console.log(result));
});