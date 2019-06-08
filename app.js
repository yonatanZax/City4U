var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var DButilsAzure = require('./DButils');
var Enums = require('./Enum');
const jwt = require("jsonwebtoken");



// ***  Secret for the Token    ***
// Useful site:     https://jwt.io/
const secret = "ImGroot";


// ***  Routers     ***

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categoriesRouter = require('./routes/categories');
var interestPointsRouter = require('./routes/interest_points');
var dbSqlRouter = require('./routes/db_sql');



var app = express();

// This is a middleware that will fix your issue for any request
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth-token");
    next();
});

// run server
const port = process.env.PORT || 3000; //environment variable
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




//middleware
app.use('/users', (req, res, next)=>{
    const bearerHeader = req.headers['x-auth-token'];
    if(typeof bearerHeader !== 'undefined'){
        req.token = bearerHeader.split(' ')[0];

        jwt.verify(req.token,secret,(err, authData)=>{
            if(err){
                res.status(Enums.status_Forbidden).json({location: "TokenVerify", message: err.message});
            }
            else{
                req.userName = authData['username'];
                next();
            }
        });
    }
    else{
        res.status(Enums.status_Bad_Request).send( "Auth: Un Authorized Token.");
    }
});


// ***  Routers use    ***

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/interest_points', interestPointsRouter);
app.use('/categories', categoriesRouter.router);
app.use('/db', dbSqlRouter);





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
module.exports = {DButilsAzure : DButilsAzure};




// *********   Lab Example  ******************

app.get('/select', function(req, res){
    DButilsAzure.execQuery("SELECT * FROM users")
        .then(function(result){
            res.send(result)
        })
        .catch(function(err){
            console.log(err);
            res.send(err);
        })
});



