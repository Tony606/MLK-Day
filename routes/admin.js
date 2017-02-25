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
            connection.query("select * from volunteer where email = ?", Email, function(err, result){
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