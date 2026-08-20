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
        let url = req.file.path;
        let filename = req.file.filename;
        
        const newListing = new Listing(req.body.listing);
        newListing.image = { url, filename };
        newListing.owner = req.user._id; // Associate the listing with the logged-in user
        await newListing.save();
        req.flash("success", "New listing created!");
        res.redirect('/listings')
};

//edit route
module.exports.renderEditForm = async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id.trim());
    if(!listing){
        req.flash("error", "Listing you requested for does not exists!");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url; // Store the original image URL
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_250,w_350,c_fill"); // Modify the URL to include resizing parameters
    res.render("listings/edit.ejs", {listing, originalImageUrl});
};

//update route
module.exports.updateListing = async(req,res)=>{
    const {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id.trim(), { ...req.body.listing}); 

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
    }
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