require('dotenv').config()
const utils = require("./server-utils")
const express = require('express');
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();


app.prepare().then(() => {
  utils.initGitRepo()
  .catch(e => console.log(e))

  const port = parseInt(process.env.REACT_APP_PORT, 10) || 3000;
  const server = express();
  server.set('trust proxy', true)

  server.get('/api/key', (req, res) => {
    return handle(req, res);
  });

  server.get('/api/posts', (req, res) => {
    return handle(req, res);
  });
  server.get('/api/post/:slug', (req, res) => {
    return handle(req, res);
  });
  server.get('/api/post/editor/:id', (req, res) => {
    return handle(req, res);
  });
  server.get('/api/post/editor/dashboard', (req, res) => {
    return handle(req, res);
  });
  server.post('/api/post/editor/update', (req, res) => {
    return handle(req, res);
  });

  server.get('*/*', (req, res) => {
    return handle(req, res);
  });
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on localhost:${port}`)
  });
});

