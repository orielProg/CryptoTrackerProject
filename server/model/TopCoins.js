const mongoose = require('mongoose')

const topCoinsSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    current_price: {
        type: Number,
        required: true,
    },
    price_change_percentage_1h_in_currency: {
        type: Number,
        required: true,
    },
    price_change_percentage_24h_in_currency: {
        type: Number,
        required: true,
    },
    price_change_percentage_7d_in_currency: {
        type: Number,
        required: true,
    },
    total_volume: {
        type: Number,
        required: true,
    },
    market_cap: {
        type: Number,
        required: true,
    },
    prediction: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('TopCoin', topCoinsSchema)