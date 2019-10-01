const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

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

app.listen(3000, function () {
    console.log(' port 3000!');
  })
  

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