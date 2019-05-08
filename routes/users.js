var express = require('express');
var router = express.Router();

user_db = {"a":{"uName":'a', "password": 'a'}};



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
  var qna = {"question" : "What's your dog's name","answer":"my dog"}

  if(user_db[userName] == null){

    const newUser = { uName: userName,
                      password: password,
                      fName: fName,
                      lName: lName,
                      qANDa: qna
                    };

    user_db[userName] = newUser;
    res.status(201).send('Added');

  }else{
    res.status(400).send('AlreadyExists');
  }


});


/*  Get - getUserQuestion   */
router.get('/getUserQuestion/:uName', function(req, res, next) {
  var params = req.params;
  var userName = params.uName;

  if(user_db[userName] == null){
    res.status(400).send('NotExists');
  }else{
    var user = user_db[userName];
    var question = user.qANDa.question;
    res.status(200).send(question);
  }
});



/*  Post - answerUserQuestion   */
router.post("/answerUserQuestion",(req,res)=>{

  var userName = req.body.uName;
  var question = req.body.question;
  var answer = req.body.answer;

  if(user_db[userName] != null){

    var user = user_db[userName];
    var qna = user.qANDa;
    if (qna.answer == answer){
      res.status(200).send('Correct');
    }else{
      res.status(400).send('Incorrect')
    }
  }else{
    res.status(400).send('NotExists')
  }



});


module.exports = router;
