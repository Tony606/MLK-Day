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
            connection.query("Select Fname, Lname, Email, Phone_Num, Shirt_Size, Agency_Name, School_Name, Age, Drive, Status, Is_Checkedin" +
                " from mlk_day.volunteer JOIN mlk_day.agency" +
                " where Email or Lname or Fname = ?", searching, function(err, result){
                if (err) {
                    console.log(err.message);
                } else {
                    console.log('searing person: ' +JSON.stringify(result));
                    res.render('admin_search', {profile : result});
                }
            });
        }
        else if(req.body.dump){
            connection.query("Select Fname, Lname, Email, Phone_Num, Shirt_Size, Agency_Name, School_Name, Age, Drive, Status, Is_Checkedin" +
                             " from mlk_day.volunteer JOIN mlk_day.agency" +
                             " Where mlk_day.volunteer.Agency_Id = mlk_day.agency.Agency_Id; ", function(err, result){
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