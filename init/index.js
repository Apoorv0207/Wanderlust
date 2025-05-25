const mongoose = require("mongoose");
const initData = require("./data.js");// one dot for curr folder
//require model now
const Listing = require("../models/listing.js");//2 dot for folder just above it

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});//cleaning the db if something is there 
  //this is to insert owner func in the data.js file
  initData.data=initData.data.map((obj)=>({...obj,owner:"67ff78b08291bca2de54e400"}))
  await Listing.insertMany(initData.data);//now we insert data in empty db
  //initdata is an obj and we have to access data there so .data have to do
  console.log("data was initialized");
};

initDB();