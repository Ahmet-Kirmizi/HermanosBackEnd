const express = require('express');
const router = express.Router();
const userDetails = require('../models/userDetails')
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')
require('dotenv').config()


// authentication for token
const tokenAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const bearerHeader = authHeader.split(' ')[1];
    if (authHeader){
        jwt.verify(bearerHeader, process.env.TOKEN_SECRET, (err, userData) =>{
            if(err){
                console.log(err)
                return res.status(403).json()
            }
            req.body.userData = userData;
            next();
        });

    }else{
        res.sendStatus(401);
    }
}


router.post('/',tokenAuth,body('email').isEmail(),body('password').isAlphanumeric().isLength({min : 8}),async (req, res) =>{
    // validation error:
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try{
        // create mongoose object
        const userData = await userDetails.create({
            email : req.body.email,
            password : req.body.password,
        })
        const accessToken = await jwt.sign({userData}, process.env.TOKEN_SECRET, {expiresIn: '100000000000000000000000s'})

        // encrypt password:
        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password, salt)

        const doc = await userData.save();
        //const accessToken = await jwt.sign({userEmail}, process.env.TOKEN_SECRET, {expiresIn: '180s'})
        return res.status(201).json({ accessToken, doc})
    }
    catch (err){
        res.status(400).json({message : err.message})
    }
})

module.exports = router;