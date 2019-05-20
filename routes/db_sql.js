
// Imports
var express = require('express');
var router = express.Router();

const DButilsAzure = require('../DButils');
var create_tables_qry = DButilsAzure.create_tables_qry;



const table_names_with_dep = ['Points', 'Questions', 'Categories'];
const table_names_without_dep = ['Users_Points', 'Categories_Points', 'Reviews', 'Users'];








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


/*      Exports     */
module.exports = router;
