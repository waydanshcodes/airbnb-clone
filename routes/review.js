const express = require("express")
const app = express()
const Listing = require("../models/listing.js")
const wrapAsync = require("../utils/wrapAsync.js")
const Review = require("../models/review.js")
const router = express.Router({ mergeParams: true })
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middlewares.js")



//Reviews
//Post Review Route
router.post("/", isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review)
    newReview.author = req.user._id
    console.log(newReview)
    listing.reviews.push(newReview)
    await newReview.save()
    await listing.save()
    req.flash("success", "New Review added!")
    res.redirect(`/listings/${listing._id}`)
}))

//Delete Review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params
    await Review.findByIdAndDelete(reviewId)
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    req.flash("success", "Review deleted!")
    res.redirect(`/listings/${id}`)
}))

module.exports = router