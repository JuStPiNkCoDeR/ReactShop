const {
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType
} = require('graphql');
const GraphQLDate = require('graphql-date');

const ProductType = new GraphQLObjectType({
    name: 'Product',
    description: 'This represent a product',
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLString),
            resolve(product) {
                return product._id;
            }
        },
        name: {
            type: GraphQLNonNull(GraphQLString)
        },
        price: {
            type: GraphQLNonNull(GraphQLInt)
        },
        currency: {
            type: GraphQLNonNull(GraphQLString)
        },
        description: {
            type: GraphQLNonNull(GraphQLString)
        },
        properties: {
            type: GraphQLNonNull(GraphQLList(GraphQLList(GraphQLString)))
        },
        posted: {
            type: GraphQLNonNull(GraphQLDate),
            resolve(product) {
                return new Date(product.posted);
            }
        }
    })
});

module.exports.ProductType = ProductType;