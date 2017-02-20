var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('admin', {
        isAuthenticated: req.isAuthenticated(),
        user: req.user

    });
});

module.exports = router;



