const express = require('express');
const client = require('prom-client');

const app = express();
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const counter = new client.Counter({
  name: 'calc_operations_total',
  help: 'Total number of operations performed',
  labelNames: ['operation']
});

app.get('/add', (req, res) => {
  const result = Number(req.query.a) + Number(req.query.b);
  counter.inc({ operation: 'add' });
  res.send(`Result: ${result}`);
});

app.get('/subtract', (req, res) => {
  const result = Number(req.query.a) - Number(req.query.b);
  counter.inc({ operation: 'subtract' });
  res.send(`Result: ${result}`);
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(3000, () => {
  console.log('Calculator running on http://localhost:3000');
});

