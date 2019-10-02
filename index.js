const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const https = require("https");
const http = require("http");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = require('knex')({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'secret',
    database: 'entregadeepi'
  }
});

https.createServer({
  key: fs.readFileSync('../../etc/letsencrypt/live/www.jeancarlos.website/cert.privkey.pem'),
  cert: fs.readFileSync('../../etc/letsencrypt/live/www.jeancarlos.website/cert.pem'),
  ca: fs.readFileSync('../../etc/letsencrypt/live/www.jeancarlos.website/chain.pem'),
}, app)
  .listen(443, function () {
    console.log('listening on port 443 over HTTPS')
  });

http.createServer(app).listen(80, () => {
  console.log('Listening 80 over HTTP')
})


app.get('/', (req, res) => {
  res.json("it`s working!")
});


app.get('/funcionario/:id', (req, res) => {
  const id = req.params.id;

  db.select('*')
    .from('funcionarios')
    .where('funcionario_id', '=', id)
    .then(data => {
      return res.status(200).json({
        data
      });
    })
    .catch(err => res.status(400).json('unable to get'));
});


app.get("/funcionarios", (req, res) => {
  db.select('*')
    .from('funcionarios')
    .then(data => {
      return res.status(200).json({
        data
      });
    })
    .catch(err => res.status(400).json('unable to get'));
});

app.get("/epis", (req, res) => {
  db.select('*')
    .from('epis')
    .then(data => {
      return res.status(200).json({
        data
      });
    })
    .catch(err => res.status(400).json('unable to get'));
});

app.post('/signin', (req, res) => {
  db.select('*')
      .from('users')
      .where('email', '=', req.body.email)
      .then(data => {
        console.log(data[0]);
          const isValid = req.body.password === data[0].hash;
          if (isValid) {
              return res.status(200).json({
                id: data[0].user_id,
              });
          } else {
              res.status(400).json('wrong credentials');
          }
      })
      .catch(err => res.status(400).json('unable to signin'));
})