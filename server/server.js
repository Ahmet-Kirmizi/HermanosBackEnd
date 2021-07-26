require('dotenv').config()
const express = require('express')
const app = express() // created express object
const mongoose = require('mongoose')
const port = 3000; // port to listen
const cors = require('cors');
const bodyParser = require('body-parser');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const database = mongoose.connection
database.on('error', (error) => console.error(error))
database.once('open', () => console.log('connected to database')) //once connected

app.use(bodyParser.json());
app.use(cors());
app.use(express.json()) // parsing application
app.use(express.urlencoded({ extended: true }));

const getSignUpDetails = require('../routes/getSignUpDetails')
const signIn = require('../routes/singIn')
const account = require('../routes/account')
const paymentMethod = require('../routes/paymentMethod')
const menu = require('../routes/menu')

app.use('/menu', menu)
app.use('/paymentMethod', paymentMethod)
app.use('/getSignUpDetails', getSignUpDetails)
app.use('/signIn', signIn)
app.use('/account', account)
app.listen(port, () => {
    console.log("Server is Running")
})