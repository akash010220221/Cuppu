import { z } from "zod"

export const couponSchema = z.object({
    title: z.string().trim().min(2, { message: "Titile must be 2 or more characters" }).max(30),

    code: z.string().trim().min(2, { message: "Code should be minimum 2 digits" }),

    category: z.enum(["Food", "Travel", "Electronics", "Hotels", "Clothes", "Others"], {
        errorMap: () => ({ message: "Invalid category selected." })
    }),

    discount: z.preprocess(
        (val) => parseFloat(String(val)),
        z.number().min(1).max(100, { message: "Discount must be between 1% and 100%." })
    ),

    expiryDate: z.string().refine(
        (date) => new Date(date) > new Date(),
        { message: "Expiry date must be in the future" }
    )
})