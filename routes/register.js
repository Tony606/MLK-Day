var express = require('express');
var router = express.Router();
var pool = require('../lib/database');
/* GET home page. */

// get and request from the page
router.get('/', function(req, res, next) {//reg the actual page, get page
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
                console.log('success');
                // rendaring it first time // agencies have result of the queary upthre
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
        console.log('before insert' + JSON.stringify(post));
        connection.query("INSERT INTO volunteer SET ?", post, function(err, result){
            if (err) {
                console.log(err.message);
            } else {
                console.log('successfully added volunteer data into DB'+ JSON.stringify(post));

                var aID = req.body.Agency_Id;
                console.log('before update' + JSON.stringify(aID));
                connection.query("Update mlk_day.agency Set mlk_day.agency.Num_Of_Registered = mlk_day.agency.Num_Of_Registered +1 where mlk_day.agency.Agency_Id =?",
                    aID, function (err, result) {
                        if (err) {
                            console.log(err.message);
                        } else {
                            console.log('successfully updated num of registered in agency table' + JSON.stringify(aID));
                        }
                    });
            }
        });

    });

    res.redirect('/reg_confirm');

});

module.exports = router;