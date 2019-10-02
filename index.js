const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const https = require("https");

const app = express();
app.use(bodyParser.json());
app.use(cors());

  const db = require('knex')({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'test',
      database : 'entregadeepi'
    }
  });

  https.createServer({
    key: fs.readFileSync('../etc/letsencrypt/live/www.jeancarlos.website/privkey.pem'),
    cert: fs.readFileSync('../etc/letsencrypt/live/www.jeancarlos.website/fullchain.pem')
  }, app)
  .listen(80, function () {
    console.log('listening on port 80 over https')
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