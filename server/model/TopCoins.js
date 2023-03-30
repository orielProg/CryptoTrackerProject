const mongoose = require('mongoose')

const topCoinsSchema = new mongoose.Schema({
    coin: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    hour_diff: {
        type: String,
        required: true,
    },
    day_diff: {
        type: String,
        required: true,
    },
    seven_diff: {
        type: String,
        required: true,
    },
    day_volume: {
        type: String,
        required: true,
    },
    mkt_cap: {
        type: String,
        required: true,
    },
    prediction: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('TopCoin', topCoinsSchema)