var express = require('express');
var router = express.Router();
var pool = require('../lib/database');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('admin', {
        isAuthenticated: req.isAuthenticated(),
        user: req.user
    });
});

router.post('/', function(req,res){ //this is the searh route. it will follow this route
    console.log(JSON.stringify(req.body));

    pool.getConnection(function(err,connection){
        if (err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);
        if(req.body.search){ //req is the request (what is typed into page. body is a json object, search is what everything
            //gets saved to when you type in the box. search is the variable from the ejs page
            var  Email = req.body.Email; //saving the guys email into the Email var
            connection.query("select * from volunteer where Email = ?", Email, function(err, result){
                if (err) {
                    console.log(err.message);
                } else {
                    console.log('success' +JSON.stringify(result));
                    res.render('admin_search', {profile : result}); //renders a page- doing admin_search. //pass whatever you want passed to the page
                }
            });}
        else{

            connection.query("select * from volunteer ", function(err, result){
                if (err) {
                    console.log(err.message);
                } else {
                    console.log('success');
                    res.send(JSON.stringify(result,null,'\t')); //res is response from backend to browswer
                }
            });
        }
    });
    //res.redirect('/admin_search')
});
module.exports = router;