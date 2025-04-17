'use client';
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

// SVG path array spelling "JoBless"
const pathArr = [
  'M11.40 20.40L19.40 20.40L19.40 40.45Q19.40 46.55 16.80 49.52Q14.20 52.50 8 52.50Q5.45 52.50 3.70 52.25Q1.95 52 0 51.35L0 44.50L0.20 44.40Q1.75 44.90 3.10 45.15Q4.45 45.40 6.45 45.40Q8.55 45.40 9.63 44.92Q10.70 44.45 11.08 43.20Q11.45 41.95 11.45 39.60L11.40 20.40Z',
  'M23.40 40.05Q23.40 33.35 26.25 30.40Q29.10 27.45 35.90 27.45Q40.45 27.45 43.20 28.75Q45.95 30.05 47.18 32.83Q48.40 35.60 48.40 40.05Q48.40 44.45 47.18 47.20Q45.95 49.95 43.20 51.23Q40.45 52.50 35.90 52.50Q29.10 52.50 26.25 49.58Q23.40 46.65 23.40 40.05M35.90 45.65Q38.80 45.65 39.83 44.38Q40.85 43.10 40.85 39.90Q40.85 36.85 39.83 35.52Q38.80 34.20 35.90 34.20Q33.10 34.20 32.03 35.52Q30.95 36.85 30.95 39.90Q30.95 43.10 32.03 44.38Q33.10 45.65 35.90 45.65Z',
  'M79.45 43.95Q79.45 47.95 76.98 50Q74.50 52.05 68.25 52.05L52.65 52.05L52.65 20.40L54.60 20.40L54.60 20.40L67.75 20.40Q71.90 20.40 74.23 21.27Q76.55 22.15 77.50 23.85Q78.45 25.55 78.45 28.10Q78.45 31.60 76.78 33.52Q75.10 35.45 70.50 35.85L70.50 36Q73.90 36.25 75.85 37.13Q77.80 38 78.63 39.65Q79.45 41.30 79.45 43.95M65.55 26.70L60.65 26.70L60.65 32.90L65.55 32.90Q68 32.90 69.10 32.27Q70.20 31.65 70.20 29.80Q70.20 28 69.10 27.35Q68 26.70 65.55 26.70M66.55 39.45L60.65 39.45L60.65 45.80L66.55 45.80Q69 45.80 70.10 45.13Q71.20 44.45 71.20 42.60Q71.20 40.70 70.10 40.08Q69 39.45 66.55 39.45Z',
  'M91.95 52.05L83.95 52.05L83.95 18.40L91.95 18.40L91.95 52.05Z',
  'M107.92 44.90Q112.75 44.90 115.17 43.62Q117.60 42.35 117.60 39.05Q117.60 36.90 116.33 35.65Q115.05 34.40 112.75 33.95Q110.45 33.50 106.35 33.05Q102.20 32.65 99.90 31.32Q97.60 30 96.33 27.98Q95.05 25.95 95.05 22.75Q95.05 19.40 96.60 16.90Q98.15 14.40 101.35 13.23Q104.55 12.05 109.55 12.05Q113.50 12.05 116.75 12.57Q120 13.10 122.40 14L122.15 22.10L121.95 22.20Q119.30 21.25 116.53 20.75Q113.75 20.25 110.20 20.25Q105.50 20.25 103.30 21.45Q101.10 22.65 101.10 25.10Q101.10 27.20 102.45 28.25Q103.80 29.30 108.85 29.85Q113.75 30.40 116.15 31.68Q118.55 32.95 119.50 34.95Q120.45 36.95 120.45 40.15Q120.45 46.45 116.38 49.48Q112.30 52.50 103.70 52.50Q99.70 52.50 96.67 52.13Q93.65 51.75 91.55 51.05L91.70 42.70L91.90 42.60Q93.80 43.40 97.23 44.15Q100.65 44.90 107.92 44.90Z',
  'M138.55 52.05L130.55 52.05L130.55 18.40L138.55 18.40L138.55 52.05Z',
  'M149.25 45.15Q153.15 46.25 157.90 46.25Q160.20 46.25 161.35 46.10Q162.50 45.95 162.90 45.60Q163.30 45.25 163.30 44.65Q163.30 43.80 162.68 43.60Q162.05 43.40 160.20 43.05L156.25 42.30Q152.45 41.55 150.78 39.92Q149.10 38.30 149.10 35.05Q149.10 30.65 151.73 29.05Q154.35 27.45 160.10 27.45Q163.55 27.45 166.18 27.82Q168.80 28.20 170.55 28.75L170.45 34.80L170.30 34.95Q166.25 33.65 161.45 33.65Q159.10 33.65 158.18 33.97Q157.25 34.30 157.25 35.25Q157.25 35.75 157.53 36.05Q157.80 36.35 158.80 36.63Q159.80 36.90 161.95 37.30L165.60 38Q168.65 38.65 170.10 40.15Q171.55 41.65 171.55 44.90Q171.55 47.75 170.50 49.42Q169.45 51.10 166.98 51.80Q164.50 52.50 160.15 52.50Q156.85 52.50 154.08 52.17Q151.30 51.85 149.10 51.40L149.10 45.25L149.25 45.15Z',
];

const Footer = () => {
  const ref = useRef(null);
  const isInView = useInView(ref);

  const variants = {
    hidden: { translateY: 200 },
    visible: (i: number) => ({
      translateY: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
        duration: 0.4,
        delay: i * 0.03,
      },
    }),
  };

  return (
    <footer className="bg-[#f7f7f7] py-10 px-4 text-black" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-xl font-medium italic border-2 border-blue-500 py-4 px-6 rounded-lg bg-blue-50 mb-8">
          JoBless: Your daily dose of job blessings – helping freshers, graduates & pros land their dream roles!
        </p>

        {/* Animated Logo */}
        <svg viewBox="0 0 180 60" fill="black" xmlns="http://www.w3.org/2000/svg" className="mx-auto w-full max-w-4xl h-auto">
          {pathArr.map((path, index) => (
            <motion.path
              key={index}
              d={path}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={variants}
              custom={index}
              stroke="black"
              strokeWidth="1"
              fill="black"
            />
          ))}
        </svg>

        {/* Footer Links */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div>
            <h3 className="font-medium text-lg mb-3">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-3">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy-policy" className="text-gray-600 hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-use" className="text-gray-600 hover:text-blue-600 transition-colors">Terms of Service</Link></li>
              <li><Link href="/disclaimer" className="text-gray-600 hover:text-blue-600 transition-colors">Disclaimer</Link></li>
              <li><Link href="/cookie-policy" className="text-gray-600 hover:text-blue-600 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-3">Job Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/fresher-jobs" className="text-gray-600 hover:text-blue-600 transition-colors">Fresher Jobs</Link></li>
              <li><Link href="/work-from-home" className="text-gray-600 hover:text-blue-600 transition-colors">Work From Home</Link></li>
              <li><Link href="/internships" className="text-gray-600 hover:text-blue-600 transition-colors">Internships</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-3">Connect With Us</h3>
            <ul className="space-y-2">
              <li><a href="https://t.me/JoBless128" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors">Telegram</a></li>
              <li><a href="mailto:durgashashinadhwork@gmail.com" className="text-gray-600 hover:text-blue-600 transition-colors">Email Us</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-10 text-center text-sm text-gray-500 border-t border-gray-200 pt-6">
          &copy; {new Date().getFullYear()} JoBless. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
