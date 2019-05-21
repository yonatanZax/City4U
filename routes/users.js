
// Imports
var express = require('express');
var router = express.Router();
var DButilsAzure = require('../DButils');
var Enums = require('../Enum');








/*  Post - authUser   */
// Todo - /authUser
router.post("/authUser",(req,res)=>{

    var userName = req.body.uName;
    var password = req.body.password;

    if(user_db[userName] != null){
        if (user_db[userName].password === password){
            res.status(Enums.status_OK).send('Valid');
        }else{
            res.status(Enums.status_Bad_Request).send('WrongPass')
        }
    }else{
        res.status(Enums.status_Bad_Request).send('NotExists')
    }



});


/*  Post - addNewUser   */
// Todo - /addNewUser
router.post("/addNewUser",(req,res)=>{

    var userName = req.body.uName;
    var password = req.body.password;
    var fName = req.body.fName;
    var lName = req.body.lName;
    // var city =
    // var country =
    // var email =
    // var interestList =
    var qna = {"question" : "What's your dog's name","answer":"my dog"};

    if(user_db[userName] == null){

        const newUser = { uName: userName,
            password: password,
            fName: fName,
            lName: lName,
            qANDa: qna
        };

    user_db[userName] = newUser;
    res.status(Enums.status_Created).send('Added');

  }else{
    res.status(Enums.status_Bad_Request).send('AlreadyExists');
  }


});


/*  Get - getUserQuestion   */
// Todo - /getUserQuestion
router.get('/getUserQuestion/:uName', function(req, res, next) {
  var params = req.params;
  var userName = params.uName;

  if(user_db[userName] == null){
    res.status(Enums.status_Bad_Request).send('NotExists');
  }else{
    var user = user_db[userName];
    var question = user.qANDa.question;
    res.status(Enums.status_OK).send(question);
  }
});



/*  Post - answerUserQuestion   */
// Todo - /answerUserQuestion
router.post("/answerUserQuestion",(req,res)=>{

    var userName = req.body.uName;
    var question = req.body.question;
    var answer = req.body.answer;

  if(user_db[userName] != null){

    var user = user_db[userName];
    var qna = user.qANDa;
    if (qna.answer === answer){
      res.status(Enums.status_OK).send('Correct');
    }else{
      res.status(Enums.status_Bad_Request).send('Incorrect')
    }
  }else{
    res.status(Enums.status_Bad_Request).send('NotExists')
  }



});



// Todo - /getTwoRelevantPoints
router.get('/getTwoRelevantPoints',(req,res,next)=>{
    var userName = req.query.uName;
    p = DButilsAzure.execQuery('');
    p
        .then(result=>{
            console.log(result);
            res.status(status_OK).send(result);
        })
        .catch(error => {
            console.log(error.message);
            res.status(Enums.status_Bad_Request).send(error.message );
        });
});









/*  Get - getUserTwoSavedPoints   */
// Todo - /getUserTwoSavedPoints
router.get('/getUserTwoSavedPoints/:uName', function(req, res, next) {
    var params = req.params;
    var userName = params.uName;

    if(user_db[userName] == null){
        res.status(Enums.status_Bad_Request).send('NotExists');
    }else{
        if(user_savedPoints_db[userName] == null){
            res.status(Enums.status_Bad_Request).send('NoPointsSaved');
        }else{
            var savedPoints = user_savedPoints_db[userName].savedPoints;
            res.status(status_OK).send([savedPoints[0],savedPoints[1]]);
        }

    }
});






// Todo - /addPointIDToSavedList
router.post('/addPointIDToSavedList',(req,res,next)=>{
    var userName = req.query.uName;
    var pID = req.query.pID;
    console.log(`UserName: ${userName}, pID: ${pID}`);
    p = DButilsAzure.execQuery(`Insert into Users_Points VALUES(${userName},${pID});`);
    p
        .then(result=>{
            console.log(result);
            res.status(status_OK).send(result);
        })
        .catch(error => {
            console.log(error.message);
            res.status(Enums.status_Bad_Request).send(error.message );
        });
});




/*  Get - getUserAllSavedPoints   */
// Todo - /getUserAllSavedPoints
router.get('/getUserAllSavedPoints/:uName', function(req, res, next) {
    var params = req.params;
    var userName = params.uName;

    if(user_db[userName] == null){
        res.status(Enums.status_Bad_Request).send('NotExists');
    }else{
        if(user_savedPoints_db[userName] == null){
            res.status(Enums.status_Bad_Request).send('NoPointsSaved');
        }else{
            var savedPoints = user_savedPoints_db[userName].savedPoints;
            res.status(Enums.status_OK).send(savedPoints);
        }

    }
});





// Todo - /deleteSavedPoint
router.delete('/deleteSavedPoint',(req,res,next)=>{
    var userName = req.query.uName;
    var pID = req.query.pID;
    console.log(`UserName: ${userName}, pID: ${pID}`);
    p = DButilsAzure.execQuery(`Delete from Users_Points WHERE(uName=${userName} AND pID=${pID});`);
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




// Todo - /addReviewPoint
router.post('/addReviewPoint',(req,res,next)=>{
    var userName = req.query.uName;
    var pID = req.query.pID;
    console.log(`UserName: ${userName}, pID: ${pID}`);
    p = DButilsAzure.execQuery(``);
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



router.get('/checkIfUserNameExists/:uName',(req,res)=>{
    var params = req.params;
    var userName = params.uName;
    DButilsAzure.execQuery('SELECT * FROM Categories')
        .then(result=> res.status(Enums.status_OK).send(result))
        .catch(error=>res.status(Enums.status_Bad_Request).send(error));
});



function checkIfUserNameExists(uName) {
    const selectQuery = `SELECT uName\n
        FROM [dbo].[Users]\n
        WHERE uName = ${uName}`;
    p = DButilsAzure.execQuery(selectQuery);
    p
        .then(result=>{
            console.log("Check user: " + result);
            res.status(Enums.status_OK).send(result);
        })
        .catch(error => {
            console.log(error.message);
            res.status(Enums.status_Bad_Request).send(error.message );
        });

    var result = Promise.all([p]);
    return result;
}
