
const Listing=require('./models/listing')
const Review=require('./models/review.js')
const ExpressError=require('./utils/ExpressError.js');
const {listingSchema,reviewSchema}=require('./schema.js');



// to check user is logged in or not middleware

module.exports.isLoggedIn=(req,res,next)=>{

        if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to add new listings")
       return res.redirect('/login')
    };
    next();
}

// save redirect middleware

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();

}

// authorization  to check who are the owner of listing 

module.exports.isOwener= async(req,res,next)=>{

    let {id}=req.params;

  let listing=  await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currentUser._id)){

    req.flash("error","You are not the owner of this listing");
   return res.redirect(`/listings/${id}`)

  }
next();
}

// validation for listings(middleware)

module.exports. validateListing=(req,res,next)=>{

    let {error}=listingSchema.validate(req.body);

    if(error){
        errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{

        next();
    }
}

//validation for review (middleware)


module.exports. validateReview=(req,res,next)=>{

    let {error}=reviewSchema.validate(req.body);

    if(error){
        errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{

        next();
    }
}


module.exports.isAuthorReview= async(req,res,next)=>{

    let {id,reviewId}=req.params;

  let review=  await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currentUser._id)){

    req.flash("error","You are not the author of this review");
   return res.redirect(`/listings/${id}`)

  }
next();
}