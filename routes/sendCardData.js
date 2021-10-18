const express = require("express");
const router = express.Router();
require("dotenv").config();
const tokenAuth = require("../middlewares/tokenAuth");
const userDetails = require('../models/userDetails')
const sendToken = require('../middlewares/sendToken')

cardDetails = [
    { name: "cappuccino", description: "Dark, rich espresso lies in wait under a smoothed and stretched layer of thick milk foam. An alchemy of barista artistry and craft.", options: ['sugar', 'size', 'sauce'], sugar: ['yes', 'no'], size: ['small', 'medium', 'large'], sauce: ['yes', 'no'] },
    { name: "latte", description: "Our dark, rich espresso balanced with steamed milk and a light layer of foam. A perfect milk-forward warm-up.", options: ['sugar', 'size', 'sauce'], sugar: ['yes', 'no'], size: ['small', 'medium', 'large'], sauce: ['yes', 'no'] },
    { name: "frappe", description: "Coffee meets milk and ice in a blender for a rumble-and-tumble togetherness to create one of our most-beloved original Frappuccino® blended beverages.", options: ['sugar', 'size', 'sauce'], sugar: ['yes', 'no'], size: ['small', 'medium', 'large'], sauce: ['yes', 'no'] }
]

router.get('/', async (req, res) => {
try{
    return res.status(201).send({cardDetails})
}catch(err){
    res.status(403).json({message : err.message})
}
})





module.exports = router