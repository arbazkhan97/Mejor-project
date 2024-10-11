
// listing model require

const listing=require('../models/listing');

 const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
 const mapToken=process.env.MAP_TOKEN;

 const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// index controller

module.exports.index=async(req,res,next)=>{

  
    const  allListings= await listing.find({})
res.render('listings/index.ejs',{allListings})

}

// render new form controllesr

module.exports.renderNewForm=(req,res)=>{
   
res.render('listings/new');
}

//show listing controllers

module.exports.showNewListing=async (req,res)=>{

    let {id}=req.params;
    
   let list=await listing.findById(id)
    .populate({path:"reviews",
        populate:{
        path:"author",
    },
    })
    .populate("owner");
    
        if(!list){
        req.flash("error"," Listings you required does not exist!");
        res.redirect('/listings')
    
    }   
    res.render("listings/show.ejs",{list});
    
    }

    // create listing controllers

    module.exports.createListing=async  (req,res,next)=>{
       let response= await geocodingClient
       .forwardGeocode({
            query: req.body.listing.location,
            limit: 1
          })
        .send()
           
            


        let url=req.file.path;
        let filename=req.file.filename;

        let newListing= new listing(req.body.listing)
        newListing.owner=req.user._id;

        newListing.image={url,filename}
        newListing.geometry=response.body.features[0].  geometry ;
        
    
        let savedListing=await newListing.save();
        // console.log(savedListing);
    
        req.flash("success","New Listing Created!");
    
        res.redirect('/listings')
    
    }


// render edit form comtrollers

module.exports.renderEditForm=async (req,res)=>{

    let {id}=req.params;   
    
    let list=await listing.findById(id);
    
    if(!list){
        req.flash("error"," Listings you required does not exist!");
        res.redirect('/listings')    
    }

    let originalImageUrl=list.image.url;

    originalImageUrl=originalImageUrl.replace('/upload','/upload/w_250')
    
   
    res.render('listings/edit.ejs',{list,originalImageUrl})    
    
    }


    //update listing controllers

    module.exports.updateListing=async (req,res)=>{
        
        

        let {id}=req.params;
               
       let Listing= await listing.findByIdAndUpdate(id,{...req.body.listing});

       if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;

        Listing.image={url,filename}
        await Listing.save();

       }
        
        req.flash("successfully"," Listing updated!");
        
        res.redirect(`/listings/${id}`)
        }

        // delete listing controllers

        module.exports.destroyListing=async (req,res)=>{

            let {id}=req.params;                        
            await listing.findByIdAndDelete(id)                       
            req.flash("successfully"," Listing Deleted!");       
            res.redirect('/listings')
            }