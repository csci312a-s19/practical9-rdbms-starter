/* eslint-disable no-console */
/* eslint no-unused-vars: ["error", { "args": "none" }] */
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

// db-errors provides a consistent wrapper around database errors
const { wrapError, DBError } = require('db-errors');

const app = express();

// Cross-Origin-Resource-Sharing headers tell the browser is OK for this page to request resources
// from another domain (which is otherwise prohibited as a security mechanism)
const corsOptions = {
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  origin: '*',
  allowedHeaders: ['Content-Type', 'Accept', 'X-Requested-With', 'Origin']
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const articles = {}; // Create in memory storage of the articles

app.get('/api/articles', (request, response, next) => {
  response.send(Object.values(articles));
});

app.post('/api/articles', (request, response, next) => {
  const nextId =
    1 +
    Object.values(articles).reduce(
      (maxId, article) => Math.max(maxId, article.id),
      0
    );
  articles[nextId] = Object.assign({}, request.body, { id: nextId });
  response.send(articles[nextId]);
});

app.delete('/api/articles/:id', (request, response, next) => {
  delete articles[request.params.id];
  response.sendStatus(200);
});

app.put('/api/articles/:id', (request, response, next) => {
  articles[request.params.id] = request.body;
  response.send(request.body);
});

// A very simple error handler. In a production setting you would
// not want to send information about the inner workings of your
// application or database to the client.
app.use((error, request, response, next) => {
  if (response.headersSent) {
    next(error);
  }
  const wrappedError = wrapError(error);
  if (wrappedError instanceof DBError) {
    response.status(400).send(wrappedError.data || wrappedError.message || {});
  } else {
    response
      .status(wrappedError.statusCode || wrappedError.status || 500)
      .send(wrappedError.data || wrappedError.message || {});
  }
});

module.exports = {
  app,
  articles
};
