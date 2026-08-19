const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");

const {isLoggedIn} = require("../middleware.js");


// Middleware to validate listing data using Joi
const validateListing = (req, res, next) => {
      let {error}= listingSchema.validate(req.body)
     if(error){
        let errMssg= error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMssg);
     } else{
        next();
     }
};

//index route
router.get("/", wrapAsync(async ( req, res)=>{
   const allListings = await Listing.find({});
   res.render("listings/index.ejs", {allListings});
}));


//new route
router.get("/new", isLoggedIn, wrapAsync(async(req,res)=> {
   
    res.render("listings/new.ejs");
}
));


//show route
router.get("/:id", wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id.trim()).populate("reviews").populate("owner");  
    if(!listing){
        req.flash("error", "Listing you requested for does not exists!");
        return res.redirect("/listings");
    }
    console.log("Listing found:", listing);
    res.render("listings/show.ejs", {listing});
}))



//create route
router.post("/", isLoggedIn, validateListing, wrapAsync(async(req,res)=>{
 const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id; // Associate the listing with the logged-in user
        await newListing.save();
        req.flash("success", "New listing created!");
        console.log("New listing created:", newListing);
        res.redirect('/listings')
    }));



//edit route
router.get("/:id/edit",  isLoggedIn, wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id.trim());
    if(!listing){
        req.flash("error", "Listing you requested for does not exists!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}))


//update route
router.put("/:id",  isLoggedIn, validateListing, wrapAsync(async(req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndUpdate(id.trim(), { ...req.body.listing}); 
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
}));


//delete route
router.delete("/:id",  isLoggedIn, wrapAsync(async(req, res)=>{
    let {id} = req.params;
     await Listing.findByIdAndDelete(id.trim());
     req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
}));


module.exports = router;