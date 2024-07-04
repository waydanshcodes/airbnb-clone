const Listing = require("../models/listing")

module.exports.renderAllListings = (async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings })
})

module.exports.renderNewListingForm = (req, res) => {
    res.render("listings/new.ejs")
}

module.exports.addNewListing = async (req, res, next) => {
    const newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id
    await newListing.save()
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

module.exports.renderEditListingForm = async (req, res) => {
    let { id } = req.params
    let listing = await Listing.findById(id)
    if (!listing) {
        req.flash("error", "Requested URL does not exist")
        res.redirect("/listings")
    }
    res.render("listings/edit.ejs", { listing })
}

module.exports.editListing = async (req, res) => {
    let { id } = req.params
    let editedListing = req.body.listing
    console.log(editedListing)
    await Listing.findByIdAndUpdate(id, editedListing)
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