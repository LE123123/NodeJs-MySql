var sanitizeHtml = require('sanitize-html');
const connection = require("./db");



module.exports = {
  HTML:function(title, list, body, control){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <a href="/author">author</a>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },list:function(topics){
    var list = '<ul>';
    var i = 0;
    while(i < topics.length){
      list = list + `<li><a href="/?id=${topics[i].id}">${sanitizeHtml(topics[i].title)}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  }, authorSelect: function(authors, author_id) {
    var tag = ``;
    var i = 0;
    while (i < authors.length) {
      selected = ``;
      if(authors[i].id === author_id) {
        selected = ` selected`;
        console.log(authors[i].name);
      }
      tag += `<option value="${authors[i].id}"${selected}>${sanitizeHtml(authors[i].name)}</option>`
      i++;
    }
    return `
      <select name="author">
        ${tag}
      </select>
    `
  }, authorTable: function(authors) {
    var tag = `
    <form action="/author/sort_process" method="post">
      <input type="submit" value="글 정렬 -> author_id" id="sort_topic">
      <style>
        #sort_topic {
          margin-bottom: 10px;
        }
        #sort_author {
          margin-bottom: 10px;
        }
      </style>
    </form>
    
    <table>
    <thead>
      <tr>
        <th>Name</th> <th>Profile</th> <th>update</th> <th>delete</th>
      </tr>
    </thead>
    <tbody>
    
    `;
    var i = 0;
    while(i < authors.length) {
        tag += `
            <tr>
                <td>${sanitizeHtml(authors[i].name)}</td>
                <td>${sanitizeHtml(authors[i].profile)}</td>
                <td><a href="/author/update?id=${authors[i].id}">update</a></td>
                <td>
                  <form action="/author/delete_process" method="post">
                    <input type="hidden" name="id" value="${authors[i].id}">
                    <input type="submit" value="delete">
                  </form>
                </td>
            </tr>
        `
        i++;
    }
    tag += `</tbody></table>
    <form action="/author/sort_process_2" method="post">
    <input type="submit" value="저자 정렬 -> name" id="sort_author">
    <style>
      #sort_author {
        margin-top: 10px;
      }
    </style>
  </form>
    `
    return tag;
  }
}
