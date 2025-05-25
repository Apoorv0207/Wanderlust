const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");

const Listing=require("../models/listing.js");//---./--it means search in our current folder
const mongoose=require('mongoose');
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");

const multer=require("multer");
const{storage}=require("../cloudConfig.js");
const upload=multer({storage});
//as we have seggregated in controllers all callbacks so now requiring them
const listingController=require("../controllers/listings.js");


//Now if we have same path but different requests(get,post,delete) 
//we can combine them and write in form of router.route
//combining show and create route as they both route is same
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing)
  );


  //NEW Route--to create a new listing
router.get("/new",isLoggedIn,listingController.renderNewForm);
//------ONE COMMON MISTAKE___Create new route before show as after it listings/new--new will be taken as id so not correct


  //combining show-update-delete routes as their route is same
  router
  .route("/:id")
  .get( wrapAsync(listingController.showListing))
  .put(
    
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
  );



//Edit Route--to edit a listing --now edited lidting will be updated
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing))



 

module.exports=router;