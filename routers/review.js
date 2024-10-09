const express=require('express')
const router=express.Router({mergeParams:true});
const {validateReview,isLoggedIn, isAuthorReview}=require('../middleware.js')
const wrapasync=require("../utils/wrapAsync.js");
const reviewController=require('../controllers/reviews.js')



// review Router  (post route);  

router.post('/',  validateReview,isLoggedIn, wrapasync(reviewController.createReview))


// delete review route  (review section)

router.delete('/:reviewId',isLoggedIn,isAuthorReview,  wrapasync (reviewController.destroyReview))

module.exports=router