
// Imports
var express = require('express');
var router = express.Router();

const DButilsAzure = require('../DButils');
var Enums = require('../Enum');


var create_tables_qry = DButilsAzure.create_tables_qry;




const tables_names_list = [['Users_Points', 'Reviews', 'Users_Categories'],
                            ['Users', 'Points'],
                            [ 'Questions', 'Categories']];


function createAllTables(){
    var p = DButilsAzure.execQuery(create_tables_qry);
    return p;
}

function resetTables(req,res){
    let promises = dropAllTables();
    p = Promise.all(promises)
        .then(result=> createAllTables())
        .then(result=> {
            console.log('All tables were reset');
            res.status(Enums.status_OK).send('All tables were reset');
        })
        .catch(error=>{
            console.log({my_msg:'something went wrong during the delete',
                error_msg:error.message});
            res.status(Enums.status_OK).send(error);

        });
    return p;
}


function dropAllTables(){
    var promises = [];
    for (let i = 0; i < tables_names_list.length; i++){
        var promises = [];
        for (let j = 0; j < tables_names_list[i].length; j++) {
            var name = tables_names_list[i][j];
            var p = DButilsAzure.execQuery(`DROP TABLE ${name};`);
            promises.push(p);
        }
        Promise.all(promises)
            .then(()=>console.log(`j=${i} passed successfully`))
            .catch(error=>console.log(`j=${i} FAILED` + error.message));
    }

    return promises;
}

router.get('/resetTables', function(req,res){
    resetTables(req,res);

});

router.get('/createTables', function(req,res){
    p = createAllTables();
    p
        .then(()=>{
            console.log('Tables were Created');
            res.status(Enums.status_OK).send('Tables created');
        })
        .catch(error=>{
            console.log(('Problem with tables'));
            res.status(Enums.status_Bad_Request).send('problem with tables\n' + error.message);
        });
});


/*      Exports     */
module.exports = router;
