const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const sendExpiryEmail = async (email, firstName, couponTitles) => {
    const couponListHtml = couponTitles
        .map(title => `<li>${title}</li>`)
        .join("")

    try {
        await transporter.sendMail({
            from: `"CUPPU" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Alert: ${couponTitles.length} Coupons Expiring Tomorrow!`,
            html: `
        <div style="font-family: sans-serif; color: #333;">
          <h2>Hi ${firstName},</h2>
          <p>The following coupons will expire <strong>tomorrow</strong>:</p>
          <ul>${couponListHtml}</ul>
          <p>Don't let your savings go to waste!</p>
          <br />
          <a href="https://coupon-organizer.vercel.app"
             style="background:#4f46e5;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
            View My Coupons
          </a>
          <br />
        </div>
      `
        })
    } catch (err) {
        console.error("Email error:", err)
    }
}

module.exports = {
    sendExpiryEmail
}