const express = require('express')
const router = express.Router();
const userDetails = require('../models/userDetails')
const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode');
require('dotenv').config()
const tokenAuth = require('../middlewares/tokenAuth')
const bcrypt = require('bcrypt');

router.post('/' ,tokenAuth.tokenAuthenticator,  async (req, res) =>{
    try{
        const payment  = userDetails.create({
           paymentName : req.body.paymentName,
           paymentSurname : req.body.paymentSurname,
           paymentCardNo : req.body.paymentCardNo,
           paymentCCV : req.body.paymentCCV,
           paymentEXP : req.body.paymentEXP
        })
    }catch (err){
        res.status(403).json({message : err.message})
    }
})



module.exports = router;