const review = require("../models/review.js");
const Listing = require("../models/listing.js");


//post route-review
module.exports.createReview = async(req,res)=>{
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
}

//delete route-review
module.exports.destroyReview = async(req, res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await review.findByIdAndDelete(reviewId.trim());
    req.flash("success", "Review deleted successfully!");
    res.redirect(`/listings/${id}`);
}