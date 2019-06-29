
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
        .catch(error=> res.status(Enums.status_Bad_Request).send(error));
});



function readCountries(){

    var convert = require('xml-js');
    var xml = require('fs').readFileSync('countries.xml', 'utf8');
    var options = {ignoreComment: true, alwaysChildren: true};
    var result = convert.xml2js(xml, options); // or convert.xml2json(xml, options)
    let list = result.elements[0].elements;

    var country_list = [];

    for ( let i = 0 ; i < list.length ; i++){
        let countryName = list[i].elements[1].elements[0].text;
        country_list.push(countryName);
    }

    console.log("Done reading countries.xml");
    return country_list;

}

country_list = readCountries();




// Todo - /getCountries - OK
router.get('/getCountries', function(req,res){
    res.status(Enums.status_OK).send(country_list);
});





/*      Exports     */
module.exports.router = router;
module.exports.countries = country_list;
