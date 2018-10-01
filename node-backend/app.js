
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');
var smtpTransport = require('nodemailer-smtp-transport');

var statusId = 0;
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

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
    });

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
    manager_name: String,
    date_created:String,
    project_name:String,
    statusId:Number
});


var projectSchema = new mongoose.Schema({
    project_name: String,
    manager_name: String,
    no_of_members: Number,
    date_created: String,
    member_names: Array
});

var loginSchema = new mongoose.Schema({
    username: String,
    date_created:String
});



var User = mongoose.model("DataInput", nameSchema);

var ProjectData = mongoose.model("projectdata", projectSchema,"projectdata");

var PostProjectData = mongoose.model("projectdata", projectSchema,"projectdata");

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
    let project_name = req.body.project_name;
    statusId++;
    let newParam = Object.assign({'statusId':statusId} , req.body );
    var myData = new User(newParam);
    console.log("myData" + JSON.stringify(myData));
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

/** add project data */
app.post("/postprojectdata", (req, res) => {
    var newDataPost = new PostProjectData(req.body);
    newDataPost.save()
        .then(item => {
            res.status(200).json({ saved: true})
        })
        .catch(err => {
            res.status(400).json({ save: false })
        });
});

/**retrieving all status data */

app.get('/getallData/:project_name', (req,res)=>{
    let project_name = req.params.project_name;
    User.find({ date_created: getTodayDate(),project_name:project_name},(err,items) => {
        //console.log(err);
        res.json(items);
    })
});

/** get project details data */
app.get('/getprojectdata/:username', (req,res)=>{
    let username = req.params.username;
    ProjectData.find({ "member_names": username}, function(err,items){
       // console.log(err);
        res.json(items); 
    });
});

/** delete node */

app.delete('/deleterecord/:_id', (req,res) =>{
console.log("Reqyest param" + req.params._id)
  User.findByIdAndRemove(req.params._id , (err,data) => {
      res.status(200).send(data);
    if(!err){
        console.log("Deleted");
    } else{
        console.log("Error deleting" + err)
    }
  })
});

/** update node with statusId */

app.put('/:_id/updatestatus', (req,res) => {
    let id = req.params._id;
    User.findByIdAndUpdate(id, { $set : {
        description: req.body.description,
        percentage_completion: req.body.percentage_completion,
        completed_date: req.body.completed_date
    }}, (err,data) => {
        if(err) {
            console.log("Error in update" + id);
        }
        res.send('Status udpated.');
    })
});

/**send email */
app.post("/sendemail", (req, res) => {
    let to = req.body.to;
    let htmlbody = req.body.htmlbody;
// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
nodemailer.createTestAccount((err, account) => {
    var transport = nodemailer.createTransport(smtpTransport({
        service: "Gmail",
        auth: {
            xoauth2: xoauth2.createXOAuth2Generator({
            user: "hpedevelopers@gmail.com", // Your gmail address.
            clientId: "962313790379-nrolctif9dpprl4t94l4mpa9guiss9aa.apps.googleusercontent.com",
            clientSecret: "4n-E5Lh1SiwgXqlWFUTUIpGq",
            refreshToken: "1/KMeEjt5C5NVhVW4nNywnSwbyXbt1HM6cVEbK-rlbDX0F318BqbD9ZxUu79ZoBweR",
            access_token: "ya29.GlwdBpIQnFFjAiEsxPq3VxVa88itxCCMWlQpsqxOgTCAGwIYRcfEkHEx7IhjQj6ypwF1jjTq5TNtLvWG0vPZoWRLJx18fHXsWkEzQgdvNF9-RywCSpV6zh8SesIxhQ"
          })
        }
      }));

    // setup email data with unicode symbols
    let mailOptions = {
        from: 'hpedevelopers@gmail.com', // sender address
        to: to, // list of receivers
        subject: 'Test email to send email', // Subject line
        text: 'Hello world?', // plain text body
        html: htmlbody // html body
    };

    // send mail with defined transport object
    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        res.status(200).json({sendemail :true});
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
});

});