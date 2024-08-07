const Listing = require("../models/listing")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.renderAllListings = (async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings })
})

module.exports.renderNewListingForm = (req, res) => {
    res.render("listings/new.ejs")
}

module.exports.addNewListing = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location ,
        limit: 1
      })
        .send()
    let url = req.file.path
    let filename = req.file.filename
    const newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id
    newListing.image = { url, filename }
    newListing.geometry = response.body.features[0].geometry
    let savedListing =  await newListing.save()
    console.log(savedListing)
    req.flash("success", "New Listing added!")
    res.redirect("/listings")
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params
    let listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner")
    if (!listing) {
        req.flash("error", "Requested URL does not exist")
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing })
}
"streak"
module.exports.renderEditListingForm = async (req, res) => {
    let { id } = req.params
    let listing = await Listing.findById(id)
    if (!listing) {
        req.flash("error", "Requested URL does not exist")
        res.redirect("/listings")
    }
    let originalImageUrl = listing.image.url
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")
    res.render("listings/edit.ejs", { listing, originalImageUrl })
}

module.exports.editListing = async (req, res) => {
    let { id } = req.params
    let editedListing = req.body.listing
    let newListing = await Listing.findByIdAndUpdate(id, editedListing)
    if (typeof req.file !== "undefined") {
        let url = req.file.path
        let filename = req.file.filename
        newListing.image = { url, filename }
        await newListing.save()
    }
    req.flash("success", "Listing updated!")
    res.redirect(`/listings/${id}`)
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params
    let deletedListing = await Listing.findByIdAndDelete(id)
    console.log(deletedListing)
    req.flash("success", "Listing deletd!")
    res.redirect("/listings")
}