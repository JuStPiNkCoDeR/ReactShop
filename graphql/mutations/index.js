const {
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType
} = require('graphql');
const mongoose = require('mongoose');
const db = require('../../db');
const { ProductModel } = require('../../db/models');
const { ProductType } = require('../types');

const CreateProduct = new GraphQLObjectType({
    name: 'CreateProduct',
    description: 'Create new product',
    fields: () => ({
        createProduct: {
            type: ProductType,
            description: 'Create and return new user',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                price: { type: GraphQLNonNull(GraphQLInt) },
                currency: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
                properties: { type: GraphQLList(GraphQLList(GraphQLString)) }
            },
            async resolve(rootValue, args) {
                let product = new ProductModel({
                    _id: new mongoose.Types.ObjectId(),
                    name: args.name,
                    price: args.price,
                    currency: args.currency,
                    description: args.description,
                    posted: Date.now(),
                    properties: args.properties
                });
                await db.connect();
                return await product.save()
                    .then(result => {return result;});
            }
        }
    }),
});

module.exports.CreateProduct = CreateProduct;