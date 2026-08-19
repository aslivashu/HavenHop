const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review.js");

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
    
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
     owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}
);

listingSchema.post("findOneAndDelete", async(listing)=>{
 if (listing){
    await Review.deleteMany({_id: {$in: listing.reviews}});
}});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;