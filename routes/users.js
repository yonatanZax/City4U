
// Imports
var express = require('express');
var router = express.Router();
var DButilsAzure = require('../DButils');
var Enums = require('../Enum');








/*  Post - authUser   */
// Todo - /authUser - need change userName to text
router.post("/authUser",(req,res)=>{

    var id = 1 | req.body.id;
    var userName = req.body.uName;
    var password = req.body.password;

    p = DButilsAzure.execQuery(`
        SELECT uName 
        FROM Users 
        WHERE uName = ${userName} AND CONVERT(VARCHAR, pass) = '${password}'
        `);
    p
        .then(result=>{
            if(result.length > 0){
                payload = { id: id, name: userName, pass: password};
                options = { expiresIn: "1d" };
                const token = jwt.sign(payload, secret, options);
                res.status(Enums.status_OK).send(token);
        }else{
                res.status(Enums.status_Bad_Request).send('Invalid' );
        }
        })
        .catch(error => {
            console.log(error.message);
            res.status(Enums.status_Bad_Request).send(error.message );
        });


});





/*  Post - addNewUser   */
// Todo - /addNewUser - need change userName to text, addInterestList
router.post("/addNewUser",(req,res)=>{

    var userName = req.body.uName;
    var password = req.body.password;
    var fName = req.body.fName;
    var lName = req.body.lName;
    var city = req.body.city;
    var country = req.body.country;
    var email = req.body.email;
    // var interestList = req.body.lName;
    // var qna = req.body.qANDa;
    var question = req.body.question;
    var answer = req.body.answer;



    pAuth = DButilsAzure.execQuery(`
    SET IDENTITY_INSERT Users ON
    Insert into Users
        (uName,pass,fName,lName,city,country,email,question,answer)
    VALUES
        (${userName},'${password}','${fName}','${lName}','${city}','${country}','${email}',${question},'${answer}')
    `);

    pAuth
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            res.status(Enums.status_Bad_Request).send(error.message );
        })


});


/*  Get - getUserQuestion   */
// Todo - /getUserQuestion - need change userName to text
router.get('/getUserQuestion/:uName', function(req, res, next) {
  var params = req.params;
  var userName = params.uName;

    p = DButilsAzure.execQuery(`SELECT question FROM Users WHERE uName = ${userName}`);
    p
        .then(result=>{
            if(result.length > 0){

                res.status(Enums.status_OK).send(result);
            }else{
    res.status(Enums.status_Bad_Request).send('NotExists');
  }
        })
        .catch(error => {
            console.log(error.message);
            res.status(Enums.status_Bad_Request).send(error.message );
        });


});



/*  Post - answerUserQuestion   */
// Todo - /answerUserQuestion - need change userName to text
router.post("/answerUserQuestion",(req,res)=>{

    var userName = req.body.uName;
    var question = req.body.question;
    var answer = req.body.answer;


    p = DButilsAzure.execQuery(`SELECT answer FROM Users WHERE uName = ${userName} AND question = ${question}`);
    p
        .then(result=>{
            if(result.length === 0){
                res.status(Enums.status_Bad_Request).send('NotExists');
            }else if(result[0].answer === answer){
      res.status(Enums.status_OK).send('Correct');
    }else{
                res.status(Enums.status_OK).send('Incorrect');
    }
        })
        .catch(error => {
            console.log(error.message);
            res.status(Enums.status_Bad_Request).send(error.message );
        });




});



// Todo - /getTwoRelevantPoints
router.get('/getTwoRelevantPoints',(req,res,next)=>{
    var userName = req.query.uName;
    p = DButilsAzure.execQuery(`
    
    `);
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









/*  Get - getUserTwoSavedPoints   */
// Todo - /getUserTwoSavedPoints - need change userName to text
router.get('/getUserTwoSavedPoints/:uName', function(req, res, next) {
    var params = req.params;
    var userName = params.uName;

    p = DButilsAzure.execQuery(`
        SELECT TOP(2) pID
        FROM Users_Points
        WHERE uName = ${userName}
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






// Todo - /addPointIDToSavedList  - need change userName to text
router.post('/addPointIDToSavedList',(req,res,next)=>{
    var userName = req.query.uName;
    var pID = req.query.pID;
    console.log(`UserName: ${userName}, pID: ${pID}`);
    p = DButilsAzure.execQuery(`Insert into Users_Points VALUES(${userName},${pID});`);
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




/*  Get - getUserAllSavedPoints   */
// Todo - /getUserAllSavedPoints  - need change userName to text
router.get('/getUserAllSavedPoints/:uName', function(req, res, next) {
    var params = req.params;
    var userName = params.uName;

    p = DButilsAzure.execQuery(`
        SELECT pID FROM Users_Points WHERE uName = ${userName}
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





// Todo - /deleteSavedPoint - need change userName to text
router.delete('/deleteSavedPoint',(req,res,next)=>{
    var userName = req.query.uName;
    var pID = req.query.pID;
    console.log(`UserName: ${userName}, pID: ${pID}`);
    p = DButilsAzure.execQuery(`
        Delete
        FROM Users_Points 
        WHERE(uName=${userName} AND pID=${pID});
    `);
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



// Todo - /updateSavedPointOrder
router.put('/updateSavedPointOrder',(req,res,next)=>{
    var userName = req.query.uName;
    var orderedPoints = req.query.pID;



    console.log(`UserName: ${userName}, pID: ${pID}`);
    p = DButilsAzure.execQuery(`
        Insert INTO Reviews
        VALUES
             (${userName},${orderedPoints})`
    );
    p
        .then(result=>{
            res.status(Enums.status_OK).send(result);
        })
        .catch(error => {
            console.log(error.message);
            res.status(Enums.status_Bad_Request).send(error.message );
        });
});





// Todo - /addReviewPoint
router.post('/addReviewPoint',(req,res,next)=>{
    var userName = req.query.uName;
    var pID = req.query.pID;
    var content = req.query.content;
    var score = req.query.score;


    console.log(`UserName: ${userName}, pID: ${pID}`);
    p = DButilsAzure.execQuery(`
        Insert INTO Reviews
        VALUES
             (${userName},${pID},'${content}',${score})`
        );
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



