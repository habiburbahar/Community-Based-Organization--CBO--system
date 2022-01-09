const mysql= require('mysql');
const express= require('express');
const bodyParser = require('body-parser');
const path= require('path');

var app= express();



var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'1234',
    database:'employee',
    
});

connection.connect((err)=>{
    if(!err)
    console.log("DB Connection Successful");

    else
    console.log("DB Connection Failed \n Error: "+JSON.stringify(err,undefined,2));
});


//set views file
app.set('views',path.join(__dirname,'views'));
 
//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/index.html'));
   
  });


// Gets to the basic Page
app.get('/employee',(req,res)=>{
    let sql ="SELECT * FROM employeeTable";
    let query= connection.query(sql,(err,rows)=>{
        if (err) throw err;
        res.render('employee_index',{
            title: 'Employee Sheet',
            users:rows
        });


    });
   
});

//See the client //////
app.get('/client',(req,res)=>{
    let sql ="SELECT * FROM clientTable";
    let query= connection.query(sql,(err,rows)=>{
        if (err) throw err;
        res.render('client_index',{
            title: 'Client Sheet',
            clients:rows
        });


    });
   
});

// Add Employee

app.get('/addEmployee',(req,res)=>{
    res.render('employee_add',{
        title: 'User Adding'
    });
})

// Add Client

app.get('/addClient',(req,res)=>{
    res.render('client_add',{
        title: 'Client Adding'
    });
})

// Getting the data and then saving them
app.post('/saveEmployee',(req, res) => { 
    
    let data = {name: req.body.name, designation: req.body.designation, salary: req.body.salary};
    let sql = "INSERT INTO employeeTable SET ?";
    let query = connection.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect('/employee');
    });
});

// Getting the Data and Setting the table for Client
app.post('/saveClient',(req, res) => { 
    let data = {name: req.body.name, city: req.body.city, item: req.body.item,status:req.body.status};
    let sql = "INSERT INTO clientTable SET ?";
    let query = connection.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect('/client');
    });
});




//get the userID
app.get('/edit/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `Select * from employeeTable where id = ${userId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('employee_edit', {
            title : 'Updateing Employee',
            user : result[0]
        });
    });
});

// get the userID for Client
app.get('/clientedit/:clientId',(req, res) => {
    const clientId = req.params.clientId;
    let sql = `Select * from clientTable where id = ${clientId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('client_edit', {
            title : 'Updateing Client',
            client : result[0]
        });
    });
});



// update Employee
app.post('/updateEmployee',(req, res) => {
    const userId = req.body.id;
    let sql = "update employeeTable SET name='"+req.body.name+"',  designation='"+req.body.designation+"',  salary='"+req.body.salary+"' where id ="+userId;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/employee');
    });
});

// update Client
app.post('/updateClient',(req, res) => {
    const clientId = req.body.id;
    let sql = "update clientTable SET name='"+req.body.name+"',  city='"+req.body.city+"',  item='"+req.body.item+"', status='"+req.body.status+"' where id ="+clientId;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/client');
    });
});



//Delete Employee
app.get('/delete/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `DELETE from employeeTable where id = ${userId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/employee');
    });
});

//Delete Client
app.get('/clientdelete/:clientId',(req, res) => {
    const clientId = req.params.clientId;
    let sql = `DELETE from clientTable where id = ${clientId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/client');
    });
});






app.listen(5000,()=>console.log("Express Server running on 5000"));

