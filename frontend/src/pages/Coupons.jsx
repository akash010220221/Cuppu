import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import CouponCard from '../components/CouponCard';
import FilterIcon from '../icons/FilterIcon';

const CATEGORIES = ["Food", "Travel", "Electronics", "Hotels", "Clothes", "Others"];

const Coupons = () => {
    const { user, coupon } = useAuth();
    const searchRef = useRef();
    const timeoutRef = useRef();

    const [viewMode, setViewMode] = useState('active');

    const [filtered, setFiltered] = useState(coupon);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedExpiryDate, setSelectedExpiryDate] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const getMinDate = () => {
        const today = new Date();
        today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
        return today.toISOString().split('T')[0];
    };

    const minDate = getMinDate();
    const isFilterActive = selectedCategory || selectedExpiryDate;

    const isCouponExpired = (expiryDateString) => {
        const expiryDate = new Date(expiryDateString);
        const today = new Date();

        today.setHours(0, 0, 0, 0);
        expiryDate.setHours(0, 0, 0, 0);
        return expiryDate.getTime() < today.getTime();
    };

    const applyFilters = (searchValue, categoryValue, dateValue, mode) => {
        const searchVal = searchValue.toLowerCase().trim();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const result = coupon.filter((c) => {
            const expiredStatus = isCouponExpired(c.expiryDate);
            let matchesViewMode = true;

            if (mode === 'active') {
                matchesViewMode = !expiredStatus;
            } else if (mode === 'expired') {
                matchesViewMode = expiredStatus;
            }
            
            const matchesSearch = c.title.toLowerCase().includes(searchVal);
            const matchesCategory = categoryValue ? c.category === categoryValue : true;

            let matchesDate = true;
            if (dateValue) {
                const couponExpiry = new Date(c.expiryDate);
                const filterDate = new Date(dateValue);
                matchesDate = couponExpiry.getTime() <= filterDate.getTime();
            }

            return matchesViewMode && matchesSearch && matchesCategory && matchesDate;
        });

        setFiltered(result);
    };

    const handleSearch = () => {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => {
            const searchValue = searchRef.current.value;
            applyFilters(searchValue, selectedCategory, selectedExpiryDate, viewMode);
        }, 500)
    }

    const handleCategorySelect = (category) => {
        const newCategory = selectedCategory === category ? null : category;
        setSelectedCategory(newCategory);
        const searchValue = searchRef.current ? searchRef.current.value : '';
        applyFilters(searchValue, newCategory, selectedExpiryDate, viewMode);
    }
    
    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setSelectedExpiryDate(newDate);
        const searchValue = searchRef.current ? searchRef.current.value : '';
        applyFilters(searchValue, selectedCategory, newDate, viewMode);
    }


    const handleViewModeChange = (mode) => {
        setViewMode(mode);
        setSelectedCategory(null);
        setSelectedExpiryDate('');
        searchRef.current.value = '';

        applyFilters('', null, '', mode);
    }


    useEffect(() => {
        const searchValue = searchRef.current ? searchRef.current.value : '';
        applyFilters(searchValue, selectedCategory, selectedExpiryDate, viewMode);
    }, [coupon, selectedCategory, selectedExpiryDate, viewMode]);

    useEffect(() => {
        applyFilters('', null, '', 'active');
    }, [coupon]);


    return (
        <div className='p-6 md:p-10 min-h-screen bg-gray-50'>
            <h1 className='text-3xl font-extrabold text-gray-900 mb-6'>Coupon Inventory</h1>

            <div className='flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4'>
                <div className='flex bg-white p-1 rounded-xl shadow-md border border-gray-200'>
                    <button
                        onClick={() => handleViewModeChange('active')}
                        className={`py-2 px-4 rounded-lg font-semibold text-sm transition-colors w-full md:w-auto ${viewMode === 'active'
                            ? 'bg-indigo-600 text-white shadow-indigo-400/50 shadow'
                            : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Active Coupons
                    </button>
                    <button
                        onClick={() => handleViewModeChange('expired')}
                        className={`py-2 px-4 rounded-lg font-semibold text-sm transition-colors w-full md:w-auto ${viewMode === 'expired'
                            ? 'bg-indigo-600 text-white shadow-indigo-400/50 shadow'
                            : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Expired Coupons
                    </button>
                </div>

                <div className='flex gap-4 relative w-full md:w-auto'>
                    <input
                        placeholder='Search by Coupon Title...'
                        ref={searchRef}
                        onChange={handleSearch}
                        className='border-2 focus:border-indigo-600 focus:ring-indigo-600 outline-none border-gray-300 bg-white p-3 text-lg rounded-xl w-full transition-colors shadow-sm'
                    />

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`py-3 px-5 text-lg rounded-xl flex gap-1 justify-center items-center cursor-pointer transition-colors font-medium
                            ${showFilters || isFilterActive ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-700 text-white hover:bg-black'}`}
                    >
                        <FilterIcon className="w-5 h-5"/>
                        <p>Filter</p>
                        {isFilterActive && <span className='w-2 h-2 rounded-full bg-red-400 absolute top-1 right-1'></span>}
                    </button>

                    {showFilters && (
                        <div className='absolute z-20 right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-2xl p-4'>
                            
                            <h4 className='text-md font-bold text-gray-800 mb-3 border-b pb-2'>Apply Filters</h4>
                            
                            <div className='mb-4'>
                                <p className='text-sm font-semibold text-gray-700 mb-2'>By Category:</p>
                                <div className='flex flex-wrap gap-2'>
                                    <button
                                        onClick={() => handleCategorySelect(null)}
                                        className={`text-xs py-1.5 px-3 rounded-full border transition-colors font-medium
                                            ${selectedCategory === null ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                                    >
                                        All Categories
                                    </button>
                                    {CATEGORIES.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => handleCategorySelect(category)}
                                            className={`text-xs py-1.5 px-3 rounded-full border transition-colors font-medium
                                                ${selectedCategory === category ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className='mb-2'>
                                <p className='text-sm font-semibold text-gray-700 mb-2'>Expires On or Before:</p>
                                <input
                                    type='date'
                                    value={selectedExpiryDate}
                                    onChange={handleDateChange}
                                    min={minDate}
                                    className='w-full border border-gray-300 p-2 rounded-lg focus:border-indigo-600 outline-none transition-colors'
                                />
                                {selectedExpiryDate && (
                                    <button
                                        onClick={() => handleDateChange({ target: { value: '' } })}
                                        className='w-full mt-2 text-sm text-red-600 hover:text-red-800 font-medium'
                                    >
                                        Clear Date Filter
                                    </button>
                                )}
                            </div>
                            
                            <p className='text-xs text-center text-gray-500 mt-3 pt-3 border-t'>Filters applied immediately.</p>
                        </div>
                    )}
                </div>
            </div>

            {viewMode === 'expired' && (
                <div className='mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-lg shadow-sm'>
                    <p className='font-semibold text-sm'>
                        Cleanup Reminder:
                        <span className='font-normal'> Expired coupons will be automatically deleted from your inventory 3 days after their expiration date.</span>
                    </p>
                </div>
            )}


            <h2 className='text-xl font-bold text-gray-800 mb-4'>
                Showing {filtered?.length} {viewMode === 'active' ? 'Active' : 'Expired'} {filtered?.length === 1 ? 'Coupon' : 'Coupons'}
            </h2>
            <div className='flex flex-wrap justify-center md:justify-start gap-6'>
                {filtered?.length > 0 ? (
                    filtered.map((c) => (<CouponCard {...c} key={c._id} />))
                ) : (
                    <div className='w-full p-10 bg-white rounded-xl shadow-inner border border-dashed border-gray-300 flex flex-col justify-center items-center text-center'>
                        <p className='text-5xl mb-3'>🤷‍♂️</p>
                        <p className='text-xl font-semibold text-gray-700'>
                            No {viewMode === 'active' ? 'active' : 'expired'} coupons found
                            {isFilterActive && " matching your current filters"}.
                        </p>
                        <p className='text-md text-gray-500 mt-1'>
                            {viewMode === 'active' ? "Your coupon vault is empty or all coupons are expired." : "You have no expired coupons on record."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Coupons;