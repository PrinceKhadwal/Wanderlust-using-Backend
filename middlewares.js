const { listingSchema, reviewSchema } = require('./schema')
const listingModel = require('./models/listing')
const ExpressError = require('./utils/ExpressError')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl
        req.flash("error", "Your must login before entering the website")
        return res.redirect('/login')
    }
    next()
}

module.exports.saveRedirectUrl = (req, res,next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl
    }
}

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params
    let listing = await listingModel.findById(id)
    if(!listing.owner.equals(req.user._id))
    {
      req.flash("error", "You don't have permissino to edit")
      return res.redirect(`/listing/${id}`)
    }
    next()
}

 module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
  
    if(error) {
      throw  new ExpressError(404)
    }
    else{
      next()
    }  
  }

  module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
  
    if(error) {
      let errMsg = error.details.map((el) => el.message.join(','))
      throw new ExpressError(404, errMsg)
    }
    else  next()
  }