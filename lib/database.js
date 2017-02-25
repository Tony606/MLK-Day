/**
 * Created by Tony on 2/23/2017.
 */

var mysql     =    require('mysql');

var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'mlk_day',
    debug    :  false
});

module.exports = pool; //when you require this file in another file, it can use the variable pool in other files