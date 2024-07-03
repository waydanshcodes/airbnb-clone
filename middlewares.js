const Listing = require("./models/listing")
const Review = require("./models/review")
const ExpressError = require("./utils/ExpressError")
const listingSchema= require("./schema.js")
const reviewSchema = require("./schema.js")

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log(req.originalUrl)
        req.session.redirectUrl = req.originalUrl
        req.flash("error", "You must be logged in for this task")
        res.redirect("/login")
    }
    next()
}

module.exports.savedRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}

module.exports.isAuthorized = async (req, res, next) => {
    let { id } = req.params
    let listing = await Listing.findById(id)
    if (!listing.owner._id.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not authorized for this task.")
        return res.redirect(`/listings/${id}`)
    }
    next()
}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body)
    console.log(error)
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, error)
    }
    next()
}

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body)
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg)
    }
    next()
}

module.exports.isReviewAuthor = async (req,res,next)=>{
    let {reviewId, id} = req.params
    let review = await Review.findById(reviewId)
    if(!review.author._id.equals(res.locals.currentUser._id)){
        req.flash("error","You are not authorized for this task")
        return res.redirect(`/listings/${id}`)
    }
    next()
}