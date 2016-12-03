/**
 * Created by Tony on 12/3/2016.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log(req.body);
    res.render('reg_confirm', {



        }


    );
});

module.exports = router;