const express =require('express');
const morgan = require('morgan');
const { Pool } = require('pg');
const dotenv = require('dotenv');

const credentials = {
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "1323",
    port: 5432,
  };

dotenv.config();
const app = express();
const serverport = process.env.PORT;

const pool = new Pool(credentials);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//routes to display client side
app.get('/', (req,res) => {
    res.send(`
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body style="margin-left: 10%;">
<p>Click to retrieve data:</p>
   <form action="/retrieve" method="get"> 
   <input type="submit" value="Get">
   </form>
   <br>
   <form action="/insert" method="post">
   <p>Post to database below:</p> 
   <input type="text" name="insertfirst" placeholder="Enter firstname"><br><br>
   <input type="text" name="insertlast"  placeholder="Enter lastname">
   <input type="submit" name="add" id ="add" value="add">
   
   </form>
   <form action="/delete" method="post"> 

   <p>Delete below:</p>
   <input type="text" name="deleteId"  placeholder="Delete by id">
   <input type="submit" name="add" id ="add" value="Delete">
   
   </form>
   <form action="/update" method="post"> 

   <p>Update below:</p>
   <input type="text" name="insertfirst" placeholder="Enter firstname"><br><br>
   <input type="text" name="insertlast"  placeholder="Enter lastname">
   <input type="submit" name="add" id ="add" value="Update">

</body>
</html>
    `);
});

app.get('/retrieve', (req, res) => {
    try{
        pool.connect(async (error, client, release) => {
            let resp = await client.query('select * from test');
            res.send(resp.rows);
        })

    }catch(error){
        console.log(error);
    }
});
//route to insert
app.post('/insert', (req, res) => {
    let firstname =req.body.insertfirst;
    let lastname =req.body.insertlast;
    try{
        pool.connect(async (error, client, release) => {
            let resp = await client.query(`insert into test(firstname,lastname) values('${firstname}','${lastname}')`);
            res.redirect('/retrieve');
        })

    }catch(error){
        console.log(error);
    }
});
//route to delete
app.post('/delete', (req, res) => {
    let id =req.body.deleteId;
    
    try{
        pool.connect(async (error, client, release) => {
            let resp = await client.query(`DELETE FROM test where id =${id}`);
            res.redirect('/retrieve');
        })

    }catch(error){
        console.log(error);
    }
});
//route to update
app.post('/update', (req, res) => {
    let firstname =req.body.insertfirst;
    let lastname =req.body.insertlast;
    
    try{
        pool.connect(async (error, client, release) => {
            let resp = await client.query(`UPDATE test SET firstname='${firstname}'`);
            res.redirect('/retrieve');
        })

    }catch(error){
        console.log(error);
    }
});
app.listen(3000, () => {
    console.log(`Server running on port:`+serverport);
})