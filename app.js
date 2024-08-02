if (process.env.NODE_ENV != "production") {
    require("dotenv").config()
}
const express = require("express")
const app = express()
const mongoose = require("mongoose")
// const mongoUrl = "mongodb://127.0.0.1:27017/airbnb"
const dbUrl = process.env.ATLASDB_URL
const methodOverride = require("method-override")
const path = require("path")
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError.js")
const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")

async function main() {
    await mongoose.connect(dbUrl)
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
app.use(cookieParser("secretcode"))

// app.get("/", (req, res) => {
//     res.send("I am root!")
// })

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600
})
store.on("error",()=>{
    console.log("Error in MONGO SESSION STORE", err)
})
app.use(session({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currentUser = req.user
    next()
})
app.use("/listings", listingRouter)
app.use("/listings/:id/reviews", reviewRouter)
app.use("/", userRouter)



// app.get("/getcookies", (req, res) => {
//     res.cookie("vansh", "gupta")
//     res.cookie("vedansh", "gupta", { signed: true })
//     res.send("cookie :)")
// })

// app.get("/printcookies", (req, res) => {
//     let { name = "Anonymous" } = req.cookies
//     console.dir()
//     res.send(`Hello ${name} `)
// })


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