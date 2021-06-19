const jwt = require('jsonwebtoken')
module.exports = {
    ensureGuest: function(req,res,next){
        const token = req.header('auth-token');
        if(!token){
            next()
        }
        else{
            res.send("You Can't access login dude!")
        }
    },
    ensureAuth: function(req,res,next){
        const token = req.header('auth-token');
        if(!token){
            res.status(401).send("We don't know you")
        }

        try{
            const verified = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
            req.user = verified
            next()
        }catch(err){
            res.status(403).send("We know you but you're missing something")
        }
    }
}