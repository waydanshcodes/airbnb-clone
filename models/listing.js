const mongoose = require("mongoose")
const Review = require("./review.js")
const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: String,
        default: "https://th.bing.com/th/id/OIP.DZLWFqYqIG4l_yJaqOuJXgHaHa?rs=1&pid=ImgDetMain",
        set: (v) => v === "" ? "https://th.bing.com/th/id/OIP.DZLWFqYqIG4l_yJaqOuJXgHaHa?rs=1&pid=ImgDetMain" : v,
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }]
})
listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}})
    }
})
const Listing = mongoose.model("Listing", listingSchema)
module.exports = Listing