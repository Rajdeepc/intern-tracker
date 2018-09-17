
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();



/**connection string to db */
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/nodedemo");

//on error
mongoose.connection.on('error', (err) => {
    if (err) {
        console.log("Failed to established a connection " + err);
    }
});

const port = 3000;

//Adding middleware -cors
app.use(cors());

/**body parser */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**starting route */
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

//port no

app.listen(port, () => {
    console.log('App is listening on' + port)
});

/**define our schema */
var nameSchema = new mongoose.Schema({
    description: String,
    percentage_completion: Number,
    completed_date: String,
    ownedBy: String,
    date_created:String,
    project_name:String
});


var projectSchema = new mongoose.Schema({
    project_name: String,
    manager_name: String,
    no_of_members: Number,
    member_names: Array
});

var loginSchema = new mongoose.Schema({
    username: String,
    date_created:String
});


var User = mongoose.model("DataInput", nameSchema);

var ProjectData = mongoose.model("projectdata", projectSchema,"projectdata");

var LoginData = mongoose.model("logindata", loginSchema);


/**saving status data*/
function getTodayDate(){
    let newDate = new Date();
    let mm = newDate.getMonth() + 1;
    let dd = newDate.getDate();
    let yyyy = newDate.getFullYear();
    let date = mm + "/" + dd + "/" + yyyy;
    return date;
}
app.post("/addname", (req, res) => {
    var myData = new User(req.body);
    let project_name = req.body.project_name;
    myData.save()
        .then(item => {
            res.json({saved:true});
        })
        .catch(err => {
            res.status(400).json({ save: false })
        });
});

/**saving to db login credentials */
app.post("/login", (req, res) => {
    var newData = new LoginData(req.body);
    newData.save()
        .then(item => {
            res.status(200).json({ saved: true})
        })
        .catch(err => {
            res.status(400).json({ save: false })
        });
});

/**retrieving data */

app.get('/getallData/:project_name', (req,res)=>{
    let project_name = req.params.project_name;
    User.find({ date_created: getTodayDate(),project_name:project_name},(err,items) => {
        console.log(err);
        res.json(items);
    })
});

/** get project details data */
app.get('/getprojectdata/:username', (req,res)=>{
    let username = req.params.username;
    ProjectData.find({ "member_names.name": username}, function(err,items){
        console.log(err);
        res.json(items); 
    });
});
