
// Imports
var express = require('express');
var categories = require('./categories');
var router = express.Router();
var DButilsAzure = require('../DButils');
var Enums = require('../Enum');
const jwt = require("jsonwebtoken");



// ***  Secret for the Token    ***
// Useful site:     https://jwt.io/
const secret = "ImGroot";




/*  Post - addNewUser   */
// Todo - /addNewUser -
router.post("/addNewUser",(req,res)=>{

    var userName = req.body.uName;
    if (userName.match("^[A-z]+$") && (userName.length < 3 || userName.length > 8)){
        req.status(Enums.status_Bad_Request).send('Invalid values');
    }
    var password = req.body.password;
    if ( password.match("^[A-z0-9]+$") && (password.length < 5 || password.length > 10)){
        req.status(Enums.status_Bad_Request).send('Invalid values');
    }
    var fName = req.body.fName;
    var lName = req.body.lName;
    var city = req.body.city;
    var country = req.body.country;
    if(! categories.countries.includes(country) ){
        req.status(Enums.status_Bad_Request).send('Invalid values');
    }
    var email = req.body.email;
    // var interestList = req.body.lName;
    // var qna = req.body.qANDa;
    var qID_list = req.body.qID_list;
    if ( qID_list.length < 2 ){
        req.status(Enums.status_Bad_Request).send('Invalid values');
    }

    var answers = req.body.answers;
    if( answers.length !== qID_list.length){
        req.status(Enums.status_Bad_Request).send('Invalid values');
    }

    var cID_list = req.body.cID_list;

    let query = `
                Insert Into Users_Categories
                VALUES `;
    for(let i = 0; i < cID_list.length-1; i++){
        query += `('${userName}',${cID_list[i]}),\n`
    }
    query += `('${userName}',${cID_list[cID_list.length-1]});`;


    query = '\n' + `
                Insert Into Users_Questions
                VALUES `;
    for(let i = 0; i < qID_list.length-1; i++){
        query += `('${userName}',${qID_list[i]},'${answers[i]}'),\n`
    }
    query += `('${userName}',${qID_list[qID_list.length-1]},'${answers[answers.length-1]});`;


    pAuth = DButilsAzure.execQuery(`
    Insert into Users
        (uName,pass,fName,lName,city,country,email,question,answer)
    VALUES
        ('${userName}','${password}','${fName}','${lName}','${city}','${country}','${email}')
    `);

    pAuth
        .then(result => DButilsAzure.execQuery(query))
        .then(result=> res.status(Enums.status_Created).send('Added'))
        .catch(error => {
            res.status(Enums.status_Bad_Request).send(error.message );
        });


});






/*  Post - authUser   */
// Todo - /authUser - OK
router.post("/authUser",(req,res)=>{

    var userName = req.body.uName;
    var password = req.body.password;

    p = DButilsAzure.execQuery(`
        SELECT uName 
        FROM Users 
        WHERE uName = '${userName}' AND CONVERT(VARCHAR, pass) = '${password}'
        `);
    p
        .then(result=>{
            if(result.length > 0){
                payload = { name: userName, pass: password};
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





/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



router.post("/verifyTokenExample", (req, res) => {
    const token = req.header("x-auth-token");
    // no token
    if (!token) res.status(Enums.status_Unauthorized).send("Access denied. No token provided.");
    // verify token
    try {
        const decoded = jwt.verify(token, secret);
        req.decoded = decoded;
        if (req.decoded.admin)
            res.status(Enums.status_OK).send({ result: "Hello admin." });
        else
            res.status(Enums.status_OK).send({ result: "Hello user." });
    } catch (exception) {
        res.status(Enums.status_Bad_Request).send("Invalid token.");
    }
});




// ***  Token - login example   ***

router.post("/getTokenExample", (req, res) => {
    payload = { name: "a", admin: true };
    options = { expiresIn: "1d" };
    const token = jwt.sign(payload, secret, options);
    res.send(token);
});







/*      Exports     */
module.exports = router;

