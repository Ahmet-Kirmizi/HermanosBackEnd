const express = require('express');
const router = express.Router();
const userDetails = require('../models/userDetails')
const bcrypt = require('bcrypt');
const mongoose = require('mongoose')
const { body, validationResult } = require('express-validator');

router.post('/', body('email').isEmail(),body('password').isAlphanumeric().isLength({min : 8}),async (req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try{
        const userdata = await userDetails.create({
            _id : mongoose.Types.ObjectId(),
            email : req.body.email,
            password : req.body.password,
        })
        const salt = await bcrypt.genSalt(10);
        userdata.password = await bcrypt.hash(userdata.password, salt)
        userdata.save().then((doc) => res.status(201).send(doc));

    }
    catch (err){
        res.status(400).json({message : err.message})
    }
})
module.exports = router;