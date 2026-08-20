const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewsController = require("../controllers/reviews.js");


 //post route-review
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewsController.createReview));

 //delete route-review
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(reviewsController.destroyReview));


module.exports = router;