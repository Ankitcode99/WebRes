const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const {ensureAuth,ensureGuest} = require('../middlewares/auth');

router.get('/dashboard',(req,res)=>{
    res.render("dashboard")
})

module.exports = router;