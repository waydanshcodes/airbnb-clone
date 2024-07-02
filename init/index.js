const mongoose = require("mongoose")
const initData = require("./data.js")
const Listing = require("../models/listing.js")
const mongoUrl = "mongodb://127.0.0.1:27017/airbnb"
async function main() {
    await mongoose.connect(mongoUrl)
}
main().then(() => {
    console.log("connected to DB")
}).catch((err) => {
    console.log(err)
})
const initDB = async () => {
    await Listing.deleteMany({})
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "6683e1f1694606a50c1252b3" }))
    await Listing.insertMany(initData.data)
    console.log("data was initialized")
}
initDB()