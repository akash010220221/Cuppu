const cron = require("node-cron")
const Coupon = require("../models/couponModel")
const { sendExpiryEmail } = require("./sendEmail")

const expiryCron = () => {
    cron.schedule("0 0 * * *", async () => {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(0, 0, 0, 0)

        const endOfTomorrow = new Date(tomorrow)
        endOfTomorrow.setHours(23, 59, 59, 999)

        try {
            const expiringCoupons = await Coupon.find({
                expiryDate: { $gte: tomorrow, $lte: endOfTomorrow }
            }).populate("userId", "email firstName")

            const userGroups = {}

            expiringCoupons.forEach(coupon => {
                const user = coupon.userId
                if (!user || !user.email) return

                if (!userGroups[user.email]) {
                    userGroups[user.email] = {
                        firstName: user.firstName,
                        coupons: []
                    }
                }

                userGroups[user.email].coupons.push(coupon.title)
            })


            for (const email in userGroups) {
                await sendExpiryEmail(
                    email,
                    userGroups[email].firstName,
                    userGroups[email].coupons
                )
            }

        } catch (err) {
            console.error("Cron error:", err)
        }
    })
}


module.exports = {
    expiryCron
}