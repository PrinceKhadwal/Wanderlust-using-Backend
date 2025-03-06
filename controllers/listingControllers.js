const listingModel = require("../models/listing");
const Review = require("../models/review");

//working
const indexPage = async (req, res) => {
    try {
        let allListing = await listingModel.find({})
        res.render('index.ejs', { allListing })
    }
    catch (err) {
        console.log("index page ", err)
        req.flash("Error", err.message)
        res.redirect('/')
    }
}

//
const showIndividual = async (req, res) => {
    try {
        const { id } = req.params
        console.log(req.params.id)
        let list = await listingModel.findOne({_id : id}).populate('review').populate("owner")
        if (!list) {
            req.flash('error', 'listing you requested does not exist')
            return res.redirect('/listing')
        }
        return res.render('showRoute.ejs', { list })
    }
    catch (err) {
        console.log("show individual page ", err)
        res.redirect('/listing')
    }
}

//
const createNewList = (req, res) => {
    try {
        console.log("create new list get req")
        if (!req.isAuthenticated()) {
            req.flash("error", "You must be logged in to add listing")
            return res.render('/login')
        }
        res.render('createList.ejs')
    }
    catch (err) {
        console.log("create new list page ", err)
        req.flash("Error", err.message)
        res.redirect('/')
    }
}

//
const postCreateNewList = async (req, res) => {
    try {
        const list = new listingModel({
            title: req.body.title,
            description: req.body.description,
            image: req.body.image,
            price: req.body.price,
            location: req.body.location,
            country: req.body.country,
        })
        list.owner = req.user._id
        await list.save();
        req.flash('success', 'New listing created successfully')
        res.redirect('/listing')
    }
    catch (err) {
        console.log("post create new list", err)
        req.flash("Error", err.message)
        res.redirect('/')
    }
}

const editList = async (req, res) => {
    try {
        let list = await listingModel.findOne({ _id: req.params.id })
        res.render('edit.ejs',{list})
    }
    catch (err) {
        console.log("edit list", err)
        req.flash("Error", err.message)
        res.redirect('/')
    }
}

const putList = async (req, res) => {
    try {
        // let {id} = req.params
        await listingModel.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            description: req.body.description,
            image: req.body.image,
            price: req.body.price,
            location: req.body.location,
            country: req.body.country,
        })
        req.flash('success', 'listing updated successfully')
        res.redirect('/listing')
    }
    catch (err) {
        console.log("putlist", err)
        req.flash("Error", err.message)
        res.redirect('/')
    }
}

const deleteList = async (req, res) => {
    try {
        console.log("Delete params id : ", req.params.id)
        await listingModel.findByIdAndDelete(req.params.id)
        req.flash('success', 'listing deleted successfully')
        res.redirect('/')
    }
    catch (err) {
        console.log("delete list", err)
        req.flash("Error", err.message)
        res.redirect('/')
    }
}

//
const createReview = async (req, res) => {
    try {
        let list = await listingModel.findById(req.params.id)
        let newReview = new Review(req.body.review)
        list.review.push(newReview)
        await newReview.save()
        await list.save()

        req.flash('success', 'New Review created successfully')
        res.redirect(`/listing/${req.params.id}`)
    }
    catch (err) {
        console.log("create review", err)
        req.flash("Error", err.message)
        res.redirect('/')
    }
}

//
const deleteReview = async (req, res) => {
    try {
        const { id, reviewId } = req.params
        await listingModel.findByIdAndUpdate(id, { $pull: { review: reviewId } })
        await Review.findByIdAndDelete(reviewId)
        req.flash('success', 'review deleted successfully')

        res.redirect(`/listing/${id}`)
    }
    catch (err) {
        console.log("delete review", err)
        req.flash("Error", err.message)
        res.redirect('/')
    }
}


module.exports = { indexPage, createNewList, editList, showIndividual, postCreateNewList, putList, deleteList, deleteReview, createReview }