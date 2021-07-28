const express = require('express')
const router = express.Router();
const userDetails = require('../models/userDetails')
const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode');
require('dotenv').config()
const tokenAuth = require('../middlewares/tokenAuth')
const bcrypt = require('bcrypt');


// get route to get name surname email and password to display on account
router.get('/', tokenAuth.tokenAuthenticator, async (req, res) => {
    try {
        const decodedToken = await jwt_decode(req.body.bearerHeader) // decoding
        const decodedTokenValues = Object.values(decodedToken) // getting values
        for (const values of decodedTokenValues) { // looping through array of values
            if (values === req.body.email) { // validating email
                const userData = await userDetails.findOne({ email: req.body.email }).select({ email: 1, name: 1, surname: 1, password: 1 }).lean().exec()
                return res.status(201).json(userData)
            }
        }
    } catch (err) {
        return res.status(403).json({ message: err.message })
    }
})

// delete method to delete user
router.delete('/delete/:id', tokenAuth.tokenAuthenticator, async (req, res) => {
    try {
        const idToDelete = req.params.id
        const deletedUser = await userDetails.findByIdAndDelete(idToDelete).exec().then(successful => {
            return res.status(200).json()
        });
        if (!deletedUser) {
            res.sendStatus(404);
            return res.send(deletedUser)
        }
    } catch (err) {
        res.status(403).json({ message: err.message })
    }
})

// update user details
router.put('/updateName/:id', tokenAuth.tokenAuthenticator, async (req, res) => {
    try {
        const idToUpdate = req.params.id;
        const updateName = await userDetails.findByIdAndUpdate(idToUpdate, { name: req.body.name })
        updateName.save().then((changedName) => res.status(201).send({ changedName }));
    } catch (err) {
        return res.status(403).json({ message: err.message })
    }
});


router.put('/updateSurname/:id', tokenAuth.tokenAuthenticator, async (req, res) => {
    try {
        const idToUpdate = req.params.id;
        const updateSurname = await userDetails.findByIdAndUpdate(idToUpdate, { surname: req.body.surname })
        updateSurname.save().then((changedSurname) => res.status(201).send({ changedSurname }));
    } catch (err) {
        return res.status(403).json({ message: err.message })
    }
})
router.put('/updateEmail/:id', tokenAuth.tokenAuthenticator, async (req, res) => {
    try {
        const idToUpdate = req.params.id;
        const updateEmail = await userDetails.findByIdAndUpdate(idToUpdate, { email: req.body.email })
        updateEmail.save().then((changedEmail) => res.status(201).send({ changedEmail }));
    } catch (err) {
        return res.status(403).json({ message: err.message })
    }
})
router.put('/updatePassword/:id', tokenAuth.tokenAuthenticator, async (req, res) => {
    try {
        const lookForPassword = await userDetails.findOne({ email: req.body.email }).select({ email: 1 }).lean().exec()
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt)
        req.body.retypepassword = await bcrypt.hash(req.body.retypepassword, salt)
        if (lookForPassword !== null && req.body.password === req.body.retypepassword) {
            const idToUpdate = req.params.id;
            const updatePassword = await userDetails.findByIdAndUpdate(idToUpdate, { password: req.body.password, retypepassword: req.body.retypepassword })
            updatePassword.save().then((changedPassword) => res.status(201).send({ changedPassword }));
        }
    } catch (err) {
        return res.status(403).json({ message: err.message })
    }
})





module.exports = router;