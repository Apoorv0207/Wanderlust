const Listing=require("../models/listing");
const Review=require("../models/review");


module.exports.createReview=async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","New review Created");

    res.redirect(`/listings/${listing._id}`);
};


module.exports.deleteReview=async (req, res) => {
      let { id, reviewId } = req.params;
      
      //ye listing k array review m s delete krega
      await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });//pull operator dhundta h array m s and delete it
      await Review.findByIdAndDelete(reviewId);//ye review collection m s delete krega
      req.flash("success","Review Deleted");
      res.redirect(`/listings/${id}`);
      //one problem is that here if listing is deleted then review in DB is not deleted
      //to solve this in listing.js will create a middleware
    };