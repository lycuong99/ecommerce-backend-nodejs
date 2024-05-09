const express = require('express');
const morgan = require('morgan');
const {default : helmet} = require('helmet');
const conpression = require('compression');
const app = express();

//init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(conpression());

//init db
requrie('./dbs/init.mongodb');
//init routes
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to WSV ecommerce API'
    });
});

//handling error

module.exports = app;