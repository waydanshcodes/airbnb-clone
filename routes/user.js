const express = require("express")
const router = express.Router()
const User = require("../models/user")
const wrapAsync = require("../utils/wrapAsync")
const passport = require("passport")
const {savedRedirectUrl} = require("../middlewares.js")

router.get("/signup", (req, res) => {
    res.render("./users/signup.ejs")
})

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body
        const newUser = new User({ username, email })
        const registeredUser = await User.register(newUser, password)
        console.log(registeredUser)
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err)
            }
            req.flash("success", `Welcome to GhoomiGhoomi Travels ${username}!`)
            res.redirect("/listings")
        })
    }
    catch (err) {
        req.flash("error", err.message)
        res.redirect("/signup")
    }
}))

router.get("/login", (req, res) => {
    res.render("./users/login.ejs")
})

router.post("/login", savedRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), async (req, res) => {
    let { username } = req.body
    req.flash("success", `Welcome back to GhoomiGhoomi Travels ${username}`)
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
})

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "You were logged out.")
        res.redirect("/listings")
    })
})
module.exports = router