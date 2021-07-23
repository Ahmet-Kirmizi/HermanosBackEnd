const express = require('express')
const router = express.Router();
const userDetails = require('../models/userDetails')
const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode');
require('dotenv').config()
const tokenAuth = require('../middlewares/tokenAuth')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

router.post('/' , body('paymentName').isString(), body('paymentSurname').isString(),body('paymentCardNo').isNumeric(), body('paymentCardNo').isLength({ min : 16}),body('paymentCCV').isNumeric(), body('paymentEXP').isDate(),tokenAuth.tokenAuthenticator,  async (req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});
    }
    try{
        const payment  = await userDetails.create({
           paymentName : req.body.paymentName,
           paymentSurname : req.body.paymentSurname,
           paymentCardNo : req.body.paymentCardNo,
           paymentCCV : req.body.paymentCCV,
           paymentEXP : req.body.paymentEXP
        })
        payment.save().then((details) =>{res.status(201).send({details})})
    }catch (err){
        res.status(403).json({message : err.message})
    }
})

module.exports = router;