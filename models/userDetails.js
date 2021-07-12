const mongoose = require('mongoose')

const signUpSchema = new mongoose.Schema({
    name : {
        type : String,
        required: true,
        default : null,
    },
    surname : {
        type: String,
        required: true,
        default: null
    },
    custdate: {
        type: Date,
        required: true,
        default: Date.now()
    },
    email: {
        type : String,
        required : true,
        default : null,
    },
    password : {
        type: String,
        required: true,
    },
    retypepassword : {
        type: String,
        required: true,
        default : null
    },
    telephone : {
        type: Number,
        required: true,
        default : null,
    },
})

module.exports =  mongoose.model('users', signUpSchema);