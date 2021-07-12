const express = require('express');
const router = express.Router();
const userDetails = require('../models/userDetails')
const bcrypt = require('bcrypt');
const mongoose = require('mongoose')
const { body, validationResult } = require('express-validator');

