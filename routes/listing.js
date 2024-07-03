const express = require("express")
const app = express()
const Listing = require("../models/listing.js")
const wrapAsync = require("../utils/wrapAsync.js")
const router = express.Router()
const { isLoggedIn, isAuthorized, validateListing } = require("../middlewares.js")


// All Listings
router.get("", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings })
}))

// Add new Listing
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs")
})
router.post("", isLoggedIn, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id
    await newListing.save()
    req.flash("success", "New Listing added!")
    res.redirect("/listings")
}))

// Show Route 
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params
    let listing = await Listing.findById(id).populate("reviews").populate("owner")
    if (!listing) {
        req.flash("error", "Requested URL does not exist")
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing })
}))

// Edit Route
router.get("/:id/edit", isLoggedIn, isAuthorized, wrapAsync(async (req, res) => {
    let { id } = req.params
    let listing = await Listing.findById(id)
    if (!listing) {
        req.flash("error", "Requested URL does not exist")
        res.redirect("/listings")
    }
    res.render("listings/edit.ejs", { listing })
}))
router.put("/:id", isLoggedIn, isAuthorized, wrapAsync(async (req, res) => {
    let { id } = req.params
    let editedListing = req.body.listing
    console.log(editedListing)
    await Listing.findByIdAndUpdate(id, editedListing)
    req.flash("success", "Listing updated!")
    res.redirect(`/listings/${id}`)
}))

// Delete Route
router.delete("/:id", isLoggedIn, isAuthorized, wrapAsync(async (req, res) => {
    let { id } = req.params
    let deletedListing = await Listing.findByIdAndDelete(id)
    console.log(deletedListing)
    req.flash("success", "Listing deletd!")
    res.redirect("/listings")
}))

module.exports = router