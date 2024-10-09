

// joi schema for  all listings


const joi=require('joi');


 module.exports.listingSchema=joi.object({

        listing: joi.object({

        title:joi.string().required(),
        description:joi.string().required(),
        location:joi.string().required(),
        price:joi.number().min(10).required(),
        image:joi.string().allow("",null),
        country:joi.string().required(),

    }).required()
});

// joi schema for all review

module.exports.reviewSchema=joi.object({

    review:joi.object({

        rating:joi.number().min(1).max(5).required(),
        comment:joi.string().required(),
    }).required()
})
