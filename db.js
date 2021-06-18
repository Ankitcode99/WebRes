const mongoose = require('mongoose');

const connect = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify:false
        })

        console.log(`DB Connection established successfully - ${conn.connection.host}`);
    }
    catch{
        console.error(err)
        process.exit(1)
    }
}

module.exports = connect;