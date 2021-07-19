const express = require('express')
const router = express.Router();
const userDetails = require('../models/userDetails')
const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode');
require('dotenv').config()
const tokenAuth = require('../middlewares/tokenAuth')



router.get('/' ,tokenAuth.tokenAuthenticator, async (req,res) =>{ // get route to get name surname email and password to display on account
    try {
        const decodedToken = await jwt_decode(req.body.bearerHeader) // decoding
        const decodedTokenValues = Object.values(decodedToken) // getting values
        for(const values of decodedTokenValues){ // looping through array of values
           if(values === req.body.email) { // validating email
               const userData = await userDetails.findOne({email : req.body.email}).select({email:1,name: 1,surname:1,password:1}).lean().exec()
               return res.status(201).json(userData)
           }
           }
    }catch (err){
        return res.status(403).json({message : err.message})
    }
})

// delete method to reset password
router.delete('/:id', async (req, res) =>{
    try{
        const idToDelete = req.params.id
        const deletedUser = await userDetails.findByIdAndDelete(idToDelete).exec();
        if(!deletedUser){
            res.sendStatus(404);
            return res.send(deletedUser)
        }
    }catch(err){
        res.status(403).json({message : err.message})
    }
})






module.exports = router;