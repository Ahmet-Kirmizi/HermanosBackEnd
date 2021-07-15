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
        required : true,
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
    }
})

module.exports =  mongoose.model('users', signUpSchema);