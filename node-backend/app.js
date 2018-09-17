
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
    date_created:String
});


var projectSchema = new mongoose.Schema({
    project_name: String,
    manager_name: String,
    no_of_members: Number,
    member_names: Array
});
/**define model */

var User = mongoose.model("DataInput", nameSchema);

var ProjectData = mongoose.model("projectdata", projectSchema);


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
    myData.save()
        .then(item => {
            User.find({ date_created: getTodayDate()},(err,items) => {
                console.log(err);
                res.json(items);
            })
        })
        .catch(err => {
            res.status(400).json({ save: false })
        });
});

/**retrieving data */

app.get('/getallData', (req,res)=>{
    User.find({ date_created: getTodayDate()},(err,items) => {
        console.log(err);
        res.json(items);
    })
});

/** get project details data */
app.get('/getprojectdata', (req,res)=>{
    ProjectData.find(function(err,items){
        // Sending to client in json format
        console.log(err);
        res.json(items); 
    });
});