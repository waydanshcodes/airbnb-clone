const User = require("../models/user")

module.exports.renderSignUpForm = (req, res) => {
    res.render("./users/signup.ejs")
}

module.exports.signUpNewUser = async (req, res) => {
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
}

module.exports.renderLogInForm = (req, res) => {
    res.render("./users/login.ejs")
}

module.exports.logInUser = async (req, res) => {
    let { username } = req.body
    req.flash("success", `Welcome back to GhoomiGhoomi Travels ${username}`)
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
}

module.exports.logOutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "You were logged out.")
        res.redirect("/listings")
    })
}