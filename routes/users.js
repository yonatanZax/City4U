var express = require('express');
var router = express.Router();

const DButilsAzure = require('../DButils');
var create_tables_qry = DButilsAzure.create_tables_qry;

var status_OK = 200 ;
var status_Created = 201 ;
var status_Bad_Request = 400 ;
var status_Unauthorized = 401 ;
var status_Not_Found = 404 ;

const table_names_with_dep = ['Points', 'Questions', 'Categories'];
const table_names_without_dep = ['Users_Points', 'Categories_Points', 'Reviews', 'Users'];

function dropAllTables(){
    var promises = [];
    for (let i =0; i < table_names_without_dep.length; i++){
        var name = table_names_without_dep[i];
        var p = DButilsAzure.execQuery(`DROP TABLE ${name};`);
        promises.push(p);
    }
    Promise.all(promises)
        .then(()=>{
            for (let i =0; i < table_names_with_dep.length; i++){
                var name = table_names_with_dep[i];
                var p = DButilsAzure.execQuery(`DROP TABLE ${name};`);
                promises.push(p);
            }
        })
        .catch(error=>console.log(error.message));


    return promises;
}

function createAllTables(){
     var p = DButilsAzure.execQuery(create_tables_qry);
    return p;
}

function resetTables(){
    let promises = dropAllTables();
    Promise.all(promises)
        .then(result=> createAllTables())
        .then(result=> console.log('All tables were reset'))
        .catch(error=>console.log({my_msg:'something went wrong during the delete',
                                            error_msg:error.message}))
        .finally(()=>createAllTables());
}

router.get('/resetTables', function(req,res){
    resetTables();

});


user_db = {"a":{"uName":'a', "password": 'a'}};
var category_db = {'Restaurants'    : ['mcdonalds','BK','suduch', 'kampai'],
                    'Museums'       : ['science museum', 'butterfly museum',],
                    'Attractions'   : ['red light district', 'world disney'],
                    };


router.get('/getCategories', function(req,res){
    DButilsAzure.execQuery('SELECT * FROM Categories')
        .then(result=> res.status(status_OK).send(result))
        .catch(error=>res.status(status_Bad_Request).send(error));
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
            res.status(status_Bad_Request).send(error.message );
        });
});


router.delete('/deleteSavedPoint',(req,res,next)=>{
    var userName = req.query.uName;
    var pID = req.query.pID;
    console.log(`UserName: ${userName}, pID: ${pID}`);
    p = DButilsAzure.execQuery(`Delete from Users_Points WHERE(uName=${userName} AND pID=${pID});`);
    p
        .then(result=>{
            console.log(result);
            res.status(status_OK).send(result);
        })
        .catch(error => {
            console.log(error.message);
            res.status(status_Bad_Request).send(error.message );
        });
});


router.get('/getRelevantPoints',(req,res,next)=>{
    var userName = req.query.uName;
    p = DButilsAzure.execQuery(`Delete from Users_Points WHERE(uName=${userName} AND pID=${pID});`);
    p
        .then(result=>{
            console.log(result);
            res.status(status_OK).send(result);
        })
        .catch(error => {
            console.log(error.message);
            res.status(status_Bad_Request).send(error.message );
        });
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
    var qna = {"question" : "What's your dog's name","answer":"my dog"};

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
