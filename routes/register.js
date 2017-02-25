var express = require('express');
var router = express.Router();
var pool = require('../lib/database');

/* GET home page. */
router.get('/', function(req, res, next) {//reg the actual page, get page
    pool.getConnection(function(err,connection){
        if (err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query("select Agency_name, description from agency", function(err, result){
            if (err) {
                console.log(err.message);
            } else {
                console.log('success');
                res.render('register', { title: 'register', agencies: result });//json object with 2 fields

            }
        });
    });

});

router.post('/', function(req,res){
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
        connection.query("INSERT INTO volunteer SET ?", post, function(err, result){
            if (err) {
                console.log(err.message);
            } else {
                console.log('success');

            }
        });
    });

    res.redirect('/reg_confirm');

});

module.exports = router;