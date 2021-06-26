const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const {ensureAuth,ensureGuest} = require('../middlewares/auth');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const AuthUser = require('../models/AuthModel')
const Joi = require('@hapi/joi');
const AuthModel = require('../models/AuthModel');

const users=[{username:"AnkitCode99",age:21},{username:"HKool1",age:19},{username:"VatsalKul",age:21}];

const SignUpSchema = Joi.object({
    email:Joi.string().required(),
    username:Joi.string().min(6).required(),
    password:Joi.string().min(6).required()
});

const LoginSchema = Joi.object({
   username:Joi.string().min(6).required(),
    password:Joi.string().min(6).required()
});

router.get('/',(req,res)=>{
    res.render('register')
});
/***
 * @swagger
 * /test:
 *  get:
 *      description: Checking swagger
 *      parameters:
 *        - in: header
 *          name: auth-token
 *          schema:
 *              type: string
 *          required: true
 *      responses:
 *          200:
 *              description: OK
 *          500:
 *              description: Internal Server Error
 * 
 */
router.get('/test',ensureAuth,(req,res)=>{
    res.json(users);
})

/**
 * @swagger
 * /login:
 *  post:
 *      consumes: application/json
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object               
 *                      properties:
 *                          username:
 *                              type: string
 *                              default: TestUser
 *                          password:
 *                              type: string
 *                              default: TestPassword
 *      responses:
 *          200: 
 *              description: Success
 *          401:
 *              description: Unauthorized
 */
router.post('/login',ensureGuest,async (req,res)=>{
    const {error} = LoginSchema.validate(req.body);
    if(error) 
        res.status(400).json({
            msg:error.details[0].message
        })
    else{
        const user = await AuthUser.findOne({username:req.body.username});
        if(!user){
            res.status(401).json({
                msg:"Username doesn't exist"
            })
        }
        else{
            const validPass = await bcrypt.compare(req.body.password,user.password);
            if(validPass){

                const token = jwt.sign({_id:user._id,username:user.username},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'3600s'})
                const refresh = jwt.sign({_id:user._id,username:user.username},process.env.REFRESH_TOKEN_SECRET,{expiresIn:'1y'})
                res.status(200).redirect('/user/dashboard')
                
            }
            else{
                res.status(401).json({
                    msg:"Invalid Credentials"
                })
            }
        }
    }
})

/**
 * @swagger
 * /signup:
 *  post:
 *      consumes: application/json
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object               
 *                      properties:
 *                          email:
 *                              type: string
 *                              default: string
 *                          username:
 *                              type: string
 *                              default: TestUser
 *                          password:
 *                              type: string
 *                              default: TestPassword
 *      responses:
 *          201: 
 *              description: OK Created
 *          400:
 *              decription: Bad Request
 *          409:
 *              description: Username already exist in database
 */
router.post('/signup',ensureGuest,async (req,res)=>{
    const {error} = SignUpSchema.validate(req.body);
    if(error) 
        res.status(400).json({
            msg:error.details[0].message
        })
    else{
        let pwd = req.body.password;
        
        const encpwd = await bcrypt.hash(pwd,10);
        const user = new AuthUser({
            email:req.body.email,
            username:req.body.username,
            password:encpwd
        })
        
        try{
            const exist = await AuthUser.findOne({ username:req.body.username });
            if(!exist){
                await AuthUser.create(user)
                const token = jwt.sign({_id:user._id,username:user.username},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'3600s'})
                const refresh = jwt.sign({_id:user._id,username:user.username},process.env.REFRESH_TOKEN_SECRET,{expiresIn:'1y'})
                res.status(201).redirect('/user/dashboard')
            }
            else{
                res.status(409).redirect('/')
            }
        }
        catch(err){
            res.status(400).redirect('/')
        }
    }
})

module.exports = router;