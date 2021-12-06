// --- LOAD MODULES
var express = require("express");


// --- INSTANTIATE THE APP
var app = express();

// --- STATIC MIDDLEWARE
app.use(express.static(__dirname + '/public'));
app.use("/js", express.static(__dirname + '/js'));
app.use("/scripts", express.static(__dirname + '/scripts'));

// --- VIEW LOCATIONS. SET UP SERVING STATIC HTML
app.set("views", __dirname + "/public/views");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

// --- ROUTING
app.get("/", function (request, response) {
    response.render("index.html")
});

// --- START THE SERVER process.env.PORT
var server = app.listen(3000, function(){
    console.log("listening to port %d", server.address().port);
});
