/**
 * Created by Tony on 9/18/2016.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login', { title: 'login' });
});

module.exports = router;
