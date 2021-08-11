var mysql      = require('mysql');


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'gustj486!!',
  database : 'opentutorials'
});
 
connection.connect();
 
// sql 쿼리 문을 주고 두번째 인자로 콜백을 주면 첫번쨰 인자의 sql 쿼리문이 데이터 베이스 서버에 실행이 끝난 다음에 응답할 것이다.
connection.query('SELECT * from topic', function (error, results, fields) {
  if (error) {
      console.error(error);
  };
  console.log(results);
});
 
connection.end();