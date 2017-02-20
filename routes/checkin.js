/**
 * Created by Tony on 12/3/2016.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('checkin');
    for (var i = 0; i < rows.length; i++) {
        console.log(rows[i].name);
    };
});

module.exports = router;