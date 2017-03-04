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

router.post('/', function(req,res){
    console.log(JSON.stringify(req.body));
    pool.getConnection(function(err,connection){
        if (err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);
        if(req.body) { //req is the request (what is typed into page. body is a json object, search is what everything
            //gets saved to when you type in the box. search is the variable from the ejs page
            var post = req.body;
            connection.query("INSERT INTO agency SET ?", post, function (err, result) {
                if (err) {
                    console.log(err.message);
                } else {
                    console.log('success' +JSON.stringify(result));

                }
            });
        }
        });
    res.redirect('/agency_update');

});

module.exports = router;