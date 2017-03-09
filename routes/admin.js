var express = require('express');
var router = express.Router();
var pool = require('../lib/database');
var app =  require('../app');

/* GET users listing. */
router.get('/', function(req, res, next) {

    pool.getConnection(function(err,connection){
        if (err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }
        console.log('connected as id ' + connection.threadId);
        connection.query("select * from agency ", function(err, result){
            if (err) {
                console.log(err.message);
            } else {
                console.log('success for adsing livedata ' +JSON.stringify(result));
                res.render('admin', {liveData: result,
                    isAuthenticated: req.isAuthenticated(),
                    user: req.user
                });
            }
        });
    });
});

router.post('/', function(req,res){
    pool.getConnection(function(err,connection){
        if (err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);

        if(req.body.search){
            var  searching = req.body.search;
            connection.query("select * from volunteer where Email or Lname or Fname = ?", searching, function(err, result){
                if (err) {
                    console.log(err.message);
                } else {
                    console.log('searing person: ' +JSON.stringify(result));
                    res.render('admin_search', {profile : result});
                }
            });
        }
        else if(req.body.dump){
            connection.query("select * from volunteer ", function(err, result){
                if (err) {
                    console.log(err.message);
                } else {
                    console.log('dumping: ' +JSON.stringify(result));
                    res.render('admin_search', {profile : result});
                }
            });
        }
    });
    //res.redirect('/admin_search')
});
module.exports = router;