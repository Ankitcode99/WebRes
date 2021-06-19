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

const schema = Joi.object({
    username:Joi.string().min(6).required(),
    password:Joi.string().min(6).required()
});

router.get('/',(req,res)=>{
    res.send('Working In Progress!!!')
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
    const {error} = schema.validate(req.body);
    if(error) 
        res.status(400).send(error.details[0].message)
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
                const refresh = jwt.sign({_id:user._id,username:user.username},process.env.REFRESH_TOKEN_SECRET)
                res.header('auth-token',token).header('refresh-token',refresh).status(200).json({
                    msg:"LoggedIn Successfully",
                    accesstoken:token,
                    refreshtoken:refresh
                })
                
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

    const {error} = schema.validate(req.body);
    if(error) 
        res.status(400).send(error.details[0].message)
    else{
        let pwd = req.body.password;
        
        const encpwd = await bcrypt.hash(pwd,10);
        const user = new AuthUser({
            username:req.body.username,
            password:encpwd
        })
        
        try{
            const exist = await AuthUser.findOne({ username:req.body.username });
            if(!exist){
                await AuthUser.create(user)
                res.status(201).json({
                    msg:"User Created Successfully"
                })
            }
            else{
                res.status(409).json({
                    msg:"Username Already Taken!"
                });
            }
        }
        catch(err){
            res.status(400).send(err);
        }
    }
})

module.exports = router;