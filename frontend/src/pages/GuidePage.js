import React from 'react';
import { Link } from 'react-router-dom';

const GuidePage = () => {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4 mt-8 ">
        <h1 className="text-3xl md:text-4xl font-bold text-purple-800 mb-1 mt-8 ">คำแนะนำ</h1>
        <h1 className="text-3xl md:text-3xl font-bold text-black mb-5">การใช้งานเว็บไซต์</h1>
        <div className="flex flex-col md:flex-row items-start justify-between">
          <div className="w-full md:w-1/2 pr-4 mb-8 md:mb-0 mt-5">
            <p className="text-lg mb-4">
              Customer satisfaction is our priority, and we ensure to deliver what we promise. Let us align our innovative ideas and strategies to your needs to generate unique and powerful results.
            </p>
            <p className="text-lg mb-4">
              We meet challenging content requirements of your business, whether you are a startup or an enterprise. If you are looking to make a mark on the web through innovative marketing content, we can serve it best.
            </p>
            <p className="text-lg mb-4">
              But who has time to run their business and pound away at the keyboard to get content on schedule and on target?
            </p>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-6">
              <Link
                to="/report"
                className="bg-purple-600 text-white text-lg px-8 py-4 rounded-md hover:bg-purple-700 transition duration-300 text-center"
              >
                รายงานการชำรุด
              </Link>
              <Link
                to="/dashboard"
                className="bg-gray-200 text-black text-lg px-8 py-4 rounded-md hover:bg-gray-300 transition duration-300 text-center"
              >
                ประวัติรายการ
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 mt-8 md:mt-0 overflow-hidden">
            <div className="transform scale-130 origin-center">
              <img
                src="/Website recommendations.png"
                alt="คำแนะนำการใช้งาน"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidePage;