const path = require("path");
const express = require("express");
const app = express();

const mongoose = require("mongoose");

const Listing = require("./models/listing.js");
const review = require("./models/review.js");
const {listingSchema, reviewSchema} = require("./schema.js");


const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const wrapAsync = require("./utils/wrapAsync.js");
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
  res.send("Hello, World!");
}); 


// Set up EJS as the view engine and configure middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

//listing routes
app.use("/listings", listings);
//review routes
app.use("/listings/:id/reviews", reviews);




// app.get("/testlisting", async(req, res)=>{
//     let sampleTesting= new Listing({
//         title: "newtitle",
//         description: "newdescription",
//     });
//     await sampleTesting.save();
//     res.send("Listing saved!");
//     console.log("Listing saved!");
// });


app.all("/*splat", (req, res, next)=>{
    next(new ExpressError(404, "Page Not Found"));
});


app.use((err, req, res, next)=>{
    const {statusCode=500, message= "Something went wrong"} = err;
    res.render("error.ejs", {statusCode, message});
});


//server listening
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});