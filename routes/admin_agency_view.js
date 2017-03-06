
var express = require('express');
var router = express.Router();
var app =  require('../app');

/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log('admin Agency get');
    res.render('admin_agency_view',{})
});

module.exports = router;