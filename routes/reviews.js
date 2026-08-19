const express = require("express");
const router = express.Router(({ mergeParams: true }));

const Listing = require("../models/listing.js");
const review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");




 //post route-review
router.post("/", isLoggedIn, validateReview, wrapAsync(async(req,res)=>{
    const {id} = req.params;

    if (!id) {
        throw new ExpressError(400, "Listing ID is missing");
    }
    
    let listing = await Listing.findById(id.trim());
    let newReview = new review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New review created!");
    
    res.redirect(`/listings/${id}`);
}));


 //delete route-review
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(async(req, res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await review.findByIdAndDelete(reviewId.trim());
    req.flash("success", "Review deleted successfully!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;