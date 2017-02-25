/**
 * Created by Tony on 12/16/2016.
 */
var express = require('express');
var router = express.Router();
var app =  require('../app')

/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log('admin search get');
    res.render('admin_search',{})
});

module.exports = router;