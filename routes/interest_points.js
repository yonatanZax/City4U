
// Imports
var express = require('express');
var router = express.Router();
var DButilsAzure = require('../DButils');
var Enums = require('../Enum');




// Todo - /getInterestPoint - OK
router.get('/getInterestPoint/:pID',(req,res,next)=>{
    var params = req.params;
    var pointID = params.pID;

    p = DButilsAzure.execQuery(`
        SELECT * FROM Points WHERE pID = ${pointID}
    `);
    p
        .then(result=>{
            if (result.length === 0){
                res.status(Enums.status_OK).send(result);
            }
            res.status(Enums.status_OK).send(result);
        })
        .catch(error => {
            console.log(error.message);
            res.status(Enums.status_Bad_Request).send(error.message );
        });
});


// Todo - /getThreeRandPopularPoints - OK
router.get('/getThreeRandPopularPoints',(req,res,next)=>{
    p = DButilsAzure.execQuery(`
        SELECT TOP(3) pID
        FROM Points
        ORDER BY NEWID()
    `);
    p
        .then(result=>{
            res.status(Enums.status_OK).send(result);
        })
        .catch(error => {
            console.log(error.message);
            res.status(Enums.status_Bad_Request).send(error.message );
        });
});



// Todo - /getPointsByCategories
router.get('/getPointsByCategories/:categories', (req,res)=>{
    var categories = req.params.categories;
    categories = JSON.parse(categories);
    console.log(`SELECT pID FROM Categories_Points WHERE (cID in (${categories}));`);
    let p = DButilsAzure.execQuery(`SELECT pID FROM Points WHERE (cID in (${categories}));`);
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



// Todo - /getPointsByName - OK
router.get('/getPointsByName/:pName',(req,res,next)=>{
    var params = req.params;
    var pName = params.pName;

    p = DButilsAzure.execQuery(`
        SELECT pID
        FROM Points
        WHERE (pName LIKE '%${pName}%');
    
    `);
    p
        .then(result=>{
            res.status(Enums.status_OK).send(result);
        })
        .catch(error => {
            console.log(error.message);
            res.status(Enums.status_Bad_Request).send(error.message );
        });
});


/*      Exports     */
module.exports = router;

