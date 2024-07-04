const express = require("express")
const router = express.Router()
const User = require("../models/user")
const wrapAsync = require("../utils/wrapAsync")
const passport = require("passport")
const {savedRedirectUrl} = require("../middlewares.js")
const userController = require("../controller/user.js")

router.get("/signup", userController.renderSignUpForm)

router.post("/signup", wrapAsync(userController.signUpNewUser))

router.get("/login", userController.renderLogInForm)

router.post("/login", savedRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.logInUser)

router.get("/logout", userController.logOutUser)

module.exports = router