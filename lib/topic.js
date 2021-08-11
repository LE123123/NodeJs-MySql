var connection = require('./db');
var template = require('./template.js');
var url = require('url');
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');
var express = require('express');


exports.home = function(request, response) {
    connection.query(`select * from topic`, (error, topics) => {
      if (error) console.error(error);
      var title = 'Welcome';
      var description = 'Hello, Node.js';
      var list = template.list(topics);
      var html = template.HTML(title, list,
        `<h2>${title}</h2>${description}`,
        `<a href="/create">create</a>`
      );
      // response.writeHead(200);
      // response.end(html);

      response.send(html)
  });
}

exports.page = (request, response, query_id) => {
  connection.query('select * from topic', (error1, topics) => {
    if(error1) {
      throw error1;
    }

    var sql = `select * from topic left join author on topic.author_id = author.id where topic.id=${connection.escape(query_id)}`;
    // 이렇게 씀으로써 sql injection 해킹 문제를 막을 수 있게 된다.
    var query = connection.query(sql, (error2, topic) => {
    // var query = connection.query(`select * from topic left join author on topic.author_id = author.id where topic.id=?`, [queryData.id], (error2, topic) => {

      if(error2) {
        throw error2;
      }
      var title = topic[0].title;
      var description = topic[0].description;
      var list = template.list(topics);
      var html = template.HTML(title, list,
        `<h2>${sanitizeHtml(title)}</h2>
        ${sanitizeHtml(description)}
        <p>
          by ${sanitizeHtml(topic[0].name)}
        </p>
        `,
        ` <a href="/create">create</a>
          <a href="/update?id=${query_id}">update</a>
          <form action="delete" method="post">
            <input type="hidden" name="id" value="${query_id}">
            <input type="submit" value="delete">
          </form>`
        )
      // response.writeHead(200);
      // response.end(html);
      response.send(html);
    });
  });
}

exports.create = (request, response) => {
  connection.query(`select * from topic`, (error, topics) => {
    if (error) throw error;
    connection.query(`select * from author`, (error2, authors) => {
      if (error2) throw error2
      var title = 'Create';
      var list = template.list(topics);
      var html = template.HTML(title, list,
        `
        <form action="/create" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            ${template.authorSelect(authors, authors[0].id)}
          </p>

          <p>
            <input type="submit">
          </p>
        </form>
        `,
        `<a href="/create">create</a>`
      );
      response.send(html);
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
    // fs.writeFile(`data/${title}`, description, 'utf8', function(err){
    //   response.writeHead(302, {Location: `/?id=${title}`});
    //   response.end();
    // })
    connection.query(`
    insert into topic (title, description, created, author_id)
      values(?, ?, Now(), ?);`,
    [post.title, post.description, post.author],
    (error, results) => {
      if(error) {
        throw error;
      }
      response.writeHead(302, {Location: `/?id=${results.insertId}`});
      response.end();
    });
  });
}

exports.update = (request, response) => {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  connection.query(`select * from topic`, (error1, topics) => {
    if (error1) {
      throw error1;
    }
    connection.query(`select * from topic where id=?`, [queryData.id], (error2, topic) => {
      if (error2) {
        throw error2;
      }
      connection.query(`select * from author`, (error3, authors) => {
        if (error3) {
          throw error3;
        }
        var list = template.list(topics);
        var html = template.HTML(sanitizeHtml(topic[0].title), list, 
          `
          <form action="/update" method="post">
          <input type="hidden" name="id" value="${topic[0].id}">
          <p><input type="text" name="title" placeholder="title" value="${sanitizeHtml(topic[0].title)}"></p>
          <p>
            <textarea name="description" placeholder="description">${sanitizeHtml(topic[0].description)}</textarea>
          </p>
          <p>
            ${template.authorSelect(authors, topic[0].author_id)}
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
          `,
          `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
        );
        response.send(html);
      });
    });
  });
}

exports.update_process = (request, response) => {
  var body = '';
  request.on('data', function(data){
      body = body + data;
  });
  request.on('end', function(){
      var post = qs.parse(body);
      connection.query(`update topic set title=?, description=?, author_id=? where id=?`, [post.title, post.description, post.author, post.id], (error, result) => {
        response.writeHead(302, {Location: `/?id=${post.id}`});
        response.end();
      })
  });
}

exports.delete_process = (request, response) => {
  var body = '';
  request.on('data', function(data){
      body = body + data;
  });
  request.on('end', function(){
      var post = qs.parse(body);
      connection.query(`delete from topic where id=?`, [post.id], (error, result) => {
        if (error) {
          throw error;
        }
        response.writeHead(302, {Location: `/`});
        response.end();
      });
  });
}