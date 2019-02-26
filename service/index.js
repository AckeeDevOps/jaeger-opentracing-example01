// https://blog.risingstack.com/distributed-tracing-opentracing-node-js/

const tracer = require('./tracer');
const express = require('express');
const tracingMiddleware = require('./tracing-middleware');
const reqh = require('./req');
const sleep = require('./sleep');

const app = express();
app.use(tracingMiddleware);

app.get('/local/service1', function(req, res) {

  const uri1 = 'http://service2:3000/remote/service2';
  const uri2 = 'http://service3:3000/remote/service3';

  reqh(uri1, req.span)
    .then(function(r) {
      console.log(`response from service2: ${r}`);
      return reqh(uri2, req.span);
    })
    .then(function(r) {
      console.log(`response from service3: ${r}`);
      res.send(process.env.JAEGER_SERVICE_NAME);
    })
    .catch(function(err) {
      res.status(500).send("Shit's fucked.");
    });
});

app.get('/local/service1-paralel', async function(req, res) {

  const uri1 = 'http://service2:3000/remote/service2';
  const uri2 = 'http://service3:3000/remote/service3';

  try {
    const call1 = reqh(uri1, req.span);
    const call2 = reqh(uri2, req.span);
    const [remoteres1, remoteRes2] = await Promise.all([call1, call2]);
    res.send(`first response: ${remoteres1}, second reponse: ${remoteRes2}`);
  } catch(e) {
    res.status(500).send("It's broken");
  }
});

app.get('/remote/service2', function(req, res) {
  res.send(process.env.JAEGER_SERVICE_NAME);
});

app.get('/remote/service3', function(req, res) {
  // create child span
  const span = tracer.startSpan('strange-delay', { childOf: req.span });
  sleep(2);
  span.finish();
  res.send(process.env.JAEGER_SERVICE_NAME);
});

app.get('/remote/service4', function(req, res) {
  throw "It's broken ...";
});

app.listen(process.env.APP_PORT, function() {
  console.log(`Example app listening on port ${process.env.APP_PORT}!`);
});