require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const {default : helmet} = require('helmet');
const conpression = require('compression');
const app = express();

//init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(conpression());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//init db
require('./dbs/init.mongodb');

const {checkOverload} = require('./helpers/check.connect');
// checkOverload();
//init routes
app.use('', require('./routers'))

//handling error
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;

    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Something went wrong!'
    });
});

module.exports = app;