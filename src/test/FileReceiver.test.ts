import {ERequestTypes, GraphQL} from "../ts/GraphQL";
import FileReceiver from "../ts/FileReceiver";

it('FileReceiver works', async () => {
    let id = '5dd9832d99e3985997801b6a';
    /*let query = `query AllProducts { allProducts
            { id, name, price, currency, description, properties, posted} }`;
    await GraphQL.fetch({
        query: query,
        variables: {}
    }, ERequestTypes.AllProducts)
        .then(result => {
            id = result[0].id;
        });*/

    let fr = new FileReceiver(id);
    await fr.download()
        .then(result => console.log(result));
});