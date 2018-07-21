const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


//CONNECT TO THE DATABASE
mongoose.set('debug', true); //permet d'avoir le détail des opérations directement dans la console
mongoose.Promise = global.Promise;


// LOGGING REQUESTS IN THE TERMINAL
app.use(morgan('dev'))


// EXTRACTING JSON DATA
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// CORS HANDLING
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // la requête peut venir de n'impporte quelle url
    res.header( 
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-type, Accept, Authorization "
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE');
        return res.status(200).json({})
    };
    next();
})


// SETTING ROUTES FROM SEVER TO THE API
const categoriesRoutes = require('./api/routes/categoriesRoutes')
const logsRoutes = require('./api/routes/logsRoutes')
const usersRoutes = require('./api/routes/usersRoutes')

app.use('/categories', categoriesRoutes);
app.use('/logs', logsRoutes);
app.use('/user', usersRoutes);


// HANDLING ERRORS
app.use((req, res, next) => {
    error = new Error ('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status (error.status || 500);
    res.json({
        error : {
            message: error.message
        }
    })
})

module.exports = app