import DeleteIcon from "../icons/DeleteIcon"
import EditIcon from "../icons/EditIcon"
import SaveIcon from "../icons/SaveIcon"
import axios from "axios"
import { BASE_URL } from "../config/config"
import { toast } from "react-toastify"
import { useAuth } from "../context/AuthContext"
import { useState, useMemo } from "react"

const CouponCard = ({ _id, title, category, code, expiryDate, discount }) => {
    const { setCoupon } = useAuth()
    const [edit, setEdit] = useState(true);
    const [couponTitle, setCouponTitle] = useState(title)
    const [couponCode, setCouponCode] = useState(code);
    const [couponDiscount, setCouponDiscount] = useState(discount)

    const isExpired = useMemo(() => {
        const expiry = new Date(expiryDate);
        const today = new Date();
        expiry.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0); 
        return expiry.getTime() < today.getTime();
    }, [expiryDate]);

    const deleteCoupon = async () => {
        try {
            const response = await axios.delete(BASE_URL + "/coupon/" + _id, {
                withCredentials: true
            })
            setCoupon(prev => prev.filter(item => item._id !== _id))
            toast.success("Coupon Deleted")

        } catch (err) {
            toast.error("Something went wrong")
        }
    }

    const editCoupon = async () => {
        if (!couponTitle.trim() || !couponCode.trim() || couponDiscount === "") {
            toast.error("Fill all fields");
            return;
        }

        if (Number(couponDiscount) < 1 || Number(couponDiscount) > 100) {
            toast.error("Discount must be between 1-100")
            return;
        }
        
        if (isExpired) {
            toast.error("Cannot save changes: This coupon has expired.");
            setEdit(true); 
            return;
        }

        try {
            const response = await axios.put(BASE_URL + "/coupon/" + _id, {
                title: couponTitle,
                code: couponCode,
                discount: couponDiscount
            }, {
                withCredentials: true
            })

            setCouponTitle(response.data.data.title)
            setCouponCode(response.data.data.code)
            setCouponDiscount(response.data.data.discount)

            toast.success("Coupon updated successfully")

            setEdit(true)
        } catch (err) {
            toast.error("Something went wrong")
        }
    }

    const handleActionClick = () => {
        if (isExpired) {
            toast.warning("Expired coupons cannot be edited.");
            return;
        }

        if (edit) {
            setEdit(false)
        } else {
            editCoupon()
        }
    }

    const cardClass = isExpired
        ? 'bg-red-50 opacity-80 shadow-md border-2 border-red-300'
        : edit
            ? 'bg-white shadow-xl hover:shadow-2xl'
            : 'bg-yellow-50 shadow-xl ring-4 ring-blue-500';

    const inputClass = edit
        ? 'bg-gray-100'
        : 'bg-white border-2 border-blue-400 focus:border-blue-700 focus:ring-1 focus:ring-blue-700';

    return (
        <div className={`flex flex-col w-full max-w-sm p-5 sm:p-6 rounded-2xl transition-all duration-300 ${cardClass}`}>

            <div className='flex justify-between items-start mb-4 pb-2 border-b border-gray-200'>

                <input
                    type="text"
                    value={couponTitle}
                    onChange={(e) => setCouponTitle(e.target.value)}
                    className={`grow min-w-0 text-xl font-bold p-1 rounded-md transition-colors ${inputClass} ${edit ? 'text-gray-900 border-transparent' : 'text-slate-800'}`}
                    disabled={edit || isExpired} 
                />


                <div className="flex gap-2 ml-4 shrink-0">
                    
                    <button
                        onClick={handleActionClick}
                        disabled={isExpired} 
                        className={`p-2 rounded-full transition-colors hover:scale-110
                            ${isExpired 
                                ? 'text-gray-400 cursor-not-allowed bg-gray-200'
                                : edit 
                                    ? 'text-blue-600 hover:bg-blue-100' 
                                    : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        aria-label={edit ? "Edit Coupon" : "Save Changes"}
                    >
                        {edit ? <EditIcon className="w-5 h-5" /> : <SaveIcon className="w-5 h-5" />}
                    </button>

                    <button
                        onClick={deleteCoupon}
                        className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors hover:scale-110"
                        aria-label="Delete Coupon"
                    >
                        <DeleteIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>


            <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 text-sm'>
                <div className='flex flex-col col-span-1'>
                    <span className='text-xs font-semibold uppercase text-gray-500'>Code</span>
                    <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className={`p-2 mt-1 rounded-lg text-lg font-mono ${inputClass} ${edit ? 'border-transparent' : ''} w-full`}
                        disabled={edit || isExpired}
                    />
                </div>

                <div className='flex flex-col col-span-1'>
                    <span className='text-xs font-semibold uppercase text-gray-500'>Discount</span>
                    <div className='relative'>
                        <input
                            type="number"
                            min={1}
                            max={100}
                            value={couponDiscount}
                            onChange={(e) => {
                                const value = e.target.value;
                                setCouponDiscount(value === "" ? "" : Number(value));
                            }}
                            className={`p-2 pr-8 mt-1 rounded-lg text-lg font-bold ${inputClass} ${edit ? 'border-transparent' : ''} w-full`}
                            disabled={edit || isExpired}
                        />
                        <span className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-500'>%</span>
                    </div>
                </div>

                <div className='flex flex-col col-span-1'>
                    <span className='text-xs font-semibold uppercase text-gray-500'>Category</span>
                    <input
                        type="text"
                        readOnly
                        value={category}
                        className={`p-2 mt-1 rounded-lg text-gray-700 ${isExpired ? 'bg-red-200' : 'bg-gray-100'} border-transparent w-full`}
                        disabled
                    />
                </div>

                <div className='flex flex-col col-span-1'>
                    <span className='text-xs font-semibold uppercase text-gray-500'>Expires</span>
                    <input
                        type="text"
                        readOnly
                        value={new Date(expiryDate).toLocaleDateString()}
                        className={`p-2 mt-1 rounded-lg ${isExpired ? 'text-red-700 bg-red-200 font-bold' : 'text-gray-700 bg-gray-100'} border-transparent w-full`}
                        disabled
                    />
                </div>

            </div>

            {!edit && !isExpired && (
                <p className="mt-4 text-xs text-blue-600 font-medium">Editing mode active. Click save to apply changes.</p>
            )}
            {isExpired && (
                <p className="mt-4 text-xs text-red-600 font-bold">⚠️ This coupon has expired and cannot be edited.</p>
            )}
        </div>
    )
}

export default CouponCard