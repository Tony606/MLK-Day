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
// if post made to admin page then do this
router.post('/', function(req,res){
    console.log(JSON.stringify(req.body)); // error responce

    pool.getConnection(function(err,connection){
        if (err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        // req is request
        // body has the search string
        // body is jason object
        // search is from ejs file, value of the thing
        console.log('connected as id ' + connection.threadId);
        if(req.body.search){
            var  Email = req.body.Email;
            connection.query("select * from volunteer where Email = ?", Email, function(err, result){
                if (err) {
                    console.log(err.message);
                } else {
                    console.log('success' +JSON.stringify(result));
                    res.render('admin_search', {profile : result});
                }
            });}
        else{

            connection.query("select * from volunteer ", function(err, result){
                if (err) {
                    console.log(err.message);
                } else {
                    console.log('success');
                    res.send(JSON.stringify(result,null,'\t'));
                }
            });
        }
    });
    //res.redirect('/admin_search')
});
module.exports = router;