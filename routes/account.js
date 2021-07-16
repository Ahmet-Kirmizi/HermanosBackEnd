const express = require('express')
const router = express.Router();
const userDetails = require('../models/userDetails')
const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode');
require('dotenv').config()
const tokenAuth = require('../middlewares/tokenAuth')



router.get('/' ,tokenAuth.tokenAuthenticator, async (req,res) =>{
    try {
        const decodedToken = await jwt_decode(req.body.bearerHeader)
        res.status(403).json({decodedToken})
    }catch (err){
        return res.status(403).json({err : err.message})
    }
})






module.exports = router;