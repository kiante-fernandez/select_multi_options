// --- LOAD MODULES
const fs = require("fs");
const fetch = import("node-fetch");
const ejs = require("ejs");
// const { response } = require('express');
const readline = require('readline');
const {google} = require('googleapis');

const path = require('path');
const process = require('process');

var express = require("express"),
    mymods = require("./scripts/mymods.js"),
    body_parser = require("body-parser");
    bowser = require("bowser"); // CommonJS

// --- INSTANTIATE THE APP
var app = express();
const subjects = {};

// --- Database SETUP
const CLIENT_ID = '766132476109-943brm88g0abjas8kl93vpdgbirh6gh1.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
// const REDIRECT_URL = 'https://neuroeconomics.herokuapp.com';
const REDIRECT_URL = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04xDNYRN9D_o7CgYIARAAGAQSNwF-L9IrvNi5g6WVtIprjCF36ey835OvEeer71-lwCFvQVL6EAmbNLYO3tyfjtH0-AwZ9IIE-bQ';
// const ACCESS_TOKEN = 'ya29.a0Aa4xrXNzy99TN4nngl464mzynSe4U2uPdTg3yBvEaQfgvl2DpI1rzyLRSnvxgsd2CPiq7zuZSUt4IW0XGm3gxUf_t2spUG7xAij4siTuSehg13Il0FdP3KBWJkaLzwQd81d16SssYHpsha3pMJ6JDxzE0nf_aCgYKATASARISFQEjDvL9LXmlqdTqiboWb7_a4dik-g0163'

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);
// oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN ,access_token: ACCESS_TOKEN});
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN});

const drive = google.drive({ version: 'v3', auth: oauth2Client });

function writeJSONFile(id,data) {
    try {
    const createStream = fs.createWriteStream(`choosek_exp_${id}.json`);
    const writeStream = fs.createWriteStream(`choosek_exp_${id}.json`);
    writeStream.write(JSON.stringify(data));
    createStream.end();
    writeStream.end();
    } catch (err){
        throw err;
    }
}

async function removeFile(id) {
    try {
    await fs.unlink(`choosek_exp_${id}.json`);
      console.log('filePath was deleted');
    } catch(error) {
        console.error(`Got an error trying to delete the file: ${error.message}`);
    }
};
async function uploadFile(id,data) {
    try{
    await writeJSONFile(id,data);
    // console.log("are we breaking?")
    const response = await drive.files.create({
            requestBody: {
                name: `choosek_exp_${id}.json`, //file name
                mimeType: 'application/json',
                parents: ['18f5ereBSs2AifIQtSV50TzxkP_VCqm5d']
            },
            media: {
                mimeType: 'application/json',
                body: fs.createReadStream(`choosek_exp_${id}.json`),
            },
        });
        // report the response from the request
        console.log(response.data);
       // await removeFile(id);
    }catch (error) {
        //report the error message
        console.log(error.message);
    }
}

// --- STATIC MIDDLEWARE
app.use(express.static(__dirname + '/public'));
app.use("/js", express.static(__dirname + '/js'));
app.use("/scripts", express.static(__dirname + '/scripts'));

// --- BODY PARSING MIDDLEWARE
// app.use(body_parser.json());// to support JSON-encoded bodies

// --- need more memory?
app.use(body_parser.json({limit: '50mb'}));
app.use(body_parser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());

// --- VIEW LOCATIONS. SET UP SERVING STATIC HTML
app.set("views", __dirname + "/public/views");
app.set('img', __dirname + '/public/img');
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

// --- ROUTING
app.get("/", function (request, response) {
    response.render("index.html")
});

app.get("/finish", function(request, response) {
    response.render("finish.html");
});

app.post('/experiment-data', function(request, response) {

    data = request.body;
    id = data[0].subject_id;
    id = id.replace(/'/g, "");
    // var currentdate = new Date();
    // ID_DATE = data[0].ID_DATE;
    // filename = ID_DATE + ".json";
    // foldername = id;
    data = JSON.stringify(data);
    uploadFile(id,data);

    response.end();
    // console.log(DATA_CSV)
});

// --- START THE SERVER
var server = app.listen(process.env.PORT, function(){
    console.log("listening to port %d", server.address().port);
});
