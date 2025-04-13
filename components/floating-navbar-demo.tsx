"use client";
import React, { useState, useRef, useEffect } from "react";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { IconHome, IconBriefcase, IconWorld, IconSchool, IconChevronDown, IconBuilding } from "@tabler/icons-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Enhanced BatchDropdown component with animations
const BatchDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const batchYears = ["2023", "2024", "2025", "2026", "2027"];
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="group relative px-2 py-1 flex items-center"
      >
        <span className="relative z-10 block text-base font-medium text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
          Batch
        </span>
        <IconChevronDown className={`ml-1 h-4 w-4 text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 w-36 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 z-50 overflow-hidden"
          >
            <motion.ul 
              className="py-1"
              initial="closed"
              animate="open"
              variants={{
                open: {
                  transition: { staggerChildren: 0.05 }
                },
                closed: {}
              }}
            >
              {batchYears.map((year) => (
                <motion.li
                  key={year}
                  variants={{
                    open: { opacity: 1, y: 0 },
                    closed: { opacity: 0, y: -10 }
                  }}
                >
                  <Link 
                    href={`/batch/${year}`} 
                    className="block px-4 py-2.5 text-sm text-black hover:bg-blue-50 hover:text-blue-600 dark:text-white dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {year} Batch
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FloatingNavDemo() {
  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "All Jobs",
      link: "/all-jobs",
      icon: <IconBriefcase className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Fresher Jobs",
      link: "/fresher-jobs",
      icon: <IconSchool className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Internships",
      link: "/internships",
      icon: <IconWorld className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Remote Jobs",
      link: "/work-from-home",
      icon: <IconBuilding className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "About",
      link: "/about",
      icon: <IconWorld className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Contact",
      link: "/contact",
      icon: <IconSchool className="h-4 w-4 text-neutral-500 dark:text-white" />,
    }
  ];
  
  return (
    <div className="relative w-full">
      <FloatingNav navItems={navItems} batchDropdown={<BatchDropdown />} />
    </div>
  );
} 