const {
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType
} = require('graphql');

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
            type: GraphQLNonNull(GraphQLInt),
            resolve(product) {
                return product.posted.now();
            }
        }
    })
});

module.exports.ProductType = ProductType;