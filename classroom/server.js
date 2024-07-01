const express = require("express")
const app = express()
const session = require("express-session")
const flash = require("connect-flash")
const path = require("path")


app.use(session({
    secret: "BKL",
    resave: false,
    saveUninitialized: true
}))
app.use(flash())
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.failure = req.flash("failure")
    next()
})


app.get("/test", (req, res) => {
    if (req.session.count) {
        req.session.count++
    } else
        req.session.count = 1
    res.send(`you sent a request ${req.session.count} times`)
})

app.get("/register", (req, res) => {
    let { name = "anonymous" } = req.query
    req.session.name = name
    if (name === "anonymous") {
        req.flash("failure", "user not registered")
    } else
        req.flash("success", "user registered successfully")
    res.redirect("/hello")
})

app.get("/hello", (req, res) => {
    res.render("page.ejs", { name: req.session.name })
})

app.listen(3000, () => {
    console.log("listening now")
})