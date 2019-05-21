
// Imports
var express = require('express');
var router = express.Router();
var DButilsAzure = require('../DButils');
var Enums = require('../Enum');
const jwt = require("jsonwebtoken");



// ***  Secret for the Token    ***
// Useful site:     https://jwt.io/
const secret = "ImGroot";










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
    payload = { id: 1, name: "user1", admin: true };
    options = { expiresIn: "1d" };
    const token = jwt.sign(payload, secret, options);
    res.send(token);
});







/*      Exports     */
module.exports = router;

