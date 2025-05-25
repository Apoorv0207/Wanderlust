const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//IN THE Controllers file we will have all callbacks req in the routes

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs"); //it has a form to create a new listing
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner"); //populate will show full reviews not only their ID
  if (!listing) {
    req.flash("error", "listing you have requested does not exist");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();



    let url, filename;
    if (req.file) {
      url = req.file.path;
      filename = req.file.filename;
    }
  //to use through JOI

  const newListing = new Listing(req.body.listing); //it will create a new Listing
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry=response.body.features[0].geometry;
  console.log(JSON.stringify(response.body.features, null, 2));

  let savedListing=await newListing.save();
  console.log(savedListing);
  req.flash("success", "New Listing Created"); //to flash that listing is created--success is key and that is value-key value pair
  res.redirect("/listings"); //redirects to lisstings page
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "listing you have requested does not exist");
    res.redirect("/listings");
  }
  //while in edit page a preview has to be there
  //but in preview the img quality should be less so we will reduce its pixels
  let url = listing.image.url;
  url = url.replace("/upload", "/upload/h_250,w_250"); //this is api of cloudinary ki esse link krenge to pixels kmm hojate h
  res.render("listings/edit.ejs", { listing, url });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
