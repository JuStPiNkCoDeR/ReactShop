const {
    GraphQLSchema
} = require('graphql');
const { QueryProducts } = require('./queries');
const { CreateProduct } = require('./mutations');

module.exports = new GraphQLSchema({
    query: QueryProducts,
    mutation: CreateProduct
});