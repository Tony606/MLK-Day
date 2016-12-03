var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var passport = require('passport');
var passportLocal = require('passport-local');

var landing = require('./routes/landing');
var users = require('./routes/users');
var login = require('./routes/login');
var register = require('./routes/register');
var admin = require('./routes/admin');
var checkin = require('./routes/checkin');
var reg_confirm = require('./routes/reg_confirm');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');




// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

passport.use(new passportLocal.Strategy(function(username, password, done){
    //database call to find user goes here
    if(username=='test' && password == 'password'){
        done(null,{id: 1, email: 'someone@umich.edu', isSuper: 0})
    }
}));

passport.serializeUser(function( user,  done){
    done(null, user.id);
});
passport.deserializeUser(function( id, done){
    //here again we will use the id to call the db and get full user info or access a cached profile
    done(null, {id: 1, email: 'someone@umich.edu', isSuper: 0})
});
app.use('/', landing);
app.use('/users', users);
app.use('/login', login);
app.use('/register', register);
app.use('/admin', admin);
app.use('/checkin', checkin);
app.use('/reg_confirm', reg_confirm);


app.post('/login', passport.authenticate('local'), function(req,res){
    if(req.user.isSuper === 1) {
        console.log('is super: '+req.user.isSuper);
        res.redirect('/admin');
    }
    else{
        res.redirect('/checkin');
    }

});

app.post('/register', function(req,res){
    console.log(JSON.stringify(req.body));
    res.redirect('/reg_confirm')
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
