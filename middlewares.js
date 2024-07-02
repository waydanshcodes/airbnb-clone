module.exports.isLoggedIn = (req,res,next)=>{
    if (!req.isAuthenticated()) {
        req.flash("error","You must be logged in for this task")
        res.redirect("/login")
    }
    next()
}