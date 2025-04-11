'use client';

import React from 'react';
import { FaTelegramPlane } from "react-icons/fa";

const TelegramButton = () => {
  // Telegram channel link
  const telegramLink = "https://t.me/joblessofficial";
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button 
        onClick={() => window.open(telegramLink, '_blank')}
        className="telegram-button flex items-center justify-center bg-[#0088cc] text-white w-[45px] h-[45px] rounded-full shadow-md overflow-hidden transition-all duration-300 hover:w-[150px] hover:rounded-[40px] group"
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center justify-center min-w-[45px] transition-all duration-300 group-hover:w-[30%] group-hover:pl-[10px]">
            <FaTelegramPlane className="w-[25px] h-[25px] text-white" />
          </div>
          <span className="text-white font-semibold text-[1.2em] opacity-0 w-0 transition-all duration-300 group-hover:opacity-100 group-hover:w-[70%] group-hover:pr-[10px]">Telegram</span>
        </div>
      </button>
    </div>
  );
};

export default TelegramButton; 