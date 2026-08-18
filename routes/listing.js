const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");


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
router.get("/new", wrapAsync(async(req,res)=> {
    res.render("listings/new.ejs");
}
));


//show route
router.get("/:id", wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id.trim()).populate("reviews");
    res.render("listings/show.ejs", {listing});
}))



//create route
router.post("/", validateListing, wrapAsync(async(req,res)=>{
 const newListing = new Listing(req.body.listing);
        await newListing.save();
        console.log("New listing created:", newListing);
        res.redirect('/listings')
    }));



//edit route
router.get("/:id/edit", wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id.trim());
    res.render("listings/edit.ejs", {listing});
}))


//update route
router.put("/:id", validateListing, wrapAsync(async(req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndUpdate(id.trim(), { ...req.body.listing});
    res.redirect(`/listings/${id}`);
}));


//delete route
router.delete("/:id", wrapAsync(async(req, res)=>{
    let {id} = req.params;
     await Listing.findByIdAndDelete(id.trim());
    res.redirect("/listings");
}));


module.exports = router;