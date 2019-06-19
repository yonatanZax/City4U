
// Imports
var express = require('express');
var router = express.Router();
var DButilsAzure = require('../DButils');
var Enums = require('../Enum');


const jwt = require("jsonwebtoken");
let secret = "ImGroot";


//middleware
function authToken(headers, uName){
    const token = headers['authtoken'];
    if(typeof token !== 'undefined'){

        try{
            const decoder = jwt.verify(token, secret);
            if (decoder.name === uName){
                return true;
            }
        }catch (e) {
            return false;
        }

    }

    return false;

};



/*  Post - answerUserQuestion   */
// Todo - /answerUserQuestion - OK
router.post("/answerUserQuestion",(req,res)=>{

    var userName = req.body.uName;
    var question = req.body.question;
    var answer = req.body.answer;


    p = DButilsAzure.execQuery(`
        
        SELECT answer,pass
        FROM Users , Users_Questions
        WHERE Users_Questions.uName = '${userName}' AND Users.uName = '${userName}' AND qID = ${question}`
    );


    p
        .then(result=>{
            if(result.length === 0){
                res.status(Enums.status_OK).send('NotExists');
            }else if(result[0].answer === answer){
                res.status(Enums.status_OK).send({password: result[0].pass});
            }else{
                res.status(Enums.status_OK).send('Incorrect');
            }
        })
        .catch(error => {
            console.log(error.message);
            res.status(Enums.status_Bad_Request).send(error.message );
        });

});



// Todo - /getTwoRelevantPoints - OK
router.get('/getTwoRelevantPoints/:uName',(req,res,next)=>{
    var params = req.params;
    var userName = params.uName;

    p = DButilsAzure.execQuery(`
        SELECT TOP(2) cID 
        From Users_Categories
        WHERE (uName = '${userName}')
        ORDER BY NEWID();
    `);
    p
        .then(result => {
            if(result.length === 2) {
                let query = `
                SELECT TOP(1) pID
                FROM Points
                WHERE (cID = ${result[0].cID})
                ORDER BY pRank asc ;
                
                SELECT TOP(1) pID
                FROM Points
                WHERE (cID = ${result[1].cID})
                ORDER BY pRank asc ;
            `;
                return DButilsAzure.execQuery(query);
            }
            else{
                throw new Error('Bad user name');
            }
        })
        .then(result=>{
            console.log(result);
            res.status(Enums.status_OK).send([result[0].pID,result[1].pID]);
        })
        .catch(error => {
            console.log(error.message);
            res.status(Enums.status_Bad_Request).send(error.message );
        });
});




/*  Get - getUserTwoSavedPoints   */
// Todo - /getUserTwoSavedPoints - OK
router.get('/getUserTwoSavedPoints/:uName', function(req, res, next) {
    var params = req.params;
    var userName = params.uName;

    p = DButilsAzure.execQuery(`
        SELECT TOP(2) pID
        FROM Users_Points
        WHERE uName = '${userName}'
        ORDER BY insertTime
    `);
    p
        .then(result=>{
            if(result.length === 0){
                res.status(Enums.status_OK).send("NoPointsSaved");
            }else if ( result.length === 1){
                res.status(Enums.status_OK).send([result[0].pID]);
            }else if( result.length === 2){
                res.status(Enums.status_OK).send([result[0].pID, result[1].pID]);
            }

            res.status(Enums.status_OK).send(result);
        })
        .catch(error => {
            console.log(error.message);
            res.status(Enums.status_Bad_Request).send(error.message );
        });

});


// Todo - /addPointIDToSavedList  - OK
router.post('/addPointIDToSavedList',(req,res,next)=>{


    var userName = req.body.uName;

    var auth = authToken(req.headers, userName);

    if (!auth){
        res.status(Enums.status_Unauthorized).send('unauthorized' );
        return;
    }


    var pID = req.body.pID;
    console.log(`UserName: ${userName}, pID: ${pID}`);
    p = DButilsAzure.execQuery(`
                                Insert into Users_Points(uName, pID)
                                VALUES('${userName}',${pID});`);
    p
        .then(result=>{
            if( result.length === 0){
                res.status(Enums.status_Created).send("Added");
            }else{
                res.status(Enums.status_Bad_Request).send('NotAdded' );
            }
        })
        .catch(error => {
            console.log(error.message);
            res.status(Enums.status_Bad_Request).send(error.message );
        });
});




