"use strict";

var express = require("express");
var bodyParser = require("body-parser");
var expect = require("chai").expect;
var cors = require("cors");
var helmet = require("helmet");
var mongoose = require("mongoose");
var dotenv = require("dotenv");

var apiRoutes = require("./routes/api.js");
var fccTestingRoutes = require("./routes/fcctesting.js");
var runner = require("./test-runner");

var app = express();

dotenv.config();

mongoose.connect(process.env.DB, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

var db = mongoose.connection;

db.on("error", function dbError(err) {
  console.log("Error connecting to database");
  console.log(err);
});

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'selfl"],
      styleSrc: ["'self'"]
    }
  })
);

app.use("/public", express.static(process.cwd() + "/public"));

app.use(cors({ origin: "*" })); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Index page (static HTML)
app.route("/").get(function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API
apiRoutes(app);

//404 Not Found Middleware
app.use(function(req, res, next) {
  res
    .status(404)
    .type("text")
    .send("Not Found");
});


//Wait for database to connect
db.once("open", function dbOpen() {
  console.log('Database connection established');
  //Start our server and tests!
  app.listen(process.env.PORT || 3000, function() {
    console.log("Listening on port " + (process.env.PORT || 3000));
    if (process.env.NODE_ENV === "test") {
      console.log("Running Tests...");
      setTimeout(function() {
        try {
          runner.run();
        } catch (e) {
          var error = e;
          console.log("Tests are not valid:");
          console.log(error);
        }
      }, 3500);
    }
  });
});

module.exports = app; //for testing
