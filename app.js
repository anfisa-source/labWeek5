let express = require('express');
let app = express();
let bodyParser=require("body-parser");
// let ejs =require("ejs");
//var mongodb = require('mongoDB');
const mongoose = require('mongoose');
//let mongoClient = mongodb.MongoClient;
let Task = require('./models/task');
let Developer = require('./models/developer');

let col = null;
let url = "mongodb://localhost:27017/week6";
mongoose.connect(url, function (err) {
    if (err) console.log(err);
    else {
        console.log('Connected');
    }

});



app.use(express.static('img'));
app.use(express.static('css'));

app.use(bodyParser.urlencoded({
    extended: false
}));

app.engine("html", require('ejs').renderFile);
app.set("view engine", "html");

let showView = __dirname + "/html/"

app.get("/", (req,res) => {
    res.sendFile(showView+ "index.html");
});


app.get("/addDeveloper", (req,res)=>{
    res.sendFile(showView + "addNewDeveloper.html")
});

app.post("/addNewDeveloper", (req,res) => {
    console.log(req.body)
    let newdev = req.body;
    let dev1 = new Developer({
        _id: new mongoose.Types.ObjectId(),
        name: {
            firstName: newdev.firstname,
            lastName: newdev.lastname
        },
        level: newdev.level,
        address:{
            state: newdev.state,
            suburb: newdev.suburb,
            street: newdev.street,
            unit: newdev.unit
        }
    });
    dev1.save(function(err){
        if (err) throw err;
        console.log("dev added");
    });   
    res.redirect('/');
    //res.send("Task submitted")
});

app.get("/listDevs", (req,res)=>{
    Developer.find().exec(function (err, data) {
        res.render(showView +'listAllDevs', {data: data});
    });
});



app.get("/addTask", (req,res)=>{
    res.sendFile(showView + "addNewTask.html")
});

app.post("/addNewTask", (req,res) => {
    console.log(req.body)
    let newtask = req.body;
    
    res.redirect('/listTasks');
    //res.send("Task submitted")
    let task1 = new Task({
        _id: new mongoose.Types.ObjectId(),
        name: newtask.name,
        assign: mongoose.Types.ObjectId(newtask._id),
        due: newtask.due,
        status: newtask.status,
        desc: newtask.desc

    });
    task1.save(function (err) {
        if (err) throw err;
        console.log("task added");
    });
});

app.get("/listTasks", (req,res)=>{
    Task.find().exec(function (err, data) {
        res.render(showView +'listAllTasks', {data: data});
    });
});



app.get('/deletetask', function (req, res) {
    res.sendFile(showView + 'deletetask.html');
});

app.post('/deletetaskdata', function (req, res) {
    let task2del = req.body;
    console.log(task2del);
    let filter = { "_id" : mongoose.Types.ObjectId(task2del._id) };
    Task.deleteOne(filter, function( err, doc){
        console.log(doc);
    });
    res.redirect('/listTasks');
});


app.get('/deleteall', function (req, res) {
    Task.deleteMany({status: "COMPLETE"}, function(err,doc){
        if (err) throw err;
        console.log(doc);
    });
    res.redirect('/listTasks');

});


app.get('/updatestatus', function (req, res) {
    res.sendFile(showView + 'updatestatus.html');
});

app.post("/updatestatustask", function (req,res){
    let newDetail = req.body;
    let filter = {"_id" : mongoose.Types.ObjectId(newDetail._id)};
    Task.updateOne(filter, {$set: {status : newDetail.status}}, function (err,doc){
        console.log(doc);
    });
    res.redirect('/listTasks');
})

// app.get('/deleteOldComplete', function(req,res){

    
//     let filter = {status: "Complete", due: {$lt:"2019-09-03"}};
//     col.deleteMany(filter, function(err,obj){
//     });
//     res.redirect('/listTasks');
// });

app.listen(8080);