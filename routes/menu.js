const express = require("express");
const router = express.Router();
require("dotenv").config();
const tokenAuth = require("../middlewares/tokenAuth");
const userDetails = require('../models/userDetails')
const sendToken = require('../middlewares/sendToken')

const coffees = [
    { name: "latte", price: "20 TL", url: "https://scontent.fecn7-1.fna.fbcdn.net/v/t1.6435-9/216991470_101965968839118_7616420094217531027_n.jpg?_nc_cat=111&ccb=1-3&_nc_sid=730e14&_nc_ohc=grqzla36-HUAX_6bW32&_nc_ht=scontent.fecn7-1.fna&oh=81731d67ffdbbd2ec6a64dbef7d7fb08&oe=6125B079" },
    { name: "americano", price: "22 TL", url: "https://scontent.fecn7-1.fna.fbcdn.net/v/t1.6435-9/217392436_101965985505783_3195504378779882822_n.jpg?_nc_cat=109&ccb=1-3&_nc_sid=730e14&_nc_ohc=UxSFPz7zc_AAX_VLWfZ&_nc_ht=scontent.fecn7-1.fna&oh=5c411a2a226aa746c15c09bd44fdfaea&oe=6123E2AA" },
    { name: "frappe", price: "20 TL", url: "https://scontent.fecn7-1.fna.fbcdn.net/v/t1.6435-9/216991470_101965968839118_7616420094217531027_n.jpg?_nc_cat=111&ccb=1-3&_nc_sid=730e14&_nc_ohc=grqzla36-HUAX_6bW32&_nc_ht=scontent.fecn7-1.fna&oh=81731d67ffdbbd2ec6a64dbef7d7fb08&oe=6125B079" },
    { name: "espresso", price: "22 TL", url: "https://scontent.fecn7-1.fna.fbcdn.net/v/t1.6435-9/217392436_101965985505783_3195504378779882822_n.jpg?_nc_cat=109&ccb=1-3&_nc_sid=730e14&_nc_ohc=UxSFPz7zc_AAX_VLWfZ&_nc_ht=scontent.fecn7-1.fna&oh=5c411a2a226aa746c15c09bd44fdfaea&oe=6123E2AA" },
    { name: "mocha", price: "20 TL", url: "https://scontent.fecn7-1.fna.fbcdn.net/v/t1.6435-9/216991470_101965968839118_7616420094217531027_n.jpg?_nc_cat=111&ccb=1-3&_nc_sid=730e14&_nc_ohc=grqzla36-HUAX_6bW32&_nc_ht=scontent.fecn7-1.fna&oh=81731d67ffdbbd2ec6a64dbef7d7fb08&oe=6125B079" },
    { name: "caramel latte", price: "22 TL", url: "https://scontent.fecn7-1.fna.fbcdn.net/v/t1.6435-9/217392436_101965985505783_3195504378779882822_n.jpg?_nc_cat=109&ccb=1-3&_nc_sid=730e14&_nc_ohc=UxSFPz7zc_AAX_VLWfZ&_nc_ht=scontent.fecn7-1.fna&oh=5c411a2a226aa746c15c09bd44fdfaea&oe=6123E2AA" },
    { name: "caramel frappe", price: "20 TL", url: "https://scontent.fecn7-1.fna.fbcdn.net/v/t1.6435-9/216991470_101965968839118_7616420094217531027_n.jpg?_nc_cat=111&ccb=1-3&_nc_sid=730e14&_nc_ohc=grqzla36-HUAX_6bW32&_nc_ht=scontent.fecn7-1.fna&oh=81731d67ffdbbd2ec6a64dbef7d7fb08&oe=6125B079" },
    { name: "americano", price: "22 TL", url: "https://scontent.fecn7-1.fna.fbcdn.net/v/t1.6435-9/217392436_101965985505783_3195504378779882822_n.jpg?_nc_cat=109&ccb=1-3&_nc_sid=730e14&_nc_ohc=UxSFPz7zc_AAX_VLWfZ&_nc_ht=scontent.fecn7-1.fna&oh=5c411a2a226aa746c15c09bd44fdfaea&oe=6123E2AA" },
]
// search
router.get("/search", tokenAuth.tokenAuthenticator, async (req, res) => {
    try {
        const filterByName = await coffees.filter(coffee => coffee.name.includes(req.body.name))
        res.status(201).json({ filterByName })
    } catch (err) {
        res.status(403).json({ message: err.message });
    }
});

// get token
router.get('/token', sendToken.token, tokenAuth.tokenAuthenticator, async (req, res) => {
    try {
        const token = req.body.bearerHeader;
        return res.status(200).json({ token })
    } catch (err) {
        return res.status(403).json({ message: err.message })
    }
});
// get menu details
router.get('/', async (req, res) => {
    try {
        res.status(200).send({ coffees })
    } catch (err) {
        return res.status(403).json({ message: err.message })
    }
})


// buy
router.put('/purchase/credit/:id', tokenAuth.tokenAuthenticator, async (req, res) => {
    try {
        let credit;
        const id = req.params.id;
        const creditsdb = await userDetails.findById(id).select({ credits: 1 }).exec().then(cred => {
            credit = cred.credits;
        })

        const coffeePrice = req.body.coffeePrice
        if ((credit > coffeePrice || credit === coffeePrice) && credit !== 0) {
            const reduceCredit = await userDetails.findByIdAndUpdate(id, { credits: (credit - coffeePrice) })
            console.log(reduceCredit);
            reduceCredit.save().then((newCredit) => res.status(201).send({ newCredit }));
        }
        else {
            return res.status(404).json("Yetersiz bakiye")
        }

    }
    catch (err) {
        return res.status(403).json({ message: err.message })
    }
});

// save bought product to db 
router.post('/purchase/products/:id', tokenAuth.tokenAuthenticator, async (req, res) => {
    try {
        let customerName;
        let customerSurname;
        const id = req.params.id;
        const customersdb = await userDetails.findOne({ _id: req.params.id }, (err, result) => {
            customerName = result.name;
            customerSurname = result.surname;
        })
        const coffeeName = req.body.coffeeName;
        const coffeePrice = req.body.coffeePrice;
        console.log(customerName, customerSurname)
        const customerOrder = await userDetails.create({
            customerName: customerName,
            customerSurname: customerSurname,
            coffeeName: coffeeName,
            coffeePrice: coffeePrice
        })
        customerOrder.save().then((productDetails) => res.status(201).send({ productDetails }));
    } catch (err) {
        return res.status(403).json({ message: err.message })
    }
})


module.exports = router;
