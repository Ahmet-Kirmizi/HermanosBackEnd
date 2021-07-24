const userDetails = require('../models/userDetails')
const bcrypt = require('bcrypt');
const mongoose = require('mongoose')
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')

const passwordAuth =  (req, res, next) =>{
    const dataForPassword = userDetails.findOne({email : req.body.email}).select({email:1}).lean().exec()
    console.log(dataForPassword)
    if(dataForPassword){
        next();
    }


}


module.exports = {passwordAuthenticator : passwordAuth}