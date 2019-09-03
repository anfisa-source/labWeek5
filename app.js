let express = require('express');
let app = express();
let bodyParser=require("body-parser");
let ejs =require("ejs");

//db = new Array();
let mongodb = require('mongodb');
let mongoDBClient = mongodb.MongoClient;

let db = null;
let col = null;
let url = "mongodb://localhost:27017";
mongoDBClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (err, client) {

    db = client.db("week6");
    col = db.collection("tasks");
    console.log("Connected");

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

app.get("/addTask", (req,res)=>{
    res.sendFile(showView + "addNewTask.html")
});

app.post("/addNewTask", (req,res) => {
    console.log(req.body)
    let newtask = req.body;
    col.insertOne({ name: newtask.name, assign: newtask.assign, due: newtask.due, status: newtask.status, desc: newtask.desc });
    res.redirect('/listTasks');
    //res.send("Task submitted")
});

app.get("/listTasks", (req,res)=>{
    col.find({}).toArray(function (err, data) {
        res.render(showView +'listAllTasks', { col: data });
    });
});



app.get('/deletetask', function (req, res) {
    res.sendFile(showView + 'deletetask.html');
});

app.post('/deletetaskdata', function (req, res) {
    let task2del = req.body;
    console.log(task2del);
    let filter = { "_id" : task2del._id };
    col.deleteOne(filter);
    res.redirect('/listTasks');
});


app.get('/deleteall', function (req, res) {
    col.deleteMany({});
    res.redirect('/listTasks');

});

app.listen(8080);