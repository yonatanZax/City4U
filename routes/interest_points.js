
// Imports
var express = require('express');
var router = express.Router();
var DButilsAzure = require('../DButils');
var Enums = require('../Enum');




// Todo - /getInterestPoint - OK
router.get('/getInterestPoints/:pID_list',(req,res,next)=>{
    var params = req.params;
    var pointID = JSON.parse(params.pID_list);

    if (pointID instanceof Array && pointID.length > 0 && pointID.every((x)=> Number.isInteger(x) && x > 0)) {
        p = DButilsAzure.execQuery(`
            SELECT * FROM Points WHERE pID IN (${pointID});
        `);
        p
            .then(result=>{
                if (result.length === 0){
                    res.status(Enums.status_Bad_Request).send(result);
                }
                else{
                    res.status(Enums.status_OK).send(result);
                }

            })
            .catch(error => {
                console.log(error.message);
                res.status(Enums.status_Bad_Request).send(error.message );
            });
    }
    else{
        res.status(Enums.status_Bad_Request).send('Params should be a list of INT bigger than 0');
    }
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
    if (categories instanceof Array && categories.length > 0 && categories.every((x)=> Number.isInteger(x) && x > 0)) {
        console.log(`SELECT pID FROM Categories_Points WHERE (cID in (${categories}));`);
        let p = DButilsAzure.execQuery(`SELECT pID FROM Points WHERE (cID in (${categories}));`);
        p
            .then(result => res.status(Enums.status_OK).send(result))
            .catch(error => res.status(Enums.status_Not_Found).send(error));
    }
    else{
        res.status(Enums.status_Bad_Request).send('Params should be a list of INT bigger than 0');
    }

});






/*      Exports     */
module.exports = router;

