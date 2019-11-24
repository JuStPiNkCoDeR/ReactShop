const {
    GraphQLList,
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType
} = require('graphql');
const { ProductType } = require('../types');
const db = require('../../db');
const { ProductModel } = require('../../db/models');

const QueryProducts = new GraphQLObjectType({
    name: 'ProductsQuery',
    description: 'Products query schema',
    fields: () => ({
        product: {
            type: ProductType,
            description: 'Return the specified product',
            args: {
                name: { type: GraphQLString },
                price: { type: GraphQLInt },
                currency: { type: GraphQLString }
            },
            async resolve(rootValue, args) {
                await db.connect()
                    .catch(error => {throw error;});
                let conditionals = {};

                for (let k in args) {
                    if (args.hasOwnProperty(k) && args[k]) conditionals[k] = args[k];
                }

                return await ProductModel.findOne(conditionals, function (err, product) {
                    if (err) throw err;
                    return product;
                });
            }
        },
        allProducts: {
            type: GraphQLList(ProductType),
            description: "Return all products",
            async resolve() {
                await db.connect()
                    .catch(error => {throw error;});

                return await ProductModel.find(function (err, products) {
                    if (err) throw err;
                    return products;
                })
            }
        }
    })
});

module.exports.QueryProducts = QueryProducts;