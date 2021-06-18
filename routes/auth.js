const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const {ensureAuth,ensureGuest} = require('../middlewares/auth');
const bcrypt = require('bcrypt')

const users = [{username:"AnkitCode99",password:"21"},{username:"HKool01",password:"19"},
{username:"VatsalKul",password:"21"}]

router.get('/',(req,res)=>{
    res.send('Working In Progress!!!')
});
/***
 * @swagger
 * /test:
 *  get:
 *      description: Checking swagger
 *      responses:
 *          200:
 *              description: OK
 *          500:
 *              description: Internal Server Error
 * 
 */
router.get('/test',(req,res)=>{
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
router.post('/login',async (req,res)=>{
    for(let i=0;i<users.length;i++)
    {
        if(users[i].username==req.body.username)
        {
            let pwd = req.body.password;
            try{
                if(await bcrypt.compare(pwd,users[i].password)){
                    res.status(200).json({
                        msg:"Login Successful"
                    })
                }
                else{
                    res.status(401).json({
                        msg:"Invalid Credentials"
                    })
                }    
            }
            catch(err){
                console.error(err)
            }
        }
    }
    res.status(401).json({
        msg:"Username does not exist"
    });
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
 *              description: Created
 *          409:
 *              description: Username already exist in database
 */
router.post('/signup',async (req,res)=>{
    let uname = req.body.username;
    let pwd = req.body.password;
    
    const salt = await bcrypt.genSalt(10)
    const encpwd = await bcrypt.hash(pwd,salt);
    console.log(encpwd);
    const nuser = {username:uname,password:encpwd};

    let f=0
    for(let i=0;i<users.length;i++)
    {
        if(users[i].username === uname)
        {
            f=1;
        }
    }
    if(f==0)
    {
        users.push(nuser);
        res.status(201).json({
            msg:"User Created Successfully"
        });    
    }
    else{
        res.status(409).json({
            msg:"Username Taken!"
        }); 
    }
})

module.exports = router;