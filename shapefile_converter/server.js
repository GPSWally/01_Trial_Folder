
// $ npm init

// $ npm install --save express

var express = require("express");

var app = express();

var fs = require("fs");

var shp = require("../shapefile-js-gh-pages/lib/index.js");
 
var tokml = require("tokml")

var PORT = process.env.port || 8000;

// if we want to handle post requests

// $ npm install --save body-parser

var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// if we want to handle session (login, etc)

// $ npm install --save express-session


//do this for every request
app.use(function(req, res, next) {
	console.log(req.url);
	next();
});

/*
// kml is a string of KML data, geojsonObject is a JavaScript object of 
// GeoJSON data 
var kml = tokml(geojsonObject);
 
// grab name and description properties from each object and write them in 
// KML 
var kmlNameDescription = tokml(geojsonObject, {
    name: 'name',
    description: 'description'
});
 
// name and describe the KML document as a whole 
var kmlDocumentName = tokml(geojsonObject, {
    documentName: 'My List Of Markers',
    documentDescription: "One of the many places you are not I am"
});
*/

app.get("/shapefile", function(req, res){
	console.log("creating a geoJSON");
	shp("soilmu_a_aoi").then(function(geojson){
        var geoJSONfn = "./soilmu_a_aoi.json";
        fs.writeFile(geoJSONfn, JSON.stringify(geojson), function(err){
        	if (err){
        		res.send("error didn't write file");
        	} else {
        		res.send("created a geoJSON file");
        		console.log("a geoJSON file should have been created.");
        	}
        });
    }, function(err){
    	console.log(err);
    	res.send("err");
    });
});

app.get("/geoJSONfile", function(req, res){
    console.log("creating a kml");
    geoJSON = fs.readFile("./soilmu_a_aoi.json", 'utf8', function(err, data){
        console.log(data);
        if (err) {
            res.send("error reading geoJSON file");
        } else {
            var kml = tokml(data.toString());
            fs.writeFile("./thisMy.kml", kml, function(err){
                if (err) {
                    res.send("error creating kml");
                } else {
                    res.send("create kml from from geoJSON");
                }
            });
        }
    });
});


// if we want to respond to GET requests for "/"
app.get("/", function(req, res) {
	res.sendFile(__dirname + "/index.html");
});

// if we want to respond to POST requests for "/api"
app.post("/api", function(req, res) {
	res.send("success");
});

// if we want to serve static files out of ./public
app.use(express.static("public"));

// actually start the server
app.listen(PORT, function() {
	console.log("Listening on port " + PORT);
});

