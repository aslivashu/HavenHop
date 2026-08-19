const mongoose = require('mongoose');
const initdata = require("./data.js");
const Listing = require("../models/listing.js");


const Mongo_URL = "mongodb://localhost:27017/HavenHop";
main().
then(() => {
    console.log ("connected to DB");
})
.catch(err => console.log(err));

async function main(){
    await mongoose.connect(Mongo_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({...obj, owner: "6a856ffde8f8fb133537a967"}));
    await Listing.insertMany(initdata.data);
    console.log("Database initialized with sample data");
};

initDB();