const express = require("express");
const mongoose = require("mongoose");
const userAuth = require("../middlewares/authentication");
const { validateCouponData, validateUpdateCouponData } = require("../utils/validator");
const Coupon = require("../models/couponModel")

const router = express.Router();

router.get("/coupon", userAuth, async (req, res) => {
    try {
        const coupons = await Coupon.find({ userId: req.user._id }).sort({ expiryDate: 1 })

        res.json({ message: "All coupons", data: coupons })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.post("/coupon", userAuth, async (req, res) => {
    try {
        validateCouponData(req);

        const { title, code, category, discount, expiryDate } = req.body;
        const coupon = new Coupon({
            userId: req.user._id,
            title,
            code,
            category: category.charAt(0).toUpperCase() + category.slice(1),
            discount,
            expiryDate: new Date(expiryDate)
        })

        await coupon.save();

        res.json({ message: "New Coupon Added", data: coupon });

    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.put("/coupon/:id", userAuth, async (req, res) => {
    try {
        const { id } = req.params;

        validateUpdateCouponData(req);
        const { title, code, discount } = req.body;

        const updatedCoupon = await Coupon.findOneAndUpdate(
            { _id: id, userId: req.user._id },
            {
                title,
                code,
                discount
            },
            { new: true }
        )

        if (!updatedCoupon) {
            throw new Error("Coupon not found");
        }

        res.json({ message: "Coupon updated successfully", data: updatedCoupon })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.delete("/coupon/:id", userAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCoupon = await Coupon.findOneAndDelete({ _id: id, userId: req.user._id });

        if (!deletedCoupon) {
            throw new Error("Coupon not found");
        }
        res.json({ message: "Deleted coupon successfully", data: deletedCoupon });
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

module.exports = router