/*  Get - getUserAllSavedPoints   */
// Todo - /getUserAllSavedPoints  - OK
router.get('/getUserAllSavedPoints/:uName', function(req, res, next) {
    var params = req.params;
    var userName = params.uName;

    p = DButilsAzure.execQuery(`
            SELECT * 
            FROM Users_Points, Points
            WHERE (Users_Points.uName = '${userName}' and Users_Points.pID = Points.pID)
            ORDER by savePosition;
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



// Todo - /deleteSavedPoint - OK
router.post('/deleteSavedPoint',(req,res,next)=>{

    var userName = req.body.uName;
    var auth = authToken(req.headers, userName);

    if (!auth){
        res.status(Enums.status_Unauthorized).send('unauthorized' );
        return;
    }




    var pID = req.body.pID;
    console.log(`UserName: ${userName}, pID: ${pID}`);
    p = DButilsAzure.execQuery(`
        Delete
        FROM Users_Points 
        WHERE(uName='${userName}' AND pID=${pID});
    `);
    p
        .then(result => DButilsAzure.execQuery(`
            SELECT uName 
            FROM Users_Points 
            WHERE (uName = '${userName}' AND pID = ${pID});
         `))
        .then(result =>{
            if(result.length === 0){
                res.status(Enums.status_OK).send("Deleted");
            }else {
                res.status(Enums.status_Bad_Request).send("NotDeleted");
            }
        })
        .catch(error => {
            console.log(error.message);
            res.status(Enums.status_Bad_Request).send(error.message );
        });
});

function updateRank(pID){
    // TODO - finish me and add me after delete and insert of review
    p = DButilsAzure.execQuery(`
    UPDATE Points
    SET pRank = (
        SELECT AVG(CAST(score AS DECIMAL(10,2)))
        From Reviews
        WHERE (Reviews.pID = ${pID})
        )
    WHERE (Points.pID = ${pID})
    `);
    return p;
}

// Todo - /updateSavedPointOrder
router.post('/updateSavedPointOrder',(req,res,next)=>{

    var userName = req.body.uName;
    var auth = authToken(req.headers, userName);

    if (!auth){
        res.status(Enums.status_Unauthorized).send('unauthorized' );
        return;
    }


    var orderedPoints = req.body.pID;

    let query = '';

    for( let i = 0 ; i < orderedPoints.length ; i++){
        query += `
            UPDATE Users_Points
            set savePosition = ${i+1}
            WHERE (Users_Points.uName = '${userName}' AND Users_Points.pID = ${orderedPoints[i]});        
        `;
    }
    console.log(query);


    DButilsAzure.execQuery( query )
        .then(result=>{
            if ( result.length === 0 ){
                res.status(Enums.status_OK).send("Updated");
            }else{
                res.status(Enums.status_OK).send("NotUpdated");
            }

        })
        .catch(error => {
            console.log(error.message);
            res.status(Enums.status_Bad_Request).send(error.message );
        });
});



// Todo - /getPointsByName - OK
router.get('/getPointsByName/:pName',(req,res,next)=>{
    var params = req.params;
    var pName = params.pName;

    p = DButilsAzure.execQuery(`
        SELECT *
        FROM Points
        WHERE (pName LIKE '%${pName}%');
    
    `);
    p
        .then(result=>{
            res.status(Enums.status_OK).send(result);
        })
        .catch(error => {
            console.log(error.message);
            res.status(Enums.status_Bad_Request).send(error.message);
        });
});


// Todo - /addReviewPoint - OK
router.post('/addReviewPoint',(req,res,next)=>{

    var userName = req.body.uName;
    var auth = authToken(req.headers, userName);

    if (!auth){
        res.status(Enums.status_Unauthorized).send('unauthorized' );
        return;
    }


    var pID = req.body.pID;
    var content = req.body.content;
    var score = req.body.score;


    console.log(`UserName: ${userName}, pID: ${pID}, content: ${content}, score: ${score}`);
    p = DButilsAzure.execQuery(`
        Insert INTO Reviews
        (uName, pID, content, score)
        VALUES
             ('${userName}', ${pID}, '${content}', ${score});`
        );
    p
        .then(result=> updateRank(pID))
        .then(result=> res.status(Enums.status_Created).send(result))
        .catch(error => {
            console.log(error.message);
            res.status(Enums.status_Bad_Request).send(error );
        });
});



// Todo - /verify token - OK
router.post('/verifyToken',(req,res)=>{

    var userName = req.body.uName;
    var auth = authToken(req.headers, userName);

    if (!auth){
        res.status(Enums.status_Unauthorized).send('unauthorized' );
    }else {
        res.status(Enums.status_OK).send('authorized' );
    }

});







/*      Exports     */
module.exports = router;



