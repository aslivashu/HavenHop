const path = require("path");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const review = require("./models/review.js");

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


// Middleware to validate listing data using Joi
const validateListing = (req, res, next) => {
      let {error}= listingSchema.validate(req.body)
     if(error){
        let errMssg= error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMssg);
     } else{
        next();
     }
}


// Set up EJS as the view engine and configure middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));


//index route
app.get("/listings", wrapAsync(async ( req, res)=>{
   const allListings = await Listing.find({});
   res.render("listings/index.ejs", {allListings});
}));


//new route
app.get("/listings/new", wrapAsync(async(req,res)=> {
    res.render("listings/new.ejs");
}
));


//show route
app.get("/listings/:id", wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id.trim());
    res.render("listings/show.ejs", {listing});
}))



//create route
app.post("/listings", validateListing, wrapAsync(async(req,res)=>{
 const newListing = new Listing(req.body.listing);
        await newListing.save();
        console.log("New listing created:", newListing);
        res.redirect('/listings')
    }));



//edit route
app.get("/listings/:id/edit", wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id.trim());
    res.render("listings/edit.ejs", {listing});
}))


//update route
app.put("/listings/:id", validateListing, wrapAsync(async(req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndUpdate(id.trim(), { ...req.body.listing});
    res.redirect(`/listings/${id}`);
}));


//delete route
app.delete("/listings/:id", wrapAsync(async(req, res)=>{
    let {id} = req.params;
    let deleteListing= await Listing.findByIdAndDelete(id.trim());
    console.log("Listing deleted:", deleteListing);
    res.redirect("/listings");
}));


//review route
app.post("/listings/:id/reviews", wrapAsync(async(req,res)=>{
    const {id} = req.params;
    let listing = await Listing.findById(id.trim());
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    
    res.redirect(`/listings/${id}`);
}));

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