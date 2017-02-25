/**
 * Created by Tony on 9/18/2016.
 */
var app = require('../app');
var express = require('express');
var router = express.Router();
var passport = require('../lib/passport');



/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login', { title: 'login' });
});

router.post('/', passport.authenticate('local'), function(req,res){

    if(req.user.Priv_level == 1) {
        console.log('is super: '+req.user.Priv_level);
        res.redirect('/admin');
    }
    else{
        res.redirect('/checkin');
    }

});
module.exports = router;