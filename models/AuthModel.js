const mongoose = require('mongoose');

const AuthModelSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        min: 6
    },
    password:{
        type:String,
        required:true,
        min:6
    },
    date:{
        type:String,
        default:Date.now
    }
})

module.exports = mongoose.model('AuthModel',AuthModelSchema);