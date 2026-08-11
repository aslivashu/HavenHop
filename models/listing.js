const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: String,
    image: {
        filename: String,
        url: {
            type:String,
        default: "https://i.pinimg.com/1200x/9d/59/d3/9d59d34672b4b139839c530141848210.jpg",
        set: (v) => v===""
        ? "https://i.pinimg.com/1200x/9d/59/d3/9d59d34672b4b139839c530141848210.jpg" 
        : v,
    },
    },
    price: Number,
    location: String,
    country: String,
}
);

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;