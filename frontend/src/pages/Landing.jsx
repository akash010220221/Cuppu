import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-50 antialiased">

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">

          <Link to="/" className="text-3xl font-extrabold text-indigo-700 tracking-wider flex items-center gap-1">
            <span className="text-4xl">🏷️</span>
            CUPPU
          </Link>

          <Link
            to="/login"
            className="text-base font-semibold text-indigo-600 hover:text-indigo-800 transition-colors py-2 px-4 rounded-lg border border-indigo-100 hover:border-indigo-300"
          >
            Sign In
          </Link>
        </div>
      </header>

      <main className="relative overflow-hidden bg-linear-to-br from-indigo-50 to-white pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">


            <div className="lg:col-span-7 text-center lg:text-left">

              <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600 mb-3">
                Smart Savings, Zero Stress
              </p>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
                Never Miss a <span className="text-indigo-600">Savings Opportunity</span> Again.
              </h1>

              <p className="text-xl text-gray-600 mb-10 max-w-xl lg:max-w-none">
                Organize, track, and redeem all your digital coupons effortlessly. CUPPU is your personal, secure coupon vault.
              </p>


              <Link
                to="/login"
                className="inline-block px-12 py-4 text-xl font-bold text-white bg-indigo-600 rounded-full shadow-2xl shadow-indigo-500/50 hover:bg-indigo-700 transition-all duration-300 transform hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
              >
                Start Saving Smarter
              </Link>
            </div>


            <div className="lg:col-span-5 hidden lg:block relative p-6">

            </div>

          </div>
        </div>
      </main>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-16">
            Simplify Your Savings Life
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">

            <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-xl transition-all hover:shadow-2xl hover:border-indigo-200">
              <div className="text-5xl text-indigo-600 mb-5">🔒</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Secure Storage</h3>
              <p className="text-gray-600">Keep all your valuable codes protected in a secure, digital vault. Access them anytime, anywhere.</p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-xl transition-all hover:shadow-2xl hover:border-indigo-200">
              <div className="text-5xl text-indigo-600 mb-5">🔔</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Never Miss Expiration</h3>
              <p className="text-gray-600">Get timely, intelligent alerts days before your favorite coupons are set to expire.</p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-xl transition-all hover:shadow-2xl hover:border-indigo-200">
              <div className="text-5xl text-indigo-600 mb-5">🔍</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Instant Search & Filter</h3>
              <p className="text-gray-600">Find the right coupon instantly by store, category, or discount type with smart filtering.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-extrabold text-white mb-6">Stop Clipping, Start Clicking.</h3>

          <Link
            to="/login"
            className="inline-block px-12 py-4 text-lg font-bold text-gray-800 bg-white rounded-full hover:bg-gray-100 transition duration-300 shadow-xl transform hover:scale-105"
          >
            Create Your Free Account
          </Link>

          <p className="text-gray-400 mt-8 text-sm">&copy; {new Date().getFullYear()} Cuppu. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default Landing;