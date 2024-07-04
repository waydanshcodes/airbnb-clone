const express = require("express")
const app = express()
const Listing = require("../models/listing.js")
const wrapAsync = require("../utils/wrapAsync.js")
const Review = require("../models/review.js")
const router = express.Router({ mergeParams: true })
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middlewares.js")
const reviewController = require("../controller/reveiw.js")

//Reviews
//Post Review Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.addNewReview))

//Delete Review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview))

module.exports = router