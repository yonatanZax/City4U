var express = require('express');
var router = express.Router();

var status_OK = 200 ;
var status_Created = 201 ;
var status_Bad_Request = 400 ;
var status_Unauthorized = 401 ;
var status_Not_Found = 404 ;


user_db = {"a":{"uName":'a', "password": 'a'}};
var category_db = {'Restaurants'    : ['mcdonalds','BK','suduch', 'kampai'],
                    'Museums'       : ['science museum', 'butterfly museum',],
                    'Attractions'   : ['red light district', 'world disney'],
                    };


router.get('/getCategories', function(req,res){
   res.status(status_OK).send(Object.keys(category_db));
});

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
