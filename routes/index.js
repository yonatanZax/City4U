
// Imports
var express = require('express');
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
    var cID_list = req.body.cID_list;

    let query = `
                Insert Into Users_Categories
                VALUES `;
    for(let i = 0; i < cID_list.length-1; i++){
        query += `('${userName}',${cID_list[i]}),\n`
    }
    query += `('${userName}',${cID_list[cID_list.length-1]});`;


    pAuth = DButilsAzure.execQuery(`
    Insert into Users
        (uName,pass,fName,lName,city,country,email,question,answer)
    VALUES
        ('${userName}','${password}','${fName}','${lName}','${city}','${country}','${email}',${question},'${answer}')
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

