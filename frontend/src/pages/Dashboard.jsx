import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import CouponCard from '../components/CouponCard';
import { CreateCoupon } from '../components/createCoupon';
import PlusIcon from "../icons/PlusIcon";
import { Link } from 'react-router-dom';

const MetricCard = ({ title, count, icon, colorClass, bgColorClass, showExpiring = false }) => (
  <div className={`p-6 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] 
                    ${bgColorClass} flex flex-col justify-between h-32`}>
    <div className="flex items-center justify-between">
      <h3 className={`text-sm font-semibold uppercase ${colorClass}`}>{title}</h3>
      {icon}
    </div>
    <p className={`text-4xl font-extrabold ${colorClass} mt-auto`}>
      {count}
    </p>
    {showExpiring && (
      <p className="text-xs text-red-300 mt-1">Coupons expiring soon</p>
    )}
  </div>
);


const Dashboard = () => {
  const { user, coupon } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [expiring, setExpiring] = useState([]);

  const expiringCoupons = () => {
    const EIGHT_DAYS_IN_MS = 8 * 24 * 60 * 60 * 1000;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const nowTimestamp = startOfToday.getTime();

    const sevenDaysFromNow = nowTimestamp + EIGHT_DAYS_IN_MS;

    const expiringCouponsList = [];

    coupon.forEach(element => {

      const expiryDate = new Date(element.expiryDate);
      expiryDate.setHours(0, 0, 0, 0);
      const expiryTimestamp = expiryDate.getTime();

      if (expiryTimestamp >= nowTimestamp && expiryTimestamp < sevenDaysFromNow) {
        expiringCouponsList.push(element);
      }
    });

    expiringCouponsList.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

    setExpiring(expiringCouponsList.slice(0, 3));
  };

  useEffect(() => {
    if (coupon && coupon.length > 0) {
      expiringCoupons();
    } else {
      setExpiring([]);
    }
  }, [coupon]);

  const totalCouponsCount = coupon?.length || 0;
  const expiringCouponsCount = expiring.length;

  return (
    <div className='p-6 md:p-10 min-h-screen bg-gray-50'>
      <header className='mb-8 border-b pb-4 flex flex-col md:flex-row justify-between items-start md:items-center'>

        <div className='font-extrabold text-4xl text-gray-900 mb-4 md:mb-0'>
          Welcome back, {user?.firstName}!
        </div>

        <button
          className='w-full md:w-auto 
               bg-indigo-600 text-white 
               hover:bg-indigo-700 active:bg-indigo-800 
               text-base font-bold 
               py-3 px-6 rounded-xl 
               flex gap-2 justify-center items-center 
               shadow-lg shadow-indigo-500/50 
               transition-all transform hover:scale-[1.02] cursor-pointer'
          onClick={() => setModalOpen(true)}
        >
          <PlusIcon className="w-5 h-5" />
          Add Coupon
        </button>
      </header>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>

        <div className='lg:col-span-1 space-y-6'>

          <div className='space-y-4'>
            <h2 className='text-xl font-bold text-gray-700'>Coupon Summary</h2>
            <MetricCard
              title="Total Active Coupons"
              count={totalCouponsCount}
              icon={<span className='text-xl text-blue-300'>🎁</span>}
              colorClass="text-blue-900"
              bgColorClass="bg-blue-100"
            />
            <MetricCard
              title="Expiring Next 7 Days"
              count={expiringCouponsCount}
              icon={<span className='text-xl text-red-300'>⚠️</span>}
              colorClass="text-red-900"
              bgColorClass="bg-red-100"
              showExpiring={true}
            />
          </div>

          <div className='p-6 bg-white rounded-xl shadow-md border border-gray-200'>
            <h3 className='text-lg font-bold text-gray-800 mb-3'>Manage Coupons</h3>
            <p className='text-sm text-gray-600 mb-4'>
              Need to view, edit, or search all existing coupons?
            </p>
            <Link
              to="/coupons"
              className='w-full text-center block bg-gray-200 text-slate-700 hover:bg-gray-300 font-medium py-2 rounded-lg transition-colors text-sm'
            >
              Go to Coupon List
            </Link>
          </div>

        </div>

        <div className='lg:col-span-2'>
          <h2 className='text-2xl font-bold text-red-600 mb-4 border-b pb-2 flex items-center gap-2'>
            <span className='text-3xl'>🚨</span> Expiring Soon (Next 7 Days)
          </h2>

          {expiring.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {expiring.map((c) => (
                <CouponCard key={c._id} {...c} />
              ))}
            </div>
          ) : (
            <div className='p-8 bg-white rounded-xl shadow-inner border border-dashed border-gray-300 flex flex-col justify-center items-center text-center'>
              <p className='text-3xl mb-3'>🎉</p>
              <p className='text-xl font-semibold text-gray-700'>All Clear!</p>
              <p className='text-md text-gray-500 mt-1'>
                No coupons are set to expire within the next 7 days.
              </p>
            </div>
          )}
        </div>
      </div>

      <CreateCoupon open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

export default Dashboard;