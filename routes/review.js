const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");

const Review=require("../models/review.js");
const Listing=require("../models/listing.js")
const {isOwner,isLoggedIn,validateReview,isReviewAuthor}=require("../middleware.js");


const reviewController=require("../controllers/reviews.js");

//REVIEW ka POST ROUTE
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.createReview));



//REview ka delete route--isme db s review m bhi delete hoga aur listing k andar review array se bhi
router.delete(
    "/:reviewId",//this is the route where it should go
     isReviewAuthor,
     wrapAsync(reviewController.deleteReview)
  );


  module.exports=router;