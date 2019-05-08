var express = require('express');
var router = express.Router();

user_db = {}




/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



/*  Post - authUser   */
router.post("/authUser",(req,res)=>{

  var userName = req.body.uName;
  var password = req.body.password;

  if(user_db[userName] != null){
    if (user_db[userName].password == password){
      res.status(200).send('Valid');
    }else{
      res.status(400).send('WrongPass')
    }
  }else{
    res.status(400).send('NotExists')
  }



});


/*  Post - addNewUser   */
router.post("/addNewUser",(req,res)=>{

  var userName = req.body.uName;
  var password = req.body.password;
  var fName = req.body.fName;
  var lName = req.body.lName;
  // var city =
  // var country =
  // var email =
  // var interestList =
  // var qna =

  if(user_db[userName] == null){

    const newUser = { uName: userName,
                      password: password,
                      fName: fName,
                      lName: lName  };

    user_db[userName] = newUser;
    res.status(201).send('Added');

  }else{
    res.status(400).send('AlreadyExists');
  }


});





module.exports = router;
