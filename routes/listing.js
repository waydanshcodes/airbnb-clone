const express = require("express")
const app = express()
const Listing = require("../models/listing.js")
const wrapAsync = require("../utils/wrapAsync.js")
const router = express.Router()
const { isLoggedIn, isAuthorized, validateListing } = require("../middlewares.js")
const listingController = require("../controller/listing.js")
const multer = require("multer")
const {storage} = require("../cloudconfig.js")
const upload = multer({ storage })

router.route("/")
    .get(wrapAsync(listingController.renderAllListings))
    .post(isLoggedIn, upload.single("listing[image]"), wrapAsync(listingController.addNewListing))
    
router.get("/new", isLoggedIn, listingController.renderNewListingForm)

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isAuthorized, wrapAsync(listingController.editListing))
    .delete(isLoggedIn, isAuthorized, wrapAsync(listingController.destroyListing))

router.get("/:id/edit", isLoggedIn, isAuthorized, wrapAsync(listingController.renderEditListingForm))

module.exports = router