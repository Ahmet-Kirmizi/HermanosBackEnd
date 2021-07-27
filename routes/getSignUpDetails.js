const express = require('express');
const router = express.Router();
const userDetails = require('../models/userDetails')
const bcrypt = require('bcrypt');
const mongoose = require('mongoose')
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')



// creating user for each user
router.post('/signUp',body('email').isEmail(),body('password').isLength({min : 8}).isAlphanumeric(),body('retypepassword').isLength({min : 8}).isAlphanumeric() ,body('telephone').isNumeric(),async (req , res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});
    }
    try {
        // console.log("Body", req.body);
        const user = await userDetails.create({
            _id : mongoose.Types.ObjectId(),
            name : req.body.name,
            surname : req.body.surname,
            custdate : req.body.custdate,
            email : req.body.email,
            password : req.body.password,
            retypepassword : req.body.retypepassword,
            telephone : req.body.telephone,
            address : req.body.address,
            credits : 5000,
        })
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt)
        user.retypepassword = await bcrypt.hash(user.retypepassword, salt)
        const token = await jwt.sign({_id:user._id, name:user.name, email:user.email}, process.env.TOKEN_SECRET, {expiresIn: '1000000000000s'})
        user.save().then((doc) => res.status(201).send({doc, token}));

    }catch (err){
        return res.status(404).json({message: err.message})
    }
})
// getting user for each user
router.get('/signUp',async (req , res) =>{
    try{
            await userDetails.find().select('_id name surname custdate email password retypepassword telephone').exec().then(documents =>{
            const  response = {
                "count": documents.length,
                "details" : documents.map(document =>{
                    return{
                        name : document.name,
                        surname : document.surname,
                        custdate : document.custdate,
                        email : document.email,
                        password : document.password,
                        retypepassword : document.retypepassword,
                        telephone : document.telephone,
                        id : document._id,
                        requests:{
                            type : 'GET',
                            url : 'http://localhost:3000/getSignUpDetails/signUp/' + document._id,
                        }
                    }
                })
            }
             return res.status(200).json(response)
        })

    }

    catch(err){
        res.status(500).json({message : err.message})
    }
})

router.get('/signUp/:signInid',async (req , res) =>{
    try{
        const id = req.params.signInid;
        userDetails.findById(id).select('_id name surname custdate email password retypepassword telephone').exec().then(docs =>{
                console.log("from database signUpDetails",docs);
                 return res.status(200).json({
                    user : docs,
                    requests : {
                        type : 'GET',
                    }
                })
        })


    }
    catch (err){
        console.log(err)
         return res.status(500).json({message : err.message})
    }
})
/*
router.delete('/signUp/:signInid', async (req, res , next) =>{
    try {
        const id = req.params.signInid;
        userDetails.findByIdAndDelete(id).exec().then(data =>{
            return res.status(200).json()
        })
    }
    catch (err){
        return res.status(500).json({message : err.message})
    }
})

*/
module.exports = router;
