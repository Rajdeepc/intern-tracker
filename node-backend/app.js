
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');
var smtpTransport = require('nodemailer-smtp-transport');


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
    ownedBy: String,
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
    ProjectData.find({ "member_names": username}, function(err,items){
        console.log(err);
        res.json(items); 
    });
});


/** get project details data */
// app.get('/getlogs', (req,res)=>{
//     GetConverse.find({  }, function(err,items){
//         let itemofConverse = getConverseDatabyUtt(items);
//         res.json(itemofConverse); 
//     });
// });

// function getConverseDatabyUtt(items){
//     let newArr = [];
//     items.map((item, index) => {
//         if(item.text && item.text.startsWith("Sorry, I didn't understand.")) {
//             newArr.push(index);
//         }
//     });
//     let utteranceArr = [];
//     newArr.map((sorryindex) => {
//         utteranceArr.push(items[sorryindex - 1]);
//     });
//     return utteranceArr;
// }
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