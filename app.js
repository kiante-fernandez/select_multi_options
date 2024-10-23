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

// --- OAuth2 SETUP
const CLIENT_ID = '228376881552-hrg29htnkq46t0t8ql91uhe4o291tkjr.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URL = 'https://select-multi-options.herokuapp.com/oauth2callback';
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

// Initialize OAuth2 client
const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
);

// Store tokens in memory (in production, consider using environment variables or a database)
let tokens = null;

// Add OAuth routes
app.get('/auth', (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent'  // Forces refresh token generation
    });
    res.redirect(authUrl);
});

app.get('/oauth2callback', async (req, res) => {
    const { code } = req.query;
    try {
        const { tokens: newTokens } = await oauth2Client.getToken(code);
        tokens = newTokens;
        oauth2Client.setCredentials(tokens);
        res.send('Authentication successful! You can close this window.');
    } catch (error) {
        console.error('Error getting tokens:', error);
        res.status(400).send('Authentication failed!');
    }
});

// Token refresh middleware
async function ensureValidToken() {
    if (!tokens) {
        throw new Error('No tokens available. Please authenticate first.');
    }

    const isTokenExpired = tokens.expiry_date && tokens.expiry_date <= Date.now();
    if (isTokenExpired) {
        try {
            const response = await oauth2Client.refreshToken(tokens.refresh_token);
            tokens = response.credentials;
            oauth2Client.setCredentials(tokens);
        } catch (error) {
            console.error('Error refreshing token:', error);
            throw new Error('Failed to refresh token. Please authenticate again.');
        }
    }
}

// File handling functions
function writeJSONFile(id, data) {
    try {
        const filePath = `choosek_exp2_${id}.json`;
        fs.writeFileSync(filePath, JSON.stringify(data));
    } catch (err) {
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
    try {
        await ensureValidToken();
        await writeJSONFile(id, data);

        const drive = google.drive({ version: 'v3', auth: oauth2Client });
        const filePath = `choosek_exp2_${id}.json`;

        const response = await drive.files.create({
            requestBody: {
                name: filePath,
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
        if (error.message.includes('invalid_grant')) {
            throw new Error('Authentication expired. Please authenticate again at /auth');
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
        if (error.message.includes('authenticate')) {
            response.status(401).json({ 
                error: 'Authentication required',
                authUrl: '/auth'
            });
        } else {
            response.status(500).json({ 
                error: 'Failed to upload data',
                details: error.message 
            });
        }
    }
});

// --- START THE SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log("listening to port %d", PORT);
});