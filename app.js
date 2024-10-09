
if(process.env.NODE_ENV!="production"){

    require('dotenv').config()
}

 
// equired things

const express=require("express");
const app=express()
const mongoose=require("mongoose");
const  methodOverride = require('method-override')
const ejsMate=require('ejs-mate');
const path=require("path")
const ExpressError=require('./utils/ExpressError.js');
const listingsRouter=require("./routers/listing.js")
const reviewsRouter=require("./routers/review.js")
const userRouter=require('./routers/user.js')
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash")
const passport=require("passport")
const LocalStrategy=require("passport-local")
const User=require("./models/user.js")

const port=8080;

const dburl= process.env.ATLASDB_URL;

//  set and use things

app.set('view engine',"ejs")
app.set('views',path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,'/public')))
app.use(express.static(path.join(__dirname,'/public')))



// connect the data base

main()
.then(()=>{
    console.log("connect to DB")
})
.catch((err)=>{
    console.log(err)
})

async function main(){

   await  mongoose.connect(dburl);
}


const store= MongoStore.create({
    mongoUrl: dburl,
    crypto: {
      secret:process.env.SECRET,
    },
    touchAfter:24*3600,

})

store.on("error",()=>{
    console.log("EROOR IN MONGO  SESSION STORE ",err);
})

// cookie session

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+10*24*60*60*1000,
        maxAge:10*24*60*60*1000,
        httpOnly:true,
    }
}




// use express session / for flash messages

app.use(session(sessionOptions))
app.use(flash());

// for signup/signin (passport uses) authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


// flash message middleware


app.use((req,res,next)=>{

    res.locals.success =  req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currentUser=req.user;
    next();

})





// listings routers


app.use("/listings",listingsRouter);


// reviews routers

app.use("/listings/:id/reviews",reviewsRouter);

//user signup route

app.use('/',userRouter)



// this middleware used when page is not found (basically it is a error handler)

app.all('*',(req,res,next)=>{

    next(new ExpressError(404,"page not found!"))
  
})

// Error handling middleware

app.use( (err,req,res,next)=>{

let {statusCode=500,message="somethinng went wrong"}=err;
res.status(statusCode).render("error.ejs",{message})
    
})



// server listening route on a perticular route

app.listen(port,()=>{

    console.log("server is listening on port",port)

})


