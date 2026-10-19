import CutIcon from "../icons/CutIcon"
import Input from "./Input"
import Select from "./Select";
import SaveIcon from "../icons/SaveIcon"
import { useRef } from "react";
import axios from "axios";
import { BASE_URL } from "../config/config";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export const CreateCoupon = ({ open, onClose }) => {
    const today = new Date().toISOString().split("T")[0];

    const { coupon, setCoupon } = useAuth()

    const titleRef = useRef(null)
    const codeRef = useRef(null)
    const discountRef = useRef(null)
    const expiryRef = useRef(null)
    const categoryRef = useRef(null)

    const addCoupon = async () => {
        const title = titleRef.current?.value.trim()
        const code = codeRef.current?.value.trim()
        const discount = discountRef?.current.value.trim()
        const expiryDate = expiryRef?.current.value.trim()
        const category = categoryRef?.current.value.trim()

        if (!title || !code || !discount || !expiryDate || !category) {
            toast.error("Fill all details")
            return;
        }

        try {
            const couponData = { title, code, category, discount, expiryDate }

            const response = await axios.post(BASE_URL + "/coupon", couponData, {
                withCredentials: true
            })

            const newCoupon = response.data.data

            if (setCoupon && newCoupon) {
                const currentCoupons = Array.isArray(coupon) ? coupon : [];
                setCoupon([...currentCoupons, newCoupon])
            }
            toast.success("Coupon Added")

            onClose()
        } catch (err) {
            console.log(err)
            const errorMessage = err?.response?.data?.message || err.message
            toast.error(errorMessage)
        }
    }

    if (!open) return null;

    return (

        <div className="fixed inset-0 z-50 bg-slate-900/70 flex items-center justify-center transition-opacity">


            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 transform transition-all duration-300 scale-100 opacity-100">


                <div className="p-5 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-800">Create New Coupon</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-100"
                        aria-label="Close modal"
                    >
                        <CutIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-4">


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="text-left pb-1 text-slate-700 text-sm font-semibold">Coupon Title</div>

                            <Input reference={titleRef} type="text" placeholder="e.g., Summer Sale 2026" />
                        </div>
                        <div>
                            <div className="text-left pb-1 text-slate-700 text-sm font-semibold">Coupon Code</div>
                            <Input reference={codeRef} type="text" placeholder="e.g., SUM729Y" />
                        </div>
                    </div>


                    <div className="grid grid-cols-3 gap-4">

                        <div>
                            <div className="text-left pb-1 text-slate-700 text-sm font-semibold">Discount (%)</div>
                            <Input
                                reference={discountRef}
                                type="Number"
                                placeholder="1-100"
                                customProps={{
                                    min: "1",
                                    max: "100"
                                }}
                            />
                        </div>

                        <div>
                            <div className="text-left pb-1 text-slate-700 text-sm font-semibold">Category</div>

                            <Select
                                reference={categoryRef}
                                options={["Food", "Travel", "Electronics", "Hotels", "Clothes", "Others"]}
                            />
                        </div>

                        <div>
                            <div className="text-left pb-1 text-slate-700 text-sm font-semibold">Expiry Date</div>
                            <Input
                                reference={expiryRef}
                                type="date"
                                placeholder="Select Date"
                                customProps={{ min: today }}
                            />
                        </div>
                    </div>

                </div>

                <div className="p-5 pt-0">
                    <button
                        onClick={addCoupon}
                        className="bg-blue-600 text-white w-full p-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-lg font-bold flex justify-center items-center gap-2 shadow-md shadow-blue-200"
                    >
                        <SaveIcon className="w-5 h-5" />
                        CREATE COUPON
                    </button>
                </div>

            </div>
        </div>
    )
}