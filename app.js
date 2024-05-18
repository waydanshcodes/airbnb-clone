const express = require("express")
const app = express()
const mongoose = require("mongoose")
const mongoUrl = "mongodb://127.0.0.1:27017/airbnb"
const Listing = require("./models/listing.js")
const methodOverride = require("method-override")
const path = require("path")
const ejsMate = require("ejs-mate")
const ExpressError = require("./ExpressError.js")
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
//middleware test---------------------------------------------
let checkToken = (req, res, next) => {
    let { token } = req.query
    if (token === "accessdedo") {
        next()
    }
    throw new ExpressError(401, "Access Denied!")
}
//err 
app.get("/err", (req, res) => {
    abc = abc;
})
app.use((err, req, res, next) => {
    let { status = 404, message = "some error occured" } = err
    res.status(status).send(message)
})
app.get("/admin", (req, res) => {
    throw new ExpressError(404, "nigga not found")
})

//--------------------------------------------------------------

// All Listings
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings })
})

// Add new Listing
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
})
app.post("/listings", async (req, res) => {
    let { listing } = req.body
    // console.log(listing)
    let newListing = new Listing(listing)
    await newListing.save()
    res.redirect("/listings")
})
// Show Route 
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params
    let listing = await Listing.findById(id)
    res.render("listings/show.ejs", { listing })
})
// Edit Route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params
    let listing = await Listing.findById(id)
    res.render("listings/edit.ejs", { listing })
})
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params
    let editedListing = req.body.listing
    // console.log(id)
    // console.log(editedListing)
    await Listing.findByIdAndUpdate(id, editedListing)
    res.redirect(`/listings/${id}`)
})
// Delete Route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params
    let deletedListing = await Listing.findByIdAndDelete(id)
    console.log(deletedListing)
    res.redirect("/listings")
})

//404 middleware
app.use((req, res) => {
    res.send("Error 404 - Page not found :(")
})

//Listen
app.listen(8080, () => {
    console.log("listening")
})