var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var campGround = require("./models/campground");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var User = require("./models/user"); 
var passport = require("passport");
var localStrategy = require("passport-local");
var methodOverride = require("method-override");
var port = "8000";
var flash = require("connect-flash");

// --------------Routes ------------------
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campground");
var indexRoutes = require("./routes/index");

// to use
mongoose.connect(
  "mongodb://bhanu:number1219@ds229552.mlab.com:29552/yelpcampbybhanu", {
    useNewUrlParser: true
  }
);

app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seed database->
// seedDB();

// passport uses ->
app.use(require("express-session")({
  secret: "Once again Rusty wins cutest dog!",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middle ware 
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use("/", indexRoutes);
app.use("/campground", campgroundRoutes);
app.use("/campground/:id/comments", commentRoutes);

app.listen(port, function () {
  console.log("Yelp camp Server has started let's rock");
});