/**
 * Created by Tony on 12/3/2016.
 */
var express = require('express');
var pool = require('../lib/database');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('checkin');
});

router.post('/', function(req,res){
    console.log(JSON.stringify(req.body));

    pool.getConnection(function(err,connection){
        if (err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);

        if(req.body.search){
            var  Email = req.body.Email;
            connection.query("select * from volunteer where Email = ?", Email, function(err, result){
                if (err) {
                    console.log(err.message);
                } else {
                    console.log('searing email: ' +JSON.stringify(result));
                    res.render('admin_search', {profile : result});
                }
            });
        }
        else if(req.body.searchLname) {
            var  LName = req.body.lName;
            connection.query("select * from volunteer where lName = ?", LName, function(err, result){
                if (err) {
                    console.log(err.message);
                } else {
                    console.log('searing lastname: ' +JSON.stringify(result));
                    res.render('admin_search', {profile : result});
                }
            });
        }
    });
    //res.redirect('/admin_search')
});
module.exports = router;