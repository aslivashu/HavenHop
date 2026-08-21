const mongoose = require('mongoose');
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const Mongo_URL = "mongodb://localhost:27017/HavenHop";

async function main(){
    await mongoose.connect(Mongo_URL);
    console.log("Connected to DB");

    await Listing.deleteMany({});
    
    const processedData = initdata.data.map((obj) => ({
        ...obj,
        owner: "6a856ffde8f8fb133537a967"
    }));

    await Listing.insertMany(processedData);
    console.log("Database initialized successfully with sample data and coordinates!");
    
    await mongoose.connection.close();
    console.log("Connection closed.");
}

main().catch(err => console.log(err));