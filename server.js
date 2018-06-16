
var express = require("express");
var bodyParser = require("body-parser");
// var logger = require("morgan");
// var mongoose = require("mongoose");

const request = require("request"); //allows us to make http requests. ...snatches html from urls. 
const cheerio = require("cheerio"); // scrapes our html


var app = express();

var port = process.env.PORT || 3000;

//app.use(bodyParser.urlencoded({
//     extended: false
//   }));

// Make public a static dir
//app.use(express.static("public"));


//Routes


// make a GET request call to scrape from npr website
// *** the page's html gets saved as the callbacks 3rd argument
//app.get("/scrape", function (req, res) {

//First, we grab the body of the html with request
request( "https://www.indeed.com/viewjob?jk=1a458ea9a024827f&tk=1cftbag4ra4ohb3o&from=serp&alid=3&advn=6089941816320507", function(err, response, html) {

    if (err) console.log(err);
    //load the html into cheerio and save it to a var
    //"$" becomes a shorthand for cheerio's selector command
    var $ = cheerio.load(html);
   
    var results = [];
    var companyName = $(".company");
    var companyNameText = companyName.text();

    var jobTitle = $(".jobtitle font");
    var jobTitleText= jobTitle.text();

    var location =$(".location")
    var locationText = location.text();

    var summary = $("#job_summary p");
    var summaryText= summary.text();

     results.push ({
        jobTitle: jobTitleText,
        location: locationText,
        companyName:companyNameText,
        summary: summaryText,
        
    });
    //$(".company").filter(function(){
        // var companyName = $(this);
        // companyNameText = companyName.text();
    
    console.log(results);
    // an empty array to save the date that we'll scrape
    //var results = [];

    //with cheerio, find each p-tag with a "title" class
    // (i: iterator. element; the current element)
    //$("title.").each(function(i, element) {
        
         
        // save the text of the element (this) in a "title" variable
        //in the currently selected element,
        //look at its child elements
        //then save the values for any "href" attirbutes
        // that the child elements may havevar link  = $(image).children().attr("href");
        //var title = $(element).children().text();
        
        
       

        //var imgLink = $(element).find("a").find("img").attr("src");

        //save these results in an object that we'll push
        //into the result array we defined earlier
       // result.push ({
            //title: title,
            //link: link,
            //link: imgLink
       // });
//     });
//     console.log(results);
 })


 app.listen(port);
 console.log("server running on " + port);

