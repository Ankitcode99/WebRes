const dotenv = require('dotenv')
dotenv.config({path:'./config/config.env'})
const express = require('express');
const helmet = require('helmet');
const { version } = require('mongoose');
const swaggerJsDocs = require('swagger-jsdoc');
const swaggerUI  =require('swagger-ui-express');
const PORT = process.env.PORT || 5000;
const connect = require('./db')
const bp = require('body-parser')
const path = require('path')
const app = express();
connect();

app.set("view engine","ejs");
app.use(bp.urlencoded({extended:false}));
app.use(bp.json());

app.use(express.static(path.join(__dirname,'public')))

const swaggerOptions = {
    swaggerDefinition:{
        openapi: "3.0.0",
        info:{
            title:'API For Everyone',
            version:'1.0.0'
        },
    },
    customCss: '.swagger-ui .topbar { display: none }',
    apis:['./routes/*.js']
}

const swaggerDocs = swaggerJsDocs(swaggerOptions);

app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocs));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(helmet());

app.use('/',require('./routes/auth'));
app.use('/user',require('./routes/user'));

app.listen(PORT,()=>console.log(`Server started on PORT=${PORT}`));