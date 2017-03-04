var express = require('express');
var router = express.Router();
var pool = require('../lib/database');
/* GET home page. */

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('agency_update', {
        isAuthenticated: req.isAuthenticated(),
        user: req.user
    });
});

// get and request from the page
router.get('/', function(req, res, next) {//reg the actual page, get page
    pool.getConnection(function(err,connection){
        if (err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query("select Agency_name, Agency_ID, description from agency", function(err, result){
            if (err) {
                console.log(err.message);
            } else {
                console.log('success');
                // rendaring it first time // agencies have result of the queary upthre
                res.render('register', { title: 'register', agencies: result });//json object with 2 fields
            }
        });
    });

});

router.post('/', function(req,res){
    console.log(JSON.stringify(req.body));

    pool.getConnection(function(err,connection){
        if (err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query("INSERT INTO agency SET ?", post, function(err, result){
            if (err) {
                console.log(err.message);
            } else {
                console.log('success');

            }
        });
    });

    //res.redirect('/admin');

});

module.exports = router;