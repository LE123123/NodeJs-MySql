var http = require('http');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var connection = require('./lib/db');
var topic = require('./lib/topic');
var author = require('./lib/author');
var express = require('express');
var app = express();
var author_router = require('./lib/author_router');
const router = require('./lib/author_router');
const morgan = require('morgan');


const port = 3000;

// app.use((req, res, next) => {
//   console.log(`Time: `, Date.now());
//   next();
// })

// app.use(morgan('dev'));


app.get('/', (req, res) => {
  var _url = req.url;
  var { query } = url.parse(_url, true)
  var query_id = query.id;
  if (query_id) {
    topic.page(req, res, query_id);
  } else {
    topic.home(req, res);
  };
});

app.get('/create', (req, res) => {
  topic.create(req, res);
})

app.post('/create', (req, res) => {
  topic.create_process(req, res);
})

app.get('/update', (req, res) => {
  topic.update(req, res);
})

app.post('/update', (req, res) => {
  topic.update_process(req, res);
})

app.post('/delete', (req, res) => {
  topic.delete_process(req, res);
})

app.use('/author', author_router);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})

