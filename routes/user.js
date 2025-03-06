const express = require('express')
const router = express.Router()
const passport = require("passport")
const { renderSignupPage, postSignupRequest, renderLoginPage, postLoginReq, logout } = require('../controllers/userControllers')

router.get('/signup', renderSignupPage)
router.post('/signup', postSignupRequest)

router.get("/login", renderLoginPage)
router.post("/login", passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), postLoginReq)

router.get('/logout', logout)

module.exports = router