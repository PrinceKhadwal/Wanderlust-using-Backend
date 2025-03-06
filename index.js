const express = require('express')
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require('ejs-mate')

//third party packages
require("dotenv").config();
const session = require('express-session')
const flash = require('connect-flash')
const passport = require("passport")
const localStrategy = require("passport-local")

const User = require("./models/user")
const Listing = require("./models/listing");
const userRouter = require('./routes/user');
const listingRouter = require('./routes/listing')

const app = express()
const port = process.env.PORT || 3000;

//including database
require("./db/conn");
// require("./init/initDb")

app.engine('ejs', ejsMate)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.use(methodOverride("_method"));

session_secret = process.env.SESSION_SECRET;
const sessionOptions = {
  secret : session_secret, 
  resave : false,
  saveUninitialized : true,
}

app.use(session(sessionOptions))
app.use(flash())
app.use(passport.initialize());
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  res.locals.currUser = req.user
  next()
})

app.use('/listing', listingRouter)
app.use('/', userRouter)

//show home route -----working well
app.get('/', async (req,res) => {
  let allListing = await Listing.find({})
  res.render('home.ejs', { allListing })
})

//Page not found
app.all('*', (req, res) => {
  res.json({error : "Page not found"});
})  

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})