const express = require('express');
const router = express.Router();
const userDetails = require('../models/userDetails')
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')



router.post('/', body('email').isEmail(),body('password').isAlphanumeric().isLength({min : 8}),async (req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try{
        const userData = await userDetails.create({
            email : req.body.email,
            password : req.body.password,
        })

        const token = await jwt.sign({userData}, process.env.TOKEN_SECRET, {expiresIn: '30d'})
        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password, salt)
        const doc = await userData.save();
        //const token = await jwt.sign({userEmail}, process.env.TOKEN_SECRET, {expiresIn: '180s'})
        return res.status(201).json({doc, token})
    }
    catch (err){
        res.status(400).json({message : err.message})
    }
})




module.exports = router;