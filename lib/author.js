const connection = require("./db");
var template = require('./template.js');
var qs = require('querystring');
var url = require('url');
var sanitizeHtml = require('sanitize-html');
const { sort } = require('./test');
const { resolve } = require("path");
const { connect } = require("./db");



exports.home = (request, response) => {
    connection.query(`select * from topic`, (error, topics) => {
        if (error) {
            throw error;
        }
        connection.query(`select * from author`, (error2, authors) => {
            if(error2) {
                throw error2;
            }

            var title = 'author';
            var list = template.list(topics);
            var html = template.HTML(title, list,
            `
            ${template.authorTable(authors)}

            <style>
                table{
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td{
                    border: 1px solid black;
                    padding: 10px;
                    text-align: center;
                }

                
            </style>

            <form action="/author/create_process" method="post">
                <p>
                    <input type="text" name="name" placeholder="name">
                </p>
                <p>
                    <textarea name="profile" placeholder="description" id="create_textarea_1"></textarea>
                </p>
                <p>
                    <input type="submit" value="create" class="create_input_1">
                </p>
            </form>


            <style>
                .create_input_1 {
                    backgroud-color: blue;
                }
                #create_input_2 {
                    width: 100px;
                    height: 55px;
                    border-top: none;
                    border-left: none;
                    border-right: none;
                    border-bottom: 3px solid black;
                }

                #create_textarea_1 {
                    width: 300px;
                    height: 50px;
                    border-top: none;
                    border-left: none;
                    border-right: none;
                    border-bottom: 3px solid black;
                }

            </style>
            `
            ,
            ``
            );
            response.writeHead(200);
            response.end(html);
        });
    });
}

exports.create_process = (request, response) => {
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
      var post = qs.parse(body);
      connection.query(`
      insert into author (name, profile)
        values(?, ?);`,
      [post.name, post.profile],
      (error, results) => {
        if(error) {
          throw error;
        }
        response.writeHead(302, {Location: `/author`});
        response.end();
      });
    });
  }

  // 콜백 지옥 -> promise로 해결할 수 있겠군
  exports.update = (request, response) => {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;

    const first_query = () => {
        return new Promise((resolve, rject) => {
            connection.query(`select * from topic`, (error, topics) => {
                if (error) {
                    reject(`error`);
                } else {
                    resolve(topics);
                }
            })
        })
    }
    const second_query = () => {
        return new Promise((resolve, rject) => {
            connection.query(`select * from author`, (error2, authors) => {
                if (error2) {
                    reject(`error2`);
                } else {
                    resolve(authors);
                }
            })
        })
    }
    const third_query = () => {
        return new Promise((resolve, rject) => {
            connection.query(`select * from author where id=?`, [queryData.id], (error3, author) => {
                if (error3) {
                    reject(`error3`);
                } else {
                    resolve(author);
                }
            })
        })
    }

    
    async function do_sync() {
        const topics = await first_query();
        const authors = await second_query();
        const author = await third_query();
        var title = 'author';
        var list = template.list(topics);
        var html = template.HTML(title, list,
        `
        ${template.authorTable(authors)}

        <style>
            table{
                width: 100%;
                border-collapse: collapse;
            }
            th, td{
                border: 1px solid black;
                padding: 10px;
                text-align: center;
            }   
        </style>

        <form action="/author/update_process" method="post">
            <p>
                <input type="hidden" name="id" value=${queryData.id}>
            </p>
            <p>
                <input type="text" name="name" placeholder="name" value=${sanitizeHtml(author[0].name)}>
            </p>
            <p>
                <textarea name="profile" placeholder="description">${sanitizeHtml(author[0].profile)}</textarea>
            </p>
            <p>
                <input type="submit" value="update">
            </p>
        </form>
        `
        ,
        ``
        );
        response.writeHead(200);
        response.end(html);

    }
    do_sync();
}

exports.update_process = (request, response) => {
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
      var post = qs.parse(body);
      connection.query(`
        update author set name=?, profile=? where id=?
      `,
      [post.name, post.profile, post.id],
      (error, results) => {
        if(error) {
          throw error;
        }
        response.writeHead(302, {Location: `/author`});
        response.end();
      });
    });
  }


  exports.delete_process = (request, response) => {
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
      var post = qs.parse(body);

      connection.query(
            `delete from topic where author_id=?`,
            [post.id],
            (error1, result1) => {
                if (error1) {
                    throw error1;
                }
                connection.query(`
                    delete from author where id=?`,
                [post.id],
                (error2, results2) => {
                    if(error2) {
                        throw error2;
                    }
                    response.writeHead(302, {Location: `/author`});
                    response.end();
            });
        });
    });
  }

exports.sort_process = (request, response) => {
    connection.query('select * from topic', (error1, data1) => {
        if(error1) throw error1;
        connection.query('select * from topic order by author_id', (error2, data2) => {
          if(error2) throw error2;
          var i = 0;
          for(i = 0; i < data2.length; i++) {
              console.log(`Doing ${i+1}st process`);
              connection.query(
                  'update topic set title=?, description=?, created=?, author_id=? where id=?',
                  [data2[i].title, data2[i].description, data2[i].created, data2[i].author_id, data1[i].id],
                  (error3, data3) => {
                      if (error3) throw error3;
              });
            }
        response.writeHead(302, {Location: `/author`});
        response.end();
        });
    });
}

exports.sort_process_2 = (request, response) => {
    connection.query('select * from author', (error1, data1) => {
        if(error1) throw error1;
        connection.query('select * from author order by name', (error2, data2) => {
          if(error2) throw error2;
          var i = 0;
          for(i = 0; i < data2.length; i++) {
              console.log(`Doing ${i+1}st process`);
              connection.query(
                  'update author set name=?, profile=? where id=?',
                  [data2[i].name, data2[i].profile, data1[i].id],
                  (error3, data3) => {
                      if (error3) throw error3;
              });
            }
        response.writeHead(302, {Location: `/author`});
        response.end();
        });
    });
}

