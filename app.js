const express = require("express")
const app = express()
const mongoose = require("mongoose")
const mongoUrl = "mongodb://127.0.0.1:27017/airbnb"
const Listing = require("./models/listing.js")
const methodOverride = require("method-override")
const path = require("path")
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError.js")
const wrapAsync = require("./utils/wrapAsync.js")
const listingSchema = require("./schema.js")
const Review = require("./models/review.js")

async function main() {
    await mongoose.connect(mongoUrl)
}
main().then(() => {
    console.log("connected to DB")
}).catch((err) => {
    console.log(err)
})

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname, "/public")))

app.get("/", (req, res) => {
    res.send("I am root!")
})

//middleware test = Access Token --------------------------------------------
let checkToken = (req, res, next) => {
    let { token } = req.query
    if (token === "accessdedo") {
        next()
    }
    throw new ExpressError(401, "Access Denied!")
}
//-----------------------------------------------------------------------------

//Validate Listing function
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body)
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg)
    }
    next()
}

// All Listings
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings })
}))

// Add new Listing
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
})
app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing)
    await newListing.save()
    res.redirect("/listings")
}))

// Show Route 
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params
    let listing = await Listing.findById(id)
    res.render("listings/show.ejs", { listing })
}))

// Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params
    let listing = await Listing.findById(id)
    res.render("listings/edit.ejs", { listing })
}))
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params
    let editedListing = req.body.listing
    // console.log(id)
    // console.log(editedListing)
    await Listing.findByIdAndUpdate(id, editedListing)
    res.redirect(`/listings/${id}`)
}))

// Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params
    let deletedListing = await Listing.findByIdAndDelete(id)
    console.log(deletedListing)
    res.redirect("/listings")
}))

//page not found 
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found T_T"))
})

//error handler
app.use((err, req, res, next) => {
    let { status = 500, message = "something went wrong :/" } = err
    res.status(status).render("error.ejs", { message })
})

//Listen
app.listen(8080, () => {
    console.log("listening")
})