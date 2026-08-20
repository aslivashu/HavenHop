const Listing = require("../models/listing.js");


//index route
module.exports.index= async ( req, res)=>{
   const allListings = await Listing.find({});
   res.render("listings/index.ejs", {allListings});
};

//new route
module.exports.newListing = async(req,res)=> {
    res.render("listings/new.ejs");
};

//show route
module.exports.showListing = async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id.trim())
    .populate({
        path: "reviews",
         populate:{ 
            path: "author" ,
         },
        })
        .populate("owner");  
    if(!listing){
        req.flash("error", "Listing you requested for does not exists!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
};

//create route
module.exports.createListing = async(req,res)=>{
 const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id; // Associate the listing with the logged-in user
        await newListing.save();
        req.flash("success", "New listing created!");
        res.redirect('/listings')
};

//edit route
module.exports.editListing = async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id.trim());
    if(!listing){
        req.flash("error", "Listing you requested for does not exists!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
};

//update route
module.exports.updateListing = async(req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndUpdate(id.trim(), { ...req.body.listing}); 
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};

//delete route
module.exports.destroyListing = async(req, res)=>{
    let {id} = req.params;
     await Listing.findByIdAndDelete(id.trim());
     req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
};