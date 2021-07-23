const mongoose = require('mongoose')

const signUpSchema = new mongoose.Schema({
    name : {
        type : String,
    },
    surname : {
        type: String,
    },
    custdate: {
        type: Date,
        default: Date.now()
    },
    email: {
        type : String,
        unique: true,
    },
    password : {
        type: String,
    },
    retypepassword : {
        type: String,
    },
    telephone : {
        type: Number,
    },
    address : {
        type : String
    },
    paymentName : {
        type : String
    },
    paymentSurname : {
        type : String
    },
    paymentCardNo : {
        type  : Number
    },
    paymentCCV : {
        type  : Number
    },
    paymentEXP : {
        type : Date,
        default : Date.now()
    }
})

module.exports =  mongoose.model('user', signUpSchema,'user');