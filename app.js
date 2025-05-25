if (process.env.NODE_ENV !="production"){
    require('dotenv').config();
}


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing=require("./models/listing.js");//---./--it means search in our current folder
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");//it is a package used to help create templates/layouts
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

//to require for path of listings and reviews
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;
//wanderlust is the name of our database
async function main() {//main is the name of func in which we connect to db
    await mongoose.connect(dbUrl);
}

main()
.then(()=>{
    console.log("connected to database");
})  //here ; will not come
.catch((err)=>{
    console.log(err);
});

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));//middleware to parse data
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);//to use ejsMate
app.use(express.static(path.join(__dirname,"/public"))); //to use static files--in public folder

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchafter:24*3600,
    }
);

store.on("error",()=>{
    console.log("Error in MOngo Session Store",err);
});

const sessionOptions={
    store:store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};



app.use(session(sessionOptions));//this is connect.sid cookie
app.use(flash());//use flash inside cookies only--and above the routes always

//to use passport
app.use(passport.initialize());//to use it need to initialise also
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{//this is middleware to flash when new listing is created
    res.locals.success=req.flash("success");//success is key to match here
   res.locals.error=req.flash("error");
   res.locals.currUser=req.user;
    next();

})


//to use listings path using express router
app.use("/listings",listingRouter);

//to use reviews path by express router
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);






app.all("*",(req,res,next)=>{//this is for rest of all routes
   next(new ExpressError(404,"Page Not Found!"));

});

app.use((err,req,res,next)=>{//middleware to handle error
    let{statuscode=500,message="something went wrong"}=err;
    res.status(statuscode).render("error.ejs",{message});
    // res.status(statuscode).send(message);
  
});

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});
