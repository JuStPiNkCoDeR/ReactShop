const mongoose = require('mongoose');
const { ProductSchema } = require('../schemas');

const ProductModel = mongoose.model('Products', ProductSchema);

module.exports.ProductModel = ProductModel;