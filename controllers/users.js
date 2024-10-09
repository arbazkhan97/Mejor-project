
const User=require("../models/user")



// signup render form controller

module.exports.rendersignUpForm=(req,res)=>{

    res.render("user/signup.ejs")
}



// sign up controller
module.exports.signUp=async(req,res)=>{

    try{
        let {username,email,password}=req.body;

    let newUser=new User({

        email,username,
       
    })
    let registeredUser=await User.register(newUser,password)

    
    req.login(registeredUser,(err)=>{

        if(err){
            return next(err);
        }
          
    req.flash("success","Welcome to the wanderlust")
    res.redirect('/listings');
    })

    }catch(err){
        req.flash("error",err.message)
        res.redirect('/signup')
    }  
}

// login render form controller

module.exports.renderloginForm=(req,res)=>{
    res.render('user/login.ejs')

}

// login controller

module.exports.login=async(req,res)=>{


    
    req.flash('success',"Welcome back to Wanderlust");

    let redirectUrl=res.locals.redirectUrl || "/listings";

    res.redirect(redirectUrl);
}

// logOut controllers

module.exports.logOut=(req,res,next)=>{

    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash('success','you are logged out now!')
        res.redirect('/listings')

    })
}