const express = require("express")
const app = express()
const Listing = require("../models/listing.js")
const wrapAsync = require("../utils/wrapAsync.js")
const router = express.Router()
const { isLoggedIn, isAuthorized, validateListing } = require("../middlewares.js")
const listingController = require("../controller/listing.js")

// All Listings
router.get("", wrapAsync(listingController.renderAllListings))

// Add new Listing
router.get("/new", isLoggedIn, listingController.renderNewListingForm)
router.post("", isLoggedIn, wrapAsync(listingController.addNewListing))

// Show Route 
router.get("/:id", wrapAsync(listingController.showListing))

// Edit Route
router.get("/:id/edit", isLoggedIn, isAuthorized, wrapAsync(listingController.renderEditListingForm))
router.put("/:id", isLoggedIn, isAuthorized, wrapAsync(listingController.editListing))

// Delete Route
router.delete("/:id", isLoggedIn, isAuthorized, wrapAsync(listingController.destroyListing))

module.exports = router