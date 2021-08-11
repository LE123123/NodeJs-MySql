var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'gustj486!!',
    database : 'opentutorials',
    multipleStatements: true
  });
  // 실제 접속이 일어난다.
  connection.connect();

  module.exports = connection;
  