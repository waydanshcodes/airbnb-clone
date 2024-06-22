const express = require("express")
const app = express()
const mongoose = require("mongoose")
const mongoUrl = "mongodb://127.0.0.1:27017/airbnb"
const methodOverride = require("method-override")
const path = require("path")
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError.js")
const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")


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

app.use("/listings", listings)
app.use("/listings/:id/reviews", reviews)






//page not found 
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found T_T"))
})

//error handler
app.use((err, req, res, next) => {
    console.log(err)
    let { status = 500, message = "something went wrong :/" } = err
    res.status(status).render("error.ejs", { message })
})

//Listen
app.listen(8080, () => {
    console.log("listening")
})