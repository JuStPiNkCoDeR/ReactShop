const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, default: "Без имени", match: /[а-я]/ },
    price: { type: Number, default: -1, min: -1 },
    currency: { type: String, enum: ['Ruble', 'Unknown'], default: 'Ruble' },
    description: { type: String, default: "Нет описания" },
    properties: { type: Array, default: [] },
    posted: { type: Date, default: Date.now() },
    pictures: { type: Array, default: [] }
});

module.exports.ProductSchema = ProductSchema;