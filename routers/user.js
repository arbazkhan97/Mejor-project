
const express=require('express')
const router=express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const passport=require("passport");
const { saveRedirectUrl } = require('../middleware.js');
const userController=require('../controllers/users.js')

// (/signup) route wali all api's  get and post both

router
.route('/signup')
.get(userController.rendersignUpForm)
.post( wrapAsync(userController.signUp));

//  (/login) route wali all apis get and post both 

router
.route('/login')
.get( userController.renderloginForm)
.post( saveRedirectUrl, passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}),userController.login);



// logout route functionality

router.get('/logout',userController.logOut)


module.exports=router;