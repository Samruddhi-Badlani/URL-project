var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cons = require('consolidate');
var dust = require('dustjs-helpers');
var pg = require('pg');
const { link } = require('fs');

app = express();
//DB connection
var connect = "postgres://user1:abc1234@localhost/my_database";

//Assign dust engines 
app.engine('dust', cons.dust);

app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
//Server 
my_initial_list = null;
app.get('/', function (req, res) {
  const { Pool, Client } = require('pg')
  const pool = new Pool({
    user: 'user1',
    host: 'localhost',
    database: 'my_database',
    password: 'abc1234',
    port: 5432,
  })
  const client = new Client({
    user: 'user1',
    host: 'localhost',
    database: 'my_database',
    password: 'abc1234',
    port: 5432,
  })
  client.connect();
  client.query('SELECT * FROM url_status', (err, result) => {
    res.render('index', { urls: result.rows });
    client.end();
  })

});

app.post('/example', (req, res) => {
  const { Pool, Client } = require('pg')
  const pool = new Pool({
    user: 'user1',
    host: 'localhost',
    database: 'my_database',
    password: 'abc1234',
    port: 5432,
  })
  const client = new Client({
    user: 'user1',
    host: 'localhost',
    database: 'my_database',
    password: 'abc1234',
    port: 5432,
  })
  client.connect()
  client.query("INSERT INTO url_status(url_name,status) VALUES('" + req.body.add_url + "','closing')", (err, result) => {
    if (err) {
      console.log("Error");
      console.log(err)
    }
  });
  client.query("SELECT * FROM url_status", (err, result) => {
    if (err) {
      console.log("Error");
      console.log(err)
    }
    res.render('index', { urls: result.rows });
    console.log(req.body);
    client.end()
  });
})
app.post('/del', (req, res) => {
  const { Pool, Client } = require('pg')
  const pool = new Pool({
    user: 'user1',
    host: 'localhost',
    database: 'my_database',
    password: 'abc1234',
    port: 5432,
  })
  const client = new Client({
    user: 'user1',
    host: 'localhost',
    database: 'my_database',
    password: 'abc1234',
    port: 5432,
  })
  client.connect()
  client.query("DELETE  FROM url_status WHERE id = " + req.body.url_delete + "", (err, result) => {
    if (err) {
      console.log("Error");
      console.log(err)
    }
  });
  client.query("SELECT * FROM url_status", (err, result) => {
    if (err) {
      console.log("Error");
      console.log(err)
    }
    res.render('index', { urls: result.rows });
    console.log(req.body);
    client.end()
  });
})

app.get('/status', (req, res) => {
  const { Pool, Client } = require('pg')
  const pool = new Pool({
    user: 'user1',
    host: 'localhost',
    database: 'my_database',
    password: 'abc1234',
    port: 5432,
  })
  const client = new Client({
    user: 'user1',
    host: 'localhost',
    database: 'my_database',
    password: 'abc1234',
    port: 5432,
  })
  client.connect()
  var request = require('request');
  //  client.query("SELECT url_name FROM url_status WHERE id = 2").then((result)=>{
  //    console.log(result.rows[0]['url_name']);
  //    client.query("SELECT id FROM url_status WHERE url_name= $1",[result.rows[0]['url_name']],(error,res)=>{

  //      console.log(res.rows[0]['id'])
  //      client.end();
  //    })
  //  })
  client.query("SELECT url_name FROM url_status").then((res1) => {
    console.log(res1.rows);

    for (let x = 0; x < res1.rows.length; x++) {
      console.log(res1.rows[x]['url_name']);
      console.log(x + "bool");
      var link=""+res1.rows[x]['url_name'];
      console.log("https://www.google.com"+"  "+link);
      console.log("https://www.google.com" == link)
      request.get(link, function (error, response, body) {
        if (error || response === null) {
          console.log("Closing");
          client.query("UPDATE url_status SET status='closing' WHERE url_name=$1", [res1.rows[x]['url_name']], (err, temp) => {
            if (err)
              console.log(err);
          });
        }
        else if (response.statusCode == 200) {
          console.log("running");
          client.query("UPDATE url_status SET status='running' WHERE url_name=$1", [res1.rows[x]['url_name']], (err, temp) => {
            if (err)
              console.log(err);
          });
        }
        else {
          console.log("Closing else ")
          client.query("UPDATE url_status SET status='closing' WHERE url_name=$1", [res1.rows[x]['url_name']], (err, temp) => {

          });
        }
        if(x+1==res1.rows.length){
          client.query("SELECT * FROM url_status", (err, result) => {
            if (err) {
              console.log("Error");
              console.log(err)
            }
            res.render('index', { urls: result.rows });
            console.log(result.rows);
            client.end()
          });
        }
      })
      
      



    }
    


  })
 



})

app.post('/edit',(req,res)=>{
  const { Pool, Client } = require('pg')
  const pool = new Pool({
    user: 'user1',
    host: 'localhost',
    database: 'my_database',
    password: 'abc1234',
    port: 5432,
  })
  const client = new Client({
    user: 'user1',
    host: 'localhost',
    database: 'my_database',
    password: 'abc1234',
    port: 5432,
  })
  client.connect();
  console.log(req.body.edited_url_id);
  const values = [req.body.edited_url,req.body.edited_url_id]
  console.log(req.body.edited_url);
  client.query("UPDATE url_status SET url_name=$1,status='closing' WHERE id=$2",values,(err,result1)=>{
    console.log("hello");
    if(err){
      console.log(err);
    }
    })
      client.query("SELECT * FROM url_status",(err,response)=>{
        console.log("reached now")
        if(err){
          console.log(err);
        }
        res.render('index',{urls:response.rows});
        client.end();
    })
})

app.listen(3000, () => {
  console.log("Server started");
})

