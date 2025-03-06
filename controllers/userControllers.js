const User = require('../models/user')

const renderSignupPage = (req, res) => {
    res.render('users/signup.ejs')
}

const postSignupRequest = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username })
        const registeredUser = await User.register(newUser, password)
        console.log(registeredUser)
        // signup user
        req.login(registeredUser, (err) => {
            if (err)
                return next(err)
            req.flash("success", "Welcome to Wanderlust")
            res.redirect('/listing')
        })
    }
    catch (err) {
        req.flash("Error", err.message)
        res.redirect('/signup')
    }
}

const renderLoginPage = (req, res) => {
    res.render("users/login.ejs")
}

const postLoginReq = async (req, res) => {
      try {
        req.flash("success", "Welcome to wanderlust, you're logged in")
        let redirectUrl = res.locals.redirectUrl || "/listing"
        res.redirect(redirectUrl)
    }
    catch (err) {
        req.flash("Error", err.message)
        res.redirect('/login')
    }
}

const logout = (req, res, next) => {
    try {
        req.logout((err) => {
            if (err)
                return next(err)
        })
        req.flash("success", "You are logged out")
        res.redirect("/listing")
    }
    catch (err) {
        req.flash("Error", err.message)
        res.redirect('/')
    }
}

module.exports = { renderSignupPage, postSignupRequest, renderLoginPage, postLoginReq, logout }