
// Imports
var express = require('express');
var router = express.Router();
var DButilsAzure = require('../DButils');




// Todo - /getInterestPoint
router.get('/getInterestPoint',(req,res,next)=>{
    p = DButilsAzure.execQuery('');
    p
        .then(result=>{
            console.log(result);
            res.status(status_OK).send(result);
        })
        .catch(error => {
            console.log(error.message);
            res.status(status_Bad_Request).send(error.message );
        });
});


// Todo - /getThreeRandPopularPoints
router.get('/getThreeRandPopularPoints',(req,res,next)=>{
    p = DButilsAzure.execQuery('');
    p
        .then(result=>{
            console.log(result);
            res.status(status_OK).send(result);
        })
        .catch(error => {
            console.log(error.message);
            res.status(status_Bad_Request).send(error.message );
        });
});



// Todo - /getPointsByCategories
router.get('/getPointsByCategories/', (req,res)=>{
    var params = req.params.categories;
    var categoris = {};
    for (var i = 0; i < params.length; i++){
        if(category_db.hasOwnProperty(params[i])){
            categoris[params[i]] = category_db[params[i]];
        }
    }
    if (categoris.length > 0){
        res.status(status_OK).send(categoris)
    }
    else {
        res.status(status_Bad_Request).send()
    }
});






/*      Exports     */
module.exports = router;

