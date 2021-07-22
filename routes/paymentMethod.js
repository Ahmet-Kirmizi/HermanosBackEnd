const express = require('express')
const router = express.Router();
const userDetails = require('../models/userDetails')
const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode');
require('dotenv').config()
const tokenAuth = require('../middlewares/tokenAuth')
const bcrypt = require('bcrypt');

router.get('/paymentMethod' ,tokenAuth.tokenAuthenticator,  async (req, res) =>{
    try{


    }catch (err){
        res.status(403).json({message : err.message})
    }
})



module.exports = router;