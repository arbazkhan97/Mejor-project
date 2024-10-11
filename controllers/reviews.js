


const listing=require('../models/listing')
const Review=require('../models/review')


// create review controllers

module.exports.createReview=async (req,res)=>{

    let Listings=await listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    
    Listings.reviews.push(newReview);

    await Listings.save();
    await newReview.save();
    
    req.flash("successfully","New Review Created!");

    res.redirect(`/listings/${Listings._id}`);

}

// destroy review controler

module.exports.destroyReview=async(req,res)=>{

    let{id, reviewId}=req.params;

    await listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}})

    await Review.findByIdAndDelete(reviewId);

    req.flash("successfully","Review Deleted!");

    res.redirect(`/listings/${id}`)
}