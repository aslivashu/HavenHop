const path = require("path");
const express = require("express");
const app = express();

const mongoose = require("mongoose");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const sessionOptions ={
    secret: "thisshouldbeabettersecret!",
    resave: false,
    saveUninitialized: true,
}

const ExpressError = require("./utils/ExpressError.js");

const reviews = require("./routes/reviews.js");
const listings = require("./routes/listing.js");



// MongoDB connection
const Mongo_URL = "mongodb://localhost:27017/HavenHop";

// Connect to MongoDB
main().then(() => {
    console.log ("connected to DB");
}).catch(err => console.log(err));

// Function to connect to MongoDB
async function main(){
    await mongoose.connect(Mongo_URL);
}



// Middleware to parse request bodies
app.get("/", (req, res) => { 
  res.send("Hi, welcome to HavenHop!");
}); 

// Set up EJS as the view engine and configure middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(cookieParser());
app.use(session(sessionOptions));

//listing routes
app.use("/listings", listings);
//review routes
app.use("/listings/:id/reviews", reviews);



// Error handling middleware
app.use((err, req, res, next)=>{
    const {statusCode=500, message= "Something went wrong"} = err;
    res.render("error.ejs", {statusCode, message});
});

// Catch-all route for handling 404 errors
app.all("/*splat", (req, res, next)=>{
    next(new ExpressError(404, "Page Not Found"));
});



//server listening
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});