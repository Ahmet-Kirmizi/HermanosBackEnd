const mongoose = require('mongoose')

const signUpSchema = new mongoose.Schema({
    name : {
        type : String,
        default : null,
    },
    surname : {
        type: String,
        default: null
    },
    custdate: {
        type: Date,
        default: Date.now()
    },
    email: {
        type : String,
        required : true,
        default : null,
    },
    password : {
        type: String,
    },
    retypepassword : {
        type: String,
        default : null
    },
    telephone : {
        type: Number,
        default : null,
    },
})

module.exports =  mongoose.model('users', signUpSchema);