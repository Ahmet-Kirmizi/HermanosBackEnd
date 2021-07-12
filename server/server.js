require('dotenv').config()
const express = require('express')
const app = express() // created express object
const mongoose = require('mongoose')
const port = 3000; // port to listen
const cors = require('cors');
const bodyParser = require('body-parser');


mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true ,useUnifiedTopology: true })
const database = mongoose.connection
database.on('error', (error) => console.error(error))
database.once('open', () => console.log('connected to database')) //once connected

app.use(bodyParser.json());
app.use(cors());
app.use(express.json()) // parsing application
app.use(express.urlencoded({ extended: true }));

const getSignUpDetails = require('../routes/getSignUpDetails')
app.use('/getSignUpDetails', getSignUpDetails)

app.listen(port, () =>{
console.log("Server is Running")
})