const express = require("express");
const { validateSignUpData } = require("../utils/validator");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const capitalizeFirstLetter = require("../utils/capitalizeFirstLetter");
const Coupon = require("../models/couponModel");
const cleanUpExpiredCoupons = require("../utils/cleanUpExpiredCoupons");
const jwt = require("jsonwebtoken")
const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
        validateSignUpData(req);

        const { firstName, lastName, email, password } = req.body;
        const existingUser = await User.findOne({
            email
        })
        if (existingUser) {
            throw new Error("User already Present");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            firstName: capitalizeFirstLetter(firstName),
            lastName: capitalizeFirstLetter(lastName),
            email,
            password: hashedPassword
        })

        const savedUser = await user.save();
        const token = generateToken(savedUser._id);

        savedUser.password = undefined;

        res.cookie("token", token, {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            sameSite: "none",
            secure: true
        })

        res.json({ message: "Registered successfully", data: savedUser });
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new Error("Email and Password are required");;
        }

        const user = await User.findOne({
            email
        })

        if (!user) {
            throw new Error("Invalid Credentials")
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);


        if (isPasswordValid) {
            const token = generateToken(user._id);
            res.cookie("token", token, {
                expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                httpOnly: true,
                secure: true,
                sameSite: "none"
            })

            user.password = undefined;

            await cleanUpExpiredCoupons(user._id);
            res.json({ message: "Login Successful", data: user })
        } else {
            throw new Error("Invalid Credentials")
        }
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.post("/logout", async (req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })
        res.json({ message: "Logout Successful" })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.get("/verify", async (req, res) => {
    try {
        const token = req.cookies.token
        if (!token) throw new Error("Please Login");
        const decoded = jwt.verify(token, process.env.SECRET)

        const user = await User.findById(decoded.id).select("_id firstName lastName email")

        res.json({ data: user });
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
})

module.exports = router