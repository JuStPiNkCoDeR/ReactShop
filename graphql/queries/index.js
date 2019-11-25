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
        products: {
            type: GraphQLList(ProductType),
            description: 'Return the specified products',
            args: {
                price: { type: GraphQLList(GraphQLInt) },
                currency: { type: GraphQLString }
            },
            async resolve(rootValue, args) {
                await db.connect()
                    .catch(error => {throw error;});

                let conditionals = {};

                for (let k in args) {
                    if (args.hasOwnProperty(k) && args[k]) {
                        let argument = args[k];
                        if (Array.isArray(argument)) {
                            conditionals[k] = {};
                            conditionals[k]['$gte'] = argument[0];
                            if (argument[1]) conditionals[k]['$lte'] = argument[1];
                        } else conditionals[k] = argument;
                    }
                }

                return await ProductModel.find(conditionals, function (err, product) {
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