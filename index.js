/* eslint-disable import/no-extraneous-dependencies */

const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');

const sign = require('./sign');

const app = express();

app.set('port', process.env.PORT || 8080);
app.use(cors());

app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Hey',
    bucketUri: '',
    awsKey: '',
  });
});

app.get('/sign', sign);

http.createServer(app).listen(app.get('port'), () => {
  console.log(`Express server listening on port ${app.get('port')}`);
});
