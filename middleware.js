const Listing = require("./models/listing"); 
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
 

// Middleware to check if the user is logged in
 module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create a new listing!");
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
    const { id } = req.params;
    const listing = await Listing.findById(id);
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