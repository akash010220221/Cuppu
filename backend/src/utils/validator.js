const validator = require("validator")

const validateSignUpData = (req) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !validator.isAlpha(firstName) || !validator.isLength(firstName, { min: 3, max: 20 })) {
        throw new Error("First Name must contain only letters and should be between 3 to 20 characters")
    } else if (!lastName || !validator.isAlpha(lastName) || !validator.isLength(lastName, { min: 3, max: 20 })) {
        throw new Error("Last Name must contain only letters and should be between 3 to 20 characters")
    } else if (!validator.isEmail(email)) {
        throw new Error("Email is not valid");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password")
    }
}

const validateProfileUpdateData = (req) => {
    const { firstName, lastName } = req.body;

    if (!firstName || !validator.isAlpha(firstName) || !validator.isLength(firstName, { min: 3, max: 20 })) {
        throw new Error("First Name must contain only letters and should be between 3 to 20 characters")
    } else if (!lastName || !validator.isAlpha(lastName) || !validator.isLength(lastName, { min: 3, max: 20 })) {
        throw new Error("Last Name must contain only letters and should be between 3 to 20 characters")
    }
}

const validateCouponData = (req) => {
    const { title, code, category, discount, expiryDate } = req.body;

    if (!title || !code || !category || !expiryDate) {
        throw new Error("All required fields must be provided")
    } else if (!validator.isLength(title, { min: 2 })) {
        throw new Error("Title must be at least 2 characters")
    } else if (!validator.isLength(code, { min: 2 })) {
        throw new Error("Code must be at least 2 characters")
    } else if (!validator.isLength(category, { min: 2 })) {
        throw new Error("Category must be at least 2 characters")
    } else if (!validator.isDate(expiryDate)) {
        throw new Error("Invalid Expiry Date")
    } else if (discount && !validator.isNumeric(discount.toString()) || Number(discount) < 0 || Number(discount) > 100) {
        throw new Error("Discount must be between 1-100")
    }

    const expiry = new Date(expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0)

    if (expiry < today) {
        throw new Error("Expiry must be a future date");
    }
}

const validateUpdateCouponData = (req) => {
    const { title, code, discount } = req.body;

    if (!title || !code || !discount) {
        throw new Error("All required fields must be provided")
    } else if (!validator.isLength(title, { min: 2 })) {
        throw new Error("Title must be at least 2 characters")
    } else if (!validator.isLength(code, { min: 2 })) {
        throw new Error("Code must be at least 2 characters")
    } else if (discount && !validator.isNumeric(discount.toString()) || Number(discount) < 0 || Number(discount) > 100) {
        throw new Error("Discount must be between 1-100")
    }

}

module.exports = {
    validateSignUpData,
    validateProfileUpdateData,
    validateCouponData,
    validateUpdateCouponData
}