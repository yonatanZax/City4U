//this is only an example, handling everything is yours responsibilty !
//this is an example - open and close the connection in each request

var ConnectionPool = require('tedious-connection-pool');
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

var poolConfig = {
    min: 2,
    max: 5,
    log: true
};

var connectionConfig = {
    userName: 'cityadmin',
    password: 'AdminCity0',
    server: 'city4u.database.windows.net',
    options: { encrypt: true, database: 'City4U' }
};

//create the pool
var pool = new ConnectionPool(poolConfig, connectionConfig);

pool.on('error', function (err) {
    if (err) {
        console.log(err);
       
    }
});
console.log('pool connection on');


//----------------------------------------------------------------------------------------------------------------------
exports.execQuery = function (query) {
    return new Promise(function (resolve, reject) {

        try {

            var ans = [];
            var properties = [];

            //acquire a connection
            pool.acquire(function (err, connection) {
                if (err) {
                    console.log('acquire ' + err);
                    reject(err);
                }
                console.log('connection on');

                var dbReq = new Request(query, function (err, rowCount) {
                    if (err) {
                        console.log('Request ' + err);
                        reject(err);
                    }
                });

                dbReq.on('columnMetadata', function (columns) {
                    columns.forEach(function (column) {
                        if (column.colName != null)
                            properties.push(column.colName);
                    });
                });
                dbReq.on('row', function (row) {
                    var item = {};
                    for (i = 0; i < row.length; i++) {
                        item[properties[i]] = row[i].value;
                    }
                    ans.push(item);
                });

                dbReq.on('requestCompleted', function () {
                    console.log('request Completed: ' + dbReq.rowCount + ' row(s) returned');
                    console.log(ans);
                    connection.release();
                    resolve(ans);

                });
                connection.execSql(dbReq);

            });
        }
        catch (err) {
            reject(err)
        }
    });

};

module.exports.create_tables_qry = '\n' +
    '\n' +
    'CREATE TABLE Categories (\n' +
    '\tcID\t\t\tINT\t\tIDENTITY(1,1)\tPRIMARY KEY ,\n' +
    '\tcName\t\tTEXT\tNOT NULL,\n' +
    ');\n' +
    '\n' +
    'CREATE TABLE Points(\n' +
    '\tpID\t\t\tINT\t\tIDENTITY(1,1) PRIMARY KEY,\n' +
    '\tpName\t\tTEXT\tNOT NULL,\n' +
    '\tdetails\t\tTEXT\tNOT NULL,\n' +
    '\tcID\t\t\tINT\t\tNOT NULL FOREIGN KEY REFERENCES Categories(cID)\tON UPDATE CASCADE ON DELETE CASCADE,\n' +
    '\tpRank\t\tFLOAT\tdefault 3,\n' +
    '\tpicture\t\tTEXT\t,\n' +
    ');\n' +
    '\n' +
    'CREATE TABLE Questions (\n' +
    '\tqID\t\t\tINT\t\tIDENTITY(1,1) PRIMARY KEY ,\n' +
    '\tquestion\tTEXT\tNOT NULL,\n' +
    ');\n' +
    '\n' +
    'CREATE TABLE Users (\n' +
    '\tuName\t\tvarchar(8)\tNOT NULL PRIMARY KEY ,\n' +
    '\tpass\t\tvarchar(10)\tNOT NULL,\n' +
    '\tfName\t\tTEXT\t\tNOT NULL,\n' +
    '\tlName\t\tTEXT\t\tNOT NULL,\n' +
    '\tcity\t\tTEXT\t\tNOT NULL,\n' +
    '\tcountry\t\tTEXT\t\tNOT NULL,\n' +
    '\temail\t\tTEXT\t\tNOT NULL,\n' +
    ');\n' +
    '\n' +
    'CREATE TABLE Users_Categories (\n' +
    '    uName\t\tvarchar(8)\t\tFOREIGN KEY REFERENCES Users(uName)\t\t    ON UPDATE CASCADE ON DELETE CASCADE,\n' +
    '    cID\t\t\tINT\t\t        FOREIGN KEY REFERENCES Categories(cID)\t\tON UPDATE CASCADE ON DELETE CASCADE,\n' +
    '    PRIMARY KEY(uName, cID)\n' +
    ');\n' +
    '\n' +
    'CREATE TABLE Users_Questions (\n' +
    '    uName\t\tvarchar(8)\t\tFOREIGN KEY REFERENCES Users(uName)\t\t    ON UPDATE CASCADE ON DELETE CASCADE,\n' +
    '    qID     \tINT\t\t\t    FOREIGN KEY REFERENCES Questions(qID)       ON UPDATE CASCADE ON DELETE CASCADE,\n' +
    '    answer\t\tTEXT\t\t    NOT NULL\n' +
    '    PRIMARY KEY(uName, qID)\n' +
    ');\n' +
    '\n' +
    '\n' +
    'CREATE TABLE Users_Points (\n' +
    '\tuName\t\tvarchar(8)\t\tFOREIGN KEY REFERENCES Users(uName)\t\tON UPDATE CASCADE ON DELETE CASCADE,\n' +
    '\tpID\t\t\tINT\t\t        FOREIGN KEY REFERENCES Points(pID)\t\tON UPDATE CASCADE ON DELETE CASCADE,\n' +
    '\tinsertTime  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,\n' +
    '\tsavePosition INT            DEFAULT 0\n' +
    '\tPRIMARY KEY(uName, pID)\n' +
    ');\n' +
    '\n' +
    '\n' +
    'CREATE TABLE Reviews (\n' +
    '\tuName\t\tvarchar(8)\tFOREIGN KEY REFERENCES Users(uName)\t\tON UPDATE CASCADE ON DELETE CASCADE,\n' +
    '\tpID\t\t\tINT\t\t    FOREIGN KEY REFERENCES Points(pID)\t\tON UPDATE CASCADE ON DELETE CASCADE,\n' +
    '\tcontent\t\tTEXT\t    ,\n' +
    '\tscore\t\tINT\t\t    NOT NULL,\n' +
    '\tCONSTRAINT  SCORE_CON   check (score between 1 and 5),\n' +
    '\tPRIMARY KEY(uName, pID)\n' +
    '\n' +
    ');\n' +
    '\n' +
    '\n' +
    '\n' +
    '\n' +
    '\n' +
    '\n';


