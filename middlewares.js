const Listing = require("./models/listing")

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