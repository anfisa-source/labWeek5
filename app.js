let express = require('express');
let app = express();
let bodyParser=require("body-parser");
let ejs =require("ejs");
db = new Array();


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
    db.push(req.body)
    //res.send("Task submitted")
});

app.get("/listTasks", (req,res)=>{
    res.render(showView + "listAllTasks.html", data = db)
});

app.listen(8080);