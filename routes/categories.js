
// Imports
var express = require('express');
var router = express.Router();
var DButilsAzure = require('../DButils');
var Enums = require('../Enum');



// Todo - /getCategories
router.get('/getCategories', function(req,res){
    console.log('debug');
    DButilsAzure.execQuery('SELECT * FROM Categories')
        .then(result=> res.status(Enums.status_OK).send(result))
        .catch(error=>res.status(Enums.status_Bad_Request).send(error));
});





// Todo - /getCategoriesByName
router.get('/getCategoriesByName',(req,res,next)=>{
    p = DButilsAzure.execQuery('');
    p
        .then(result=>{
            console.log(result);
            res.status(Enums.status_OK).send(result);
        })
        .catch(error => {
            console.log(error.message);
            res.status(Enums.status_Bad_Request).send(error.message );
        });
});



/*      Exports     */
module.exports = router;
