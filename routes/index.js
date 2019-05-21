
// Imports
var express = require('express');
var router = express.Router();
var DButilsAzure = require('../DButils');
const jwt = require("jsonwebtoken");



// ***  Secret for the Token    ***
// Useful site:     https://jwt.io/
const secret = "ImGroot";




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



app.post("/private", (req, res) => {
    const token = req.header("x-auth-token");
    // no token
    if (!token) res.status(401).send("Access denied. No token provided.");
    // verify token
    try {
        const decoded = jwt.verify(token, secret);
        req.decoded = decoded;
        if (req.decoded.admin)
            res.status(200).send({ result: "Hello admin." });
        else
            res.status(200).send({ result: "Hello user." });
    } catch (exception) {
        res.status(400).send("Invalid token.");
    }
});









/*      Exports     */
module.exports = router;
