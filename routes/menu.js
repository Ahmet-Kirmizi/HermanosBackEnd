const express = require("express");
const router = express.Router();
require("dotenv").config();
const tokenAuth = require("../middlewares/tokenAuth");
const userDetails = require('../models/userDetails')


const coffees = [
    { name: "latte", price: 20, url: "https://scontent.fecn7-1.fna.fbcdn.net/v/t1.6435-9/216991470_101965968839118_7616420094217531027_n.jpg?_nc_cat=111&ccb=1-3&_nc_sid=730e14&_nc_ohc=grqzla36-HUAX_6bW32&_nc_ht=scontent.fecn7-1.fna&oh=81731d67ffdbbd2ec6a64dbef7d7fb08&oe=6125B079" },
    { name: "americano", price: 22, url: "https://scontent.fecn7-1.fna.fbcdn.net/v/t1.6435-9/217392436_101965985505783_3195504378779882822_n.jpg?_nc_cat=109&ccb=1-3&_nc_sid=730e14&_nc_ohc=UxSFPz7zc_AAX_VLWfZ&_nc_ht=scontent.fecn7-1.fna&oh=5c411a2a226aa746c15c09bd44fdfaea&oe=6123E2AA" }
]

router.get("/search", tokenAuth.tokenAuthenticator, async (req, res) => {
    try {
        const coffeeName = req.body.name
        const filterByName = await coffees.filter(coffee => coffee.name.includes(req.body.name))
        const token = req.body.bearerHeader;
        res.status(201).json({ filterByName , token})
    } catch (err) {
        res.status(403).json({ message: err.message });
    }
});
router.put('/purchase/:id', tokenAuth.tokenAuthenticator, async (req, res) => {
    try {
        let credit;
        const id = req.params.id;
        const creditsdb = await userDetails.findById(id).select({ credits: 1 }).exec().then(kredi => {
            credit = kredi.credits;
        })

        const coffeePrice = req.body.coffeePrice
        if ((credit > coffeePrice || credit === coffeePrice) && credit !== 0) {
            const reduceCredit = await userDetails.findByIdAndUpdate(id, { credits: (credit - coffeePrice) })
            reduceCredit.save().then((newCredit) => res.status(201).send({ newCredit }));
        }
        else{
            return res.status(404).json("Yetersiz bakiye")
        }

    }
    catch (err) {
        return res.status(403).json({ message: err.message })
    }
})


module.exports = router;
