const fs = require("fs");
const fetch = import("node-fetch");
const ejs = require("ejs");
const readline = require('readline');
const {google} = require('googleapis');
const path = require('path');
const process = require('process');
const express = require("express");
const body_parser = require("body-parser");
const bowser = require("bowser");

// --- INSTANTIATE THE APP
var app = express();
const subjects = {};

// --- Google Drive Setup using Service Account
async function getGoogleDriveService() {
    try {
        // Get service account credentials from environment variable
        const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT || '{}');
        
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/drive.file']
        });

        return google.drive({ version: 'v3', auth });
    } catch (error) {
        console.error('Error creating Google Drive service:', error);
        throw error;
    }
}

// File handling functions
function writeJSONFile(id, data) {
    try {
        const filePath = `choosek_exp2_${id}.json`;
        fs.writeFileSync(filePath, JSON.stringify(data));
        return filePath;
    } catch (err) {
        console.error('Error writing file:', err);
        throw err;
    }
}

async function removeFile(id) {
    try {
        await fs.promises.unlink(`choosek_exp2_${id}.json`);
        console.log('filePath was deleted');
    } catch (error) {
        console.error(`Got an error trying to delete the file: ${error.message}`);
    }
}

async function uploadFile(id, data) {
    let filePath = null;
    try {
        filePath = writeJSONFile(id, data);
        const driveService = await getGoogleDriveService();

        const response = await driveService.files.create({
            requestBody: {
                name: `choosek_exp2_${id}.json`,
                mimeType: 'application/json',
                parents: ['1RPzlbUqE5H_xaRaqBtsVFXcKMGxqNX6V']
            },
            media: {
                mimeType: 'application/json',
                body: fs.createReadStream(filePath)
            }
        });

        console.log('File uploaded successfully:', response.data);
        await removeFile(id);
        return response.data;
    } catch (error) {
        console.error('Upload error:', error);
        if (filePath) {
            await removeFile(id);
        }
        throw error;
    }
}

// --- MIDDLEWARE SETUP
app.use(express.static(__dirname + '/public'));
app.use("/js", express.static(__dirname + '/js'));
app.use("/scripts", express.static(__dirname + '/scripts'));
app.use(body_parser.json({limit: '50mb'}));
app.use(body_parser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());

// --- VIEW SETUP
app.set("views", __dirname + "/public/views");
app.set('img', __dirname + '/public/img');
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

// --- ROUTES
app.get("/", function (request, response) {
    response.render("index.html");
});

app.get("/finish", function(request, response) {
    response.render("finish.html");
});

app.post('/experiment-data', async function(request, response) {
    try {
        const data = request.body;
        const id = data[0].subject_id.replace(/'/g, "");
        await uploadFile(id, data);
        response.status(200).json({ message: 'Data uploaded successfully' });
    } catch (error) {
        console.error('Error handling experiment data:', error);
        response.status(500).json({ 
            error: 'Failed to upload data',
            details: error.message 
        });
    }
});

// Add a test endpoint to verify drive connection
app.get('/test-drive-connection', async (req, res) => {
    try {
        const driveService = await getGoogleDriveService();
        const testData = { test: 'Connection successful', timestamp: new Date().toISOString() };
        const testId = 'test-' + Date.now();
        await uploadFile(testId, testData);
        res.json({ status: 'success', message: 'Test file uploaded successfully' });
    } catch (error) {
        console.error('Test connection error:', error);
        res.status(500).json({ 
            status: 'error', 
            message: error.message,
            details: error.toString()
        });
    }
});

// --- START THE SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log("listening to port %d", PORT);
});