const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: true,
        trim: true,
        min: 2
    },
    code: {
        type: String,
        required: true,
        min: 2,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    discount: {
        type: Number,
        default: 0
    },
    expiryDate: {
        type: Date,
        required: true,
        index: true
    }
}, {
    timestamps: true
})

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon