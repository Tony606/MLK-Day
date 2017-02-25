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

        var  search = req.body.search;
        connection.query("select Fname, Lname, email, Agency_id, Shirt_size from volunteer where email = ?", search, function(err, result){
            if (err) {
                console.log(err.message);
            } else {
                console.log('success');
                res.send(JSON.stringify(result,null,'\t'));
            }
        });



    });
    //res.redirect('/admin_search')
});
module.exports = router;