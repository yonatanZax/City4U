
// Imports
var express = require('express');
var router = express.Router();
var DButilsAzure = require('../DButils');
var Enums = require('../Enum');




// Todo - /getInterestPoint
router.get('/getInterestPoint',(req,res,next)=>{
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


// Todo - /getThreeRandPopularPoints
router.get('/getThreeRandPopularPoints',(req,res,next)=>{
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



// Todo - /getPointsByCategories
router.get('/getPointsByCategories/', (req,res)=>{
    var categories = req.query.categories;
    categories = JSON.parse(categories);
    console.log(`SELECT pID FROM Categories_Points WHERE (cID in (${categories}));`);
    let p = DButilsAzure.execQuery(`SELECT pID FROM Categories_Points WHERE (cID in (${categories}));`);
    p
        .then(result=>res.status(Enums.status_OK).send(result))
        .catch(error=>res.status(Enums.status_Not_Found).send(error));

    // if (categoris.length > 0){
    //     res.status(Enums.status_OK).send(categoris)
    // }
    // else {
    //     res.status(Enums.status_Bad_Request).send()
    // }
});






/*      Exports     */
module.exports = router;

