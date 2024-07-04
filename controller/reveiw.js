const Review = require("../models/review")
const Listing = require("../models/listing")

module.exports.addNewReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review)
    newReview.author = req.user._id
    console.log(newReview)
    listing.reviews.push(newReview)
    await newReview.save()
    await listing.save()
    req.flash("success", "New Review added!")
    res.redirect(`/listings/${listing._id}`)
}

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params
    await Review.findByIdAndDelete(reviewId)
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    req.flash("success", "Review deleted!")
    res.redirect(`/listings/${id}`)
}