const express = require("express");
const router = express.Router();
require("dotenv").config();
const tokenAuth = require("../middlewares/tokenAuth");
const userDetails = require('../models/userDetails')
const sendToken = require('../middlewares/sendToken')

const coffees = [
    { name: "latte", price: "20 TL", url: "https://scontent-otp1-1.xx.fbcdn.net/v/t39.30808-6/215332978_101965965505785_1614029869929507927_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=730e14&_nc_ohc=MwkspAtLBc4AX-2_IIV&_nc_oc=AQkAlvOlD-tsa-zsYNFIyJwxh7vUExCa_Hm87yD8070wj8YUEc09VvzCKQ6eJ8_ndzk&tn=n5BLRYI1ylSiTTcg&_nc_ht=scontent-otp1-1.xx&oh=00_AT9M3PJUXbuW7yXqL-EItULuTYR_MSrSHUT8uGpLoxslNw&oe=629D791B" },
    { name: "americano", price: "22 TL", url: "https://scontent-otp1-1.xx.fbcdn.net/v/t39.30808-6/217651115_101965982172450_3415404933660230705_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=730e14&_nc_ohc=os_BSYNUuIgAX_diXqr&_nc_ht=scontent-otp1-1.xx&oh=00_AT-XHiHSWczaGQ2H4i-gT2ZmvEf1Wx9f-uaDyLd1B02h0A&oe=629DEE0A" },
    { name: "frappe", price: "20 TL", url: "https://scontent-otp1-1.xx.fbcdn.net/v/t39.30808-6/215332978_101965965505785_1614029869929507927_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=730e14&_nc_ohc=MwkspAtLBc4AX-2_IIV&_nc_oc=AQkAlvOlD-tsa-zsYNFIyJwxh7vUExCa_Hm87yD8070wj8YUEc09VvzCKQ6eJ8_ndzk&tn=n5BLRYI1ylSiTTcg&_nc_ht=scontent-otp1-1.xx&oh=00_AT9M3PJUXbuW7yXqL-EItULuTYR_MSrSHUT8uGpLoxslNw&oe=629D791B" },
    { name: "espresso", price: "22 TL", url: "https://scontent-otp1-1.xx.fbcdn.net/v/t39.30808-6/217651115_101965982172450_3415404933660230705_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=730e14&_nc_ohc=os_BSYNUuIgAX_diXqr&_nc_ht=scontent-otp1-1.xx&oh=00_AT-XHiHSWczaGQ2H4i-gT2ZmvEf1Wx9f-uaDyLd1B02h0A&oe=629DEE0A" },
    { name: "mocha", price: "20 TL", url: "https://scontent-otp1-1.xx.fbcdn.net/v/t39.30808-6/215332978_101965965505785_1614029869929507927_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=730e14&_nc_ohc=MwkspAtLBc4AX-2_IIV&_nc_oc=AQkAlvOlD-tsa-zsYNFIyJwxh7vUExCa_Hm87yD8070wj8YUEc09VvzCKQ6eJ8_ndzk&tn=n5BLRYI1ylSiTTcg&_nc_ht=scontent-otp1-1.xx&oh=00_AT9M3PJUXbuW7yXqL-EItULuTYR_MSrSHUT8uGpLoxslNw&oe=629D791B" },
    { name: "caramel latte", price: "22 TL", url: "https://scontent-otp1-1.xx.fbcdn.net/v/t39.30808-6/217651115_101965982172450_3415404933660230705_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=730e14&_nc_ohc=os_BSYNUuIgAX_diXqr&_nc_ht=scontent-otp1-1.xx&oh=00_AT-XHiHSWczaGQ2H4i-gT2ZmvEf1Wx9f-uaDyLd1B02h0A&oe=629DEE0A" },
    { name: "caramel frappe", price: "20 TL", url: "https://scontent-otp1-1.xx.fbcdn.net/v/t39.30808-6/215332978_101965965505785_1614029869929507927_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=730e14&_nc_ohc=MwkspAtLBc4AX-2_IIV&_nc_oc=AQkAlvOlD-tsa-zsYNFIyJwxh7vUExCa_Hm87yD8070wj8YUEc09VvzCKQ6eJ8_ndzk&tn=n5BLRYI1ylSiTTcg&_nc_ht=scontent-otp1-1.xx&oh=00_AT9M3PJUXbuW7yXqL-EItULuTYR_MSrSHUT8uGpLoxslNw&oe=629D791B" },
    { name: "americano", price: "22 TL", url: "https://scontent-otp1-1.xx.fbcdn.net/v/t39.30808-6/217651115_101965982172450_3415404933660230705_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=730e14&_nc_ohc=os_BSYNUuIgAX_diXqr&_nc_ht=scontent-otp1-1.xx&oh=00_AT-XHiHSWczaGQ2H4i-gT2ZmvEf1Wx9f-uaDyLd1B02h0A&oe=629DEE0A" },
]
// search
router.post("/search", async (req, res) => {
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
        const query_value = req.query.name;
        const filteredQuery = coffees.filter(coffee => coffee.name.includes(query_value))
        res.status(200).send({ coffees, filteredQuery})
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
