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

