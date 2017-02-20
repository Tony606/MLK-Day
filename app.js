var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var passport = require('passport');
var passportLocal = require('passport-local');
var mysql = require('mysql');

var landing = require('./routes/landing');
var users = require('./routes/users');
var login = require('./routes/login');
var register = require('./routes/register');
var admin = require('./routes/admin');
var checkin = require('./routes/checkin');
var reg_confirm = require('./routes/reg_confirm');
var admin_search = require('./routes/admin_search');


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

var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'mlk_day',
    debug    :  false
});





passport.use(new passportLocal.Strategy(function(username, password, done){
    //database call to find user goes here
    pool.getConnection(function(err,connection){
        if(err) {
            //handle it
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }
        console.log('connected as id ' + connection.threadId);

        connection.query("SELECT * FROM admin WHERE Username = ?", username, function(err, result){
            if (err) {
                console.log(err.message);
            } else {
                console.log('success');
                console.log(result[0].Priv_level);
                if(password == result[0].Password) {
                    done(null, result[0]);
                }
                else{

                    done(null, false,{ message : 'invalid e-mail address or password' } );
                }

            }
        });

    });


}));

passport.serializeUser(function( user,  done){
    done(null, user.Username);
});
passport.deserializeUser(function( username, done){
    //here again we will use the id to call the db and get full user info or access a cached profile
    pool.getConnection(function(err,connection){
        if(err) {
            //handle it
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }
        console.log('connected as id ' + connection.threadId);

        connection.query("SELECT * FROM admin WHERE Username = ?", username, function(err, result){
            if (err) {
                console.log(err.message);
            } else {
                console.log('success');

                done(null, true, result);


            }
        });

    });

});
app.use('/', landing);
app.use('/users', users);
app.use('/login', login);
app.use('/register', register);
app.use('/admin', admin);
app.use('/checkin', checkin);
app.use('/reg_confirm', reg_confirm);
app.use('/admin_search', admin_search);


app.post('/login', passport.authenticate('local'), function(req,res){

    if(req.user.Priv_level == 1) {
        console.log('is super: '+req.user.Priv_level);
        res.redirect('/admin');
    }
    else{
        res.redirect('/checkin');
    }



});

app.post('/register', function(req,res){
    console.log(JSON.stringify(req.body));
    if(!req.body.age){
        req.body.age = 0;
    }
    pool.getConnection(function(err,connection){
        if (err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);
        var  post = req.body;
        connection.query('INSERT INTO volunteer SET ?', post, function(err, result){
            if (err) {
                console.log(err.message);
            } else {
                console.log('success');

            }
        });
    });

    res.redirect('/reg_confirm');

});
app.post('/admin', function(req,res){
    console.log(JSON.stringify(req.body));

    pool.getConnection(function(err,connection){
        if (err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);
        var  post = req.body;
            connection.query("insert into agency set ?" , post, function(err, result){
                if (err) {
                    console.log(err.message);
                } else {
                    console.log('success');

                }
            });

    });
    res.redirect("/admin")
});

app.post('/checkin', function(req,res){
    console.log(JSON.stringify(req.body));

    pool.getConnection(function(err,connection){
        if (err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);

        var  search = req.body.search;
        connection.query("SELECT Fname, Lname, Email, Shirt_Size, Agency_name FROM volunteer WHERE Lname = ?", search, function(err, result){
            if (err) {
                console.log(err.message);
            } else {
                console.log('success');
                console.log(result);

                res.send(JSON.stringify(result,null,'\t'));
            }
        });



    });
    //res.redirect('/admin_search')
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

app.engine('html',require('ejs').renderFile);
module.exports = app;
