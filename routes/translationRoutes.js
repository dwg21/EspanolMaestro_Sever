const express = require('express');
const router = express.Router();

const {GetTranslation} = require('../controllers/TranslatorController');


router.route('/')
    .post(GetTranslation)


module.exports = router;
