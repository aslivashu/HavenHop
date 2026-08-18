const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");
const review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema} = require("../schema.js");


// Middleware to validate review data using Joi
const validateReview = (req, res, next) => {
      let {error}= reviewSchema.validate(req.body)
     if(error){
        let errMssg= error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMssg);
     } else{
        next();
     }
}


 //post route-review
router.post("/", validateReview, wrapAsync(async(req,res)=>{
    const {id} = req.params;
    let listing = await Listing.findById(id.trim());
    let newReview = new review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    
    res.redirect(`/listings/${id}`);
}));


 //delete route-review
router.delete("/:reviewId", wrapAsync(async(req, res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await review.findByIdAndDelete(reviewId.trim());
    res.redirect(`/listings/${id}`);
}));

module.exports = router;