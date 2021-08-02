const express = require("express");
const router = express.Router();
require("dotenv").config();
const tokenAuth = require("../middlewares/tokenAuth");
const userDetails = require('../models/userDetails')
const sendToken = require('../middlewares/sendToken')
const stripe_secret_key = process.env.STRIPE_SECRET_KEY;
const stripe_public_key = process.env.STRIPE_PUBLIC_KEY;





module.exports = router;