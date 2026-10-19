const express = require("express");
const userAuth = require("../middlewares/authentication");
const Coupon = require("../models/couponModel");
const User = require("../models/userModel");
const bcrypt = require("bcrypt")
const validator = require("validator");
const { validateProfileUpdateData } = require("../utils/validator");
const capitalizeFirstLetter = require("../utils/capitalizeFirstLetter");
const router = express.Router();

router.post("/profile/update", userAuth, async (req, res) => {
    try {
        validateProfileUpdateData(req);
        const { firstName, lastName } = req.body;

        const updatedUser = await User.findByIdAndUpdate(req.user._id,
            {
                firstName: capitalizeFirstLetter(firstName),
                lastName: capitalizeFirstLetter(lastName)
            },
            {
                new: true
            }
        ).select("_id firstName lastName email")

        res.json({ message: "User updated successfully", data: updatedUser });

    } catch (err) {
        res.status(404).json({ message: err.message })
    }
})

router.post("/profile/password", userAuth, async (req, res) => {
    try {
        const { password, newPassword } = req.body
        if (!password || !newPassword) {
            throw new Error("Both current and new passwords are required")
        }

        const user = await User.findById(req.user._id).select("password");

        if (!user) {
            throw new Error("User not found");
        }
        console.log(user.password);
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            throw new Error("Incorrect Current Password")
        }

        if (!validator.isStrongPassword(newPassword)) {
            throw new Error("Make new Password Strong")
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword;

        await user.save()

        res.cookie("token", null, {
            expires: new Date(Date.now())
        })

        res.json({ message: "Password updated successfully" })

    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.delete("/profile/delete", userAuth, async (req, res) => {
    try {
        const deleteUser = await User.findByIdAndDelete(req.user._id)

        if (!deleteUser) {
            throw new Error("User not found")
        }

        await Coupon.deleteMany({
            userId: req.user._id
        })

        res.cookie("token", null, {
            expires: new Date(Date.now()),
        })

        res.json({ message: "Account deleted successfully", data: deleteUser })

    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

module.exports = router