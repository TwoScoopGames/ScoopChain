var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var cons = require("consolidate");
var dust = require("dustjs-helpers");
var pg = require("pg");
var QRCode = require('qrcode');
var uuid = require("uuid");
var randomItem = require('random-item');
var flavors = require("./flavors.json");


var app = express();

// temporary database stuff
const config = {
  user: 'node',
  database: 'twoscoopgames',
  password: 'node123',
  port: 5432
};
const pool = new pg.Pool(config);


app.engine('dust', cons.dust);
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



function createBitconeQR(bitconeuuid) {
  QRCode.toFile(`./public/qrcodes/${bitconeuuid}.png`, `http://twoscoopgames.com/bitcone?id=${bitconeuuid}`, {
    color: {
      dark: '#000',
      light: '#0000'
    }
  }, function (err) {
    if (err) throw err
    console.log('done');
  });
}


app.get('/', (req, res, next) => {
  pool.connect( (err, client, done) => {
    if (err) {
      console.log("There was an error connecting to the database", err);
    }
    client.query('SELECT * FROM bitcones', (err, result) => {

      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      result.rows.map( (row) => {
        row.qrcode = '/qrcodes/' + row.uuid + '.png';
      });
      res.render('index', { bitcones: result.rows });
      done();
    });
  });
});


app.post('/add', (req, res) => {
  pool.connect( (err, client, done) =>{
    if (err) {
      console.log("There was an error connecting to the database", err);
    }
    var newBitconeId = uuid();
    client.query(
      "INSERT INTO bitcones(uuid, series, flavor, owner) VALUES($1, $2, $3, $4)",
      [
        newBitconeId,
        req.body.series,
        randomItem(flavors),
        req.body.owner
      ]
    );
    createBitconeQR(newBitconeId);
    done();
    res.redirect('/');
  });
});


app.delete('/delete/:id', (req, res) => {
  pool.connect( (err, client, done) => {
    if (err) {
      console.log("There was an error connecting to the database", err);
    }
    client.query('DELETE FROM bitcones WHERE uuid = $1', [req.params.uuid]);
    done();
    res.sendStatus(200);
  });
});



app.post('/edit', (req, res) => {
  pool.connect( (err, client, done) => {
    if (err) {
      console.log("There was an error connecting to the database", err);
    }
    console.log(
      req.body.uuid,
      req.body.series,
      req.body.flavor,
      req.body.owner
    );
    client.query('UPDATE bitcones SET series=$2, flavor=$3, owner=$4   WHERE uuid = $1',
    [
      req.body.uuid,
      req.body.series,
      req.body.flavor,
      req.body.owner
    ]
  );
  done();
  res.redirect('/');
  });
});


app.listen(3000, () => {
  console.log('Server Started on port 3000');
});
