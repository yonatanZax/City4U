
// Imports
var express = require('express');
var router = express.Router();
var DButilsAzure = require('../DButils');
var Enums = require('../Enum');



// Todo - /getCategories - OK
router.get('/getCategories', function(req,res){
    DButilsAzure.execQuery('SELECT * FROM Categories')
        .then(result=> res.status(Enums.status_OK).send(result))
        .catch(error=>res.status(Enums.status_Bad_Request).send(error));
});



// Todo - /getQuestions - OK
router.get('/getQuestions', function(req,res){
    DButilsAzure.execQuery('SELECT * FROM Questions')
        .then(result=> res.status(Enums.status_OK).send(result))
        .catch(error=>res.status(Enums.status_Bad_Request).send(error));
});



function readCountries(){
    var oXHR = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

    oXHR.open("GET", "../countries.xml", true);      // true = ASYNCHRONOUS REQUEST (DESIRABLE), false = SYNCHRONOUS REQUEST.
    oXHR.send();

}











/*      Exports     */
module.exports = router;
