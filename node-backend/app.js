
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
    completed_date: Date,
    ownedBy: String
});


var projectSchema = new mongoose.Schema({
    project_name: String,
    manager_name: String,
    no_of_members: Number,
    member_names: Array
});
/**define model */

var User = mongoose.model("DataInput", nameSchema);

var ProjectData = mongoose.model("project_data", projectSchema);


/**saving data */

app.post("/addname", (req, res) => {
    var myData = new User(req.body);
    myData.save()
        .then(item => {
            res.json({ save: true })
        })
        .catch(err => {
            res.status(400).json({ save: false })
        });
});

/**retrievinf data */

app.get('/addname', (req,res,next)=>{
    User.find(function(err,items){
        // Sending to client in json format
        res.json({created_date:created_date},items); 
    });
});

/** get project details data */
app.get('/getprojectdata', (req,res,next)=>{
    ProjectData.find(function(err,getAlldataProject){
        // Sending to client in json format
        res.json(getAlldataProject); 
    });
});