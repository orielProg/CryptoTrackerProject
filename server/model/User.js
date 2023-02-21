const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        max : 255,
        min : 6
    },
    email : {
        type : String,
        required : true,
        max : 255,
        min : 6
    },
    password : {
        type : String,
        required : true,
        max : 1024,
        min : 6
    },
    date : {
        type : Date,
        default : Date.now
    },
    wallets : {
        type : Array,
        default : []
    },
    latestData : {
        type : Object,
        default : {}
    },
    photoUrl : {
        type : String,
        default : ""
    },
    googleID : {
        type : String,
        default : ""
    },
    refreshToken : {
        type : String,
        default : null,
        expires : 3.154e10
    }
})

module.exports = mongoose.model('User', userSchema)