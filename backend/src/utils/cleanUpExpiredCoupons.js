const Coupon = require("../models/couponModel");

const cleanUpExpiredCoupons = async (id) => {
    try {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        const result = await Coupon.deleteMany({
            userId: id,
            expiryDate: { $lt: threeDaysAgo }
        })
    } catch (err) {
        console.error("Error clean up " + err.message)
    }
}

module.exports = cleanUpExpiredCoupons