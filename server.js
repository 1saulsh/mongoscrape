//Dependencies
var express = require('express');
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var logger = require("morgan");

//require note and article models
// var Note = require("./models/note.js");
// var Article = require ("./models/article.js");

//Scraping tools
var request = require('request');
var axios = require ("axios");
var cheerio = require('cheerio');

var db = require("./models");

//set mongoose to leverage built in ES6 promises
mongoose.Promise = Promise;

var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/mongoscrape");



//once logged in to  the db through mongoose, log a success message
// db.once("open", function() {
//   console.log ("Mongoose connection successful.");
// });

//Routes

//A GET request to scrape the echojs website
app.get("scrape", function(req, res) {

//First, we grab the body of the html with the request
axios.get ("http://www.echojs.com/").then(function(response)
{
  
//Then, we load that in cheerio and save it to $ for a shorthand selector
  var $ = cheerio.load(data);
  
//Now, we grab every h2 within an article tag, and do the following
$("article h2").each(function(i, element) {


//save an empty result object
var result = {};

//Add the text and href of every link, and save them as properties of teh result object
result.title = $(this).children("a").text();
resullt.link = $(this).children("a").attr("href");

//using our Article model, create a new entry
//this passes the result object to the entry (and he title and link)
var entry = new Article(result);

//Now, save that entry to the db
entry.save(function(err, doc) {
  //log errors
  if (err) {
    console.log(err);
  }
  // or log the document
  else { 
    console.log(doc);
  }
});
});
});

//Tell the browser that scraping the text is complete
res.send("Scrape Complete");
});
//This will get the articles scraped from the mongoDB
app.get("/articles", function (req, res) {
  //Grab evey doc in the articles array
  Article.find({}, function(error, doc) {
    //Log any errors
    if (error) {
      console.log(error);
    }
    //or send the doc to the browser as a JSON object
    else {
      res.json(doc);
    }
  })
});

//grab an article by it's obeject ID
app.get("artilces/:id", function(req, res) {
  //using the id passed in teh id parametr, get a query that finds the matching one in db
  Article.findOne({"_id": req.params.id})
  //add populate notes associated with it
  populate("note")
  //execute query
  .exec(function(error, doc){
    //log errors
    if(error) {
      console.log(error);
    }
    //send document to the browser as JSON object
    else{
      res.json(doc);
    }
  });
});


//create a new note or replace existing note
app.post("/articles/:id", function (req, res) {
  //create a new note and pass the req.body to the entry
  var newNote = new Note (req.body);

  newNote.save(function (err,data) {
    if (err) {
      console.log(err);
    }
    //or log the doc
    else {
      console.log(data);
      Article.update( {"_id": req.params.id}, { $set: {note: data.id} })
      .exec(function(err,data) {
        if (err) {
          console.log(err);
          res.send(err);
        }
        else {
          res.send(data)
    }
  });
}
})
});
//Listen on port 3000
app.listen (3000, function() {
  console.log("App is running on Port 3000");

})