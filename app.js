const path = require("path");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");


// MongoDB connection
const Mongo_URL = "mongodb://localhost:27017/HavenHop";

// Connect to MongoDB
main().then(() => {
    console.log ("connected to DB");
}).catch(err => console.log(err));

// Start the server
async function main(){
    await mongoose.connect(Mongo_URL);
}
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


//index route
app.get("/listings", async ( req, res)=>{
   const allListings = await Listing.find({});
   res.render("listings/index.ejs", {allListings});
});


//new route
app.get("/listings/new", async(req,res)=> {
    res.render("listings/new.ejs");
}
);


//show route
app.get("/listings/:id", async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id.trim());
    res.render("listings/show.ejs", {listing});
});



//create route
app.post("/listings", async(req,res)=>{
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        console.log("New listing created:", newListing);
        res.redirect('/listings')
});


//edit route
app.get("/listings/:id/edit", async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id.trim());
    res.render("listings/edit.ejs", {listing});
});


//update route
app.put("/listings/:id", async(req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndUpdate(id.trim(), { ...req.body.listing});
    res.redirect(`/listings/${id}`);
});


//delete route
app.delete("/listings/:id", async(req, res)=>{
    let {id} = req.params;
    let deleteListing= await Listing.findByIdAndDelete(id.trim());
    console.log("Listing deleted:", deleteListing);
    res.redirect("/listings");
})


// app.get("/testlisting", async(req, res)=>{
//     let sampleTesting= new Listing({
//         title: "newtitle",
//         description: "newdescription",
//     });
//     await sampleTesting.save();
//     res.send("Listing saved!");
//     console.log("Listing saved!");
// });

//server listening
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});