const express = require('express')
const router = express.Router();
const userDetails = require('../models/userDetails')
const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode');
require('dotenv').config()
const tokenAuth = require('../middlewares/tokenAuth')



router.get('/' ,tokenAuth.tokenAuthenticator, async (req,res) =>{
    try {
        const decodedToken = await jwt_decode(req.body.bearerHeader) // decoding
        const decodedTokenValues = Object.values(decodedToken) // getting values
        for(const values of decodedTokenValues){ // looping through array of values
           if(values === req.body.email) { // validating email
               res.status(201).json({values}) // decoded token email
           }
        }
        return res.status(201).json()
    }catch (err){
        return res.status(403).json({err : err.message})
    }
})






module.exports = router;