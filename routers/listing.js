
const express=require('express')
const router=express.Router();
const wrapasync=require("../utils/wrapAsync.js");
const {isLoggedIn,isOwener,validateListing}=require('../middleware.js')
const listingController=require('../controllers/listings.js')
const multer  = require('multer')
const {storage}=require('../cloudconfig.js')
const upload = multer({ storage })


//   (/) route wali api's

router
.route('/')
.get( wrapasync(listingController.index))

.post( isLoggedIn,upload.single('listing[image]'),validateListing, wrapasync(listingController.createListing));


// new route

router.get('/new',isLoggedIn,(listingController.renderNewForm))


// (/:id) route wali  sari api hai

router
.route('/:id')
.get( wrapasync(listingController.showNewListing))
.put( isLoggedIn,upload.single('listing[image]'), validateListing,isOwener, wrapasync(listingController.updateListing))
.delete( isLoggedIn,isOwener, wrapasync(listingController.destroyListing))


// edit route

router.get('/:id/edit' ,isLoggedIn,isOwener, wrapasync(listingController.renderEditForm))


module.exports=router;