const Listing = require("./models/listing"); 
const review = require("./models/review"); 
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
 

// Middleware to check if the user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        if (req.method !== "GET") {
            const { id } = req.params;
            req.session.redirectUrl = id ? `/listings/${id}` : "/listings";
        } else {
            req.session.redirectUrl = req.originalUrl;
        }
        req.flash("error", "You must be logged in to do that!");
        return res.redirect("/users/login");
    }
    next();
};

// Middleware to verify listing ownership before editing or deleting
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// Middleware to check if the logged-in user is the owner of the listing
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner || !listing.owner.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// Middleware to validate listing data using Joi
module.exports.validateListing = (req, res, next) => {
      let {error}= listingSchema.validate(req.body)
     if(error){
        let errMssg= error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMssg);
     } else{
        next();
     }
};

// Middleware to validate review data using Joi
module.exports.validateReview = (req, res, next) => {
      let {error}= reviewSchema.validate(req.body)
     if(error){
        let errMssg= error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMssg);
     } else{
        next();
     }
};

// Middleware to check if the logged-in user is the owner of the review
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let reviewFound = await review.findById(reviewId);
    if (!reviewFound.author || !reviewFound.author.equals(req.user._id)) {
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// Middleware to get coordinates for a given location and country 
const axios = require('axios');

module.exports.getCoordinates = async function(locationString, countryString) {
    if (!locationString) return { coords: [77.2090, 28.6139], errorType: 'empty' };

    try {
        const query = countryString ? `${locationString}, ${countryString}` : locationString;
        
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: { 
                format: 'json', 
                q: query, 
                limit: 1 
            },
            headers: { 
                'User-Agent': 'HavenHopRealEstateApp_StudentProject_Contact@example.com' 
            },
            timeout: 5000 
        });
        
        if (response.data && response.data.length > 0) {
            return { 
                coords: [parseFloat(response.data[0].lon), parseFloat(response.data[0].lat)], 
                errorType: null 
            };
        } else {
            // Location not found by the geocoder (Empty array)
            return { coords: [77.2090, 28.6139], errorType: 'not_found' };
        }
    } catch (err) {
        // Check if it's explicitly a 403 Forbidden error
        if (err.response && err.response.status === 403) {
            console.error("Geocoding error: 403 Forbidden (Blocked by Nominatim rate limit).");
            return { coords: [77.2090, 28.6139], errorType: 'forbidden_403' };
        } else if (err.code === 'ECONNABORTED') {
            console.error("Geocoding error: Request timed out.");
        } else {
            console.error("Geocoding failed:", err.message);
        }
    }
    
    return { coords: [77.2090, 28.6139], errorType: 'general_error' };
};