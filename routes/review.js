const express = require("express")
const app = express()
const Listing = require("../models/listing.js")
const ExpressError = require("../utils/ExpressError.js")
const wrapAsync = require("../utils/wrapAsync.js")
const reviewSchema = require("../schema.js")
const Review = require("../models/review.js")
const router = express.Router({ mergeParams: true })

//Validate review function
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body)
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg)
    }
    next()
}

//Reviews
//Post Review Route
router.post("/", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review)
    listing.reviews.push(newReview)
    await newReview.save()
    await listing.save()
    req.flash("success","New Review added!")
    res.redirect(`/listings/${listing._id}`)
}))

//Delete Review Route
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params
    await Review.findByIdAndDelete(reviewId)
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    req.flash("success","Review deleted!")
    res.redirect(`/listings/${id}`)
}))

module.exports = router