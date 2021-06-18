module.exports = {
    ensureGuest: function(req,res,next){
        next();
    },
    ensureAuth: function(req,res,next){
        next();
    }
}