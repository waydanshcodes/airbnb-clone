const express = require("express")
const app = express()
const Listing = require("../models/listing.js")
const ExpressError = require("../utils/ExpressError.js")
const wrapAsync = require("../utils/wrapAsync.js")
const listingSchema = require("../schema.js")
const router = express.Router()


//Validate Listing function
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body)
    console.log(error)
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, error)
    }
    next()
}

// All Listings
router.get("", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings })
}))

// Add new Listing
router.get("/new", (req, res) => {
    res.render("listings/new.ejs")
})
router.post("", wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing)
    await newListing.save()
    req.flash("success", "New Listing added!")
    res.redirect("/listings")
}))

// Show Route 
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params
    let listing = await Listing.findById(id).populate("reviews")
    if (!listing) {
        req.flash("error", "Requested URL does not exist")
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing })
}))

// Edit Route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params
    let listing = await Listing.findById(id)
    if (!listing) {
        req.flash("error", "Requested URL does not exist")
        res.redirect("/listings")
    }
    res.render("listings/edit.ejs", { listing })
}))
router.put("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params
    let editedListing = req.body.listing
    // console.log(id)
    console.log(editedListing)
    await Listing.findByIdAndUpdate(id, editedListing)
    req.flash("success", "Listing updated!")
    res.redirect(`/listings/${id}`)
}))

// Delete Route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params
    let deletedListing = await Listing.findByIdAndDelete(id)
    console.log(deletedListing)
    req.flash("success", "Listing deletd!")
    res.redirect("/listings")
}))

module.exports = router