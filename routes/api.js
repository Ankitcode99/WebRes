const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const {ensureAuth,ensureGuest} = require('../middlewares/auth');

router.get('/',(req,res)=>{
    res.send("WebRes is Up!")
})

module.exports = router;