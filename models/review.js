const { string } = require("joi")
const mongoose = require("mongoose")
const { type } = require("../schema")

const reviewSchema = new mongoose.Schema({
    review: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
})
const Review = new mongoose.model("Review", reviewSchema)
module.exports = Review