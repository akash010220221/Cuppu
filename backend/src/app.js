const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./config/db");
const { expiryCron } = require("./utils/cronJob");
const cookieParser = require("cookie-parser")
const cors = require("cors")

app.use(cors({
    origin: "https://coupon-organizer.vercel.app",
    // origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const couponRouter = require("./routes/coupon");
const profileRouter = require("./routes/profile");

app.use("/api", authRouter)
app.use("/api", couponRouter)
app.use("/api", profileRouter)


connectDB().then(() => {
    console.log("db connected");
    expiryCron()
    app.listen(process.env.PORT, () => {
        console.log("server running on " + process.env.PORT);
    })
}).catch((err) => {
    console.error(err.message);
})