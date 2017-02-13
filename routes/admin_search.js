/**
 * Created by Tony on 12/16/2016.
 */
var express = require('express');
var router = express.Router();
var app =  require('../app')

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('admin_search',{
        profile: app.search
    })
});

module.exports = router;