const User=require("../models/user");

module.exports.renderSignupForm=(req,res)=>{
  res.render("users/signup.ejs");
};

module.exports.renderLoginForm=(req,res)=>{
  res.render("users/login.ejs");
};


module.exports.signup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
      });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}


module.exports.login=async(req,res)=>{
    //we have given passport authenticate to authenticate user
    //if the middleware of passport.authenticate works then only we will go
    //to callback otherwise redirect to login
    req.flash("success","Welcome back to Wanderlust");
    let redirectUrl=res.locals.redirectUrl || "/listings";//if that exists then that otherwise to listings
    res.redirect(redirectUrl);
};

module.exports.logout=(req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "you are logged out!");
      res.redirect("/listings");
    });
  };