const express = require('express');
const router = express.Router();
const {authenticateUser} = require('../middleware/authentication')

const {
    getSingleUserData,
    updateUserData
} = require('../controllers/userDataController');


router.route('/')
    .get(authenticateUser, getSingleUserData)
    .post(authenticateUser, updateUserData)


module.exports = router;
