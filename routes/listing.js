const express = require('express')
const router = express.Router()
const { isLoggedIn, isOwner, validateListing, validateReview } = require("../middlewares");
const { indexPage, createNewList, editList, showIndividual, postCreateNewList, putList, deleteList, deleteReview, createReview } = require('../controllers/listingControllers');

router.get('/', indexPage)
router.get('/new', isLoggedIn, createNewList)

router.get('/:id', showIndividual)
router.post('/', isLoggedIn, postCreateNewList)

router.get('/:id/edit', isLoggedIn, editList)
router.put('/:id', isLoggedIn, isOwner, putList)
router.delete('/:id', isLoggedIn, isOwner, deleteList)

router.post('/:id/reviews', validateReview, createReview)
router.delete('/:id/review/:reviewId', isLoggedIn, deleteReview)

module.exports = router;