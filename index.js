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
  key: fs.readFileSync('../../etc/letsencrypt/live/www.jeancarlos.website/privkey.pem'),
  cert: fs.readFileSync('../../etc/letsencrypt/live/www.jeancarlos.website/cert.pem'),
  ca: fs.readFileSync('../../etc/letsencrypt/live/www.jeancarlos.website/chain.pem'),
}, app)
  .listen(443, function () {
    console.log('listening on port 443 over HTTPS')
  });

// http.createServer(app).listen(80, () => {
//   console.log('Listening 80 over HTTP')
// })


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

app.get('/epi/:id', (req, res) => {
  const id = req.params.id;

  db.select('*')
    .from('epis')
    .where('epi_id', '=', id)
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

app.get("/registros", (req, res) => {
  db.select('*')
    .from('registros')
    .then(data => {
      return res.status(200).json({
        data
      });
    })
    .catch(err => res.status(400).json('unable to get'));
});

app.get("/autorizadores", (req, res) => {
  db.select('*')
    .from('funcionarios')
    .where('autorizador', '=', true)
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

app.post('/saidaepi', async (req, res) => {
  const data = req.body;
  const funcionario_id = Number(data.funcionario_id);
  const autorizador_id = Number(data.autorizador_id);
  const epi_id = Number(data.epi_id);
  const matricula = Number(data.matricula);
  const quantidade = Number(data.quantidade);
  const motivo = Number(data.motivo);

  const epi = await db.select('codigo_epi', 'descricao')
    .from('epis')
    .where('epi_id', '=', epi_id)
    .then(data => {
      return data[0]
    });

  const funcionario = await db.select('matricula', 'nome', 'cargo')
    .from('funcionarios')
    .where('funcionario_id', '=', funcionario_id)
    .then(data => {
      return data[0]
    });

  const autorizador = await db.select('matricula')
    .from('funcionarios')
    .where('funcionario_id', '=', autorizador_id)
    .then(data => {
      return data[0]
    });

  const autorizador_matricula = String(autorizador.matricula);

  db('registros').insert(

    Object.assign({ saida: new Date() }, { matricula }, epi, funcionario, { quantidade }, { motivo }, { autorizador: autorizador_matricula })
  )
    .then(res.json("OK"))
})