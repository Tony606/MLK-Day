/**
 * Created by Tony on 2/23/2017.
 */
var app = require('../app');
var passport = require('passport');
var passportLocal = require('passport-local');
var pool = require('./database');



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

module.exports = passport;