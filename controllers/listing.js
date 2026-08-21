const Listing = require("../models/listing.js");
const { getCoordinates } = require("../middleware.js");

// Render home page with random inspiration listings
module.exports.renderHome = async (req, res) => {
    const allListings = await Listing.find({});
    // Shuffle the listings randomly and pick up to 4 for the inspiration section
    const randomListings = allListings.sort(() => 0.5 - Math.random()).slice(0, 4);
    res.render("listings/home.ejs", { randomListings });
};

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
    res.render("listings/show.ejs", { listing });
};

//create route
module.exports.createListing = async(req,res)=>{
        let url = req.file.path;
        let filename = req.file.filename;
        
        const newListing = new Listing(req.body.listing);
        newListing.image = { url, filename };
        newListing.owner = req.user._id; // Associate the listing with the logged-in user
        
        const result = await getCoordinates(newListing.location, newListing.country);
        // SAFETY CHECK: If it hit the default fallback (New Delhi coordinates), warn the user
       if (result.errorType === 'forbidden_403') {
         req.flash("error", "Map service temporarily blocked requests (403 Forbidden). Default map pin applied.");
        } else if (result.errorType === 'not_found') {
        req.flash("error", "Location not found! Please check the spelling of your location or country.");
            }
        newListing.geometry = { type: 'Point', coordinates: result.coords };

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
    }
    const result = await getCoordinates(listing.location, listing.country);
    // SAFETY CHECK: Warn if location lookup failed during an update
    if (result.errorType === 'forbidden_403') {
    req.flash("error", "Map service temporarily blocked requests (403 Forbidden). Default map pin applied.");
        } else if (result.errorType === 'not_found') {
    req.flash("error", "Location not found! Please check the spelling of your location or country.");
        }
    listing.geometry = { type: 'Point', coordinates: result.coords };

    await listing.save();
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

//filter route
module.exports.index = async (req, res) => {
    let { search, category } = req.query;
    let query = {};

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } },
            { country: { $regex: search, $options: "i" } }
        ];
    }

    if (category && category !== "Trending") {
        query.category = category; 
    }

    const allListings = await Listing.find(query);
    res.render("listings/index.ejs", { allListings, search, category });
};

//search route
module.exports.searchListings = async (req, res) => {
    let query = req.query.q;
    if (!query) {
        return res.redirect("/listings");
    }

    // Search across title, location, and country
    let allListings = await Listing.find({
        $or: [
            { title: { $regex: query, $options: "i" } },
            { location: { $regex: query, $options: "i" } },
            { country: { $regex: query, $options: "i" } }
        ]
    });

    res.render("listings/index.ejs", { allListings, searchQuery: query });
};