'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const BuyMeCoffee = () => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-500 p-6 shadow-xl">
        {/* Animated Circles */}
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/10 blur-xl"></div>
        <div className="absolute bottom-0 left-0 h-24 w-24 translate-y-1/2 -translate-x-1/2 rounded-full bg-white/10 blur-lg"></div>
        
        <div className="relative flex flex-col items-start gap-y-5">
          {/* Coffee Cup Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path
                d="M18 8H19C20.0544 8 20.5812 8 21.0001 8.21799C21.3765 8.40973 21.6903 8.71569 21.886 9.0908C22.1042 9.50766 22.1075 10.0335 22.114 11.0853L22.1558 16.0865C22.1642 17.4748 22.1685 18.169 21.9675 18.7004C21.7832 19.1816 21.4691 19.5956 21.0637 19.8943C20.6031 20.2344 19.9217 20.3575 18.5589 20.6037C17.9789 20.7151 17.4691 20.8006 17.0353 20.8608C16.6537 20.9142 16.3251 20.9547 16.0439 20.9849C14.1271 21.1781 12.1575 21.1781 10.2408 20.9849C9.95951 20.9547 9.63091 20.9142 9.24926 20.8608C8.81555 20.8006 8.30566 20.7151 7.72566 20.6037C6.36289 20.3575 5.68151 20.2344 5.2209 19.8943C4.81555 19.5956 4.50138 19.1816 4.31709 18.7004C4.11615 18.169 4.12041 17.4748 4.12893 16.0865L4.17068 11.0853C4.17719 10.0335 4.18045 9.50766 4.3987 9.0908C4.59434 8.71569 4.90812 8.40973 5.28445 8.21799C5.70334 8 6.23016 8 7.28378 8H8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.5 4H9.5M14.5 8H9.5M14.5 12H9.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 16H10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          
          {/* Title and Description */}
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-white">Buy Me Millions Coffee</h3>
            <p className="text-sm text-white/90">
              Support our work - your generosity keeps our job portal running and helps us improve for everyone!
            </p>
          </div>
          
          {/* Action Button */}
          <Link 
            href="https://www.buymeacoffee.com/joBless" 
            target="_blank"
            className="group relative overflow-hidden rounded-lg bg-white/10 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 active:translate-y-1"
          >
            <span className="relative z-10">Buy Me a Coffee</span>
            
            {/* Ripple Effect */}
            <span className="absolute left-0 top-0 -z-10 h-full w-full">
              <span className="absolute left-1/2 top-1/2 h-0 w-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40 opacity-0 transition-all duration-500 group-hover:h-32 group-hover:w-32 group-hover:opacity-100"></span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyMeCoffee; 