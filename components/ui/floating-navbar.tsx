"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Bell, X, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const FloatingNav = ({
  navItems,
  batchDropdown,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: React.ReactElement;
  }[];
  batchDropdown?: React.ReactNode;
  className?: string;
}) => {
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubscriptionStatus("idle");
    setErrorMessage("");

    try {
      // Validate email
      if (!email || !email.includes('@') || !email.includes('.')) {
        throw new Error("Please enter a valid email address");
      }

      // Here you would typically send this to your backend
      // For now, let's simulate a successful subscription
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("User subscribed with email:", email);
      setSubscriptionStatus("success");
      
      // Reset form after success
      setTimeout(() => {
        setEmail("");
        setShowSubscribeModal(false);
        setSubscriptionStatus("idle");
      }, 3000);
      
    } catch (error) {
      console.error("Subscription error:", error);
      setSubscriptionStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "flex fixed top-0 left-0 right-0 w-full backdrop-blur-md bg-white/80 dark:bg-black/80 border-b border-neutral-200 dark:border-neutral-800 z-[5000] px-4 sm:px-8 py-4 items-center justify-center shadow-sm",
          className
        )}
      >
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center relative group">
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-30 blur transition duration-500 group-hover:duration-200"></div>
            <Image 
              src="/JOBLESS_LOGO2.png" 
              alt="JOBLESS Logo" 
              width={120} 
              height={36} 
              className="h-9 w-auto relative"
              priority
            />
          </Link>
          
          {/* Mobile Menu Button */}
          <div className="block md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
          
          {/* Nav Items and Batch Dropdown - Desktop */}
          <div className="hidden md:flex items-center space-x-12">
            {navItems.map((navItem: any, idx: number) => (
              <Link
                key={`link=${idx}`}
                href={navItem.link}
                className="group relative px-2 py-1"
              >
                <span className="relative z-10 block text-base font-medium text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                  {navItem.name}
                </span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            ))}
            {batchDropdown}
          </div>
          
          {/* Subscribe button and Admin link - Desktop */}
          <div className="hidden md:flex items-center">
            <motion.button 
              onClick={() => setShowSubscribeModal(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-base font-medium text-white px-6 py-2.5 rounded-full transition-all duration-300 flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Bell className="w-4 h-4 mr-2" />
              <span>Subscribe</span>
            </motion.button>
            
            {/* Admin link properly positioned */}
            <Link
              href="/admin/login"
              className="group relative ml-6 text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
              aria-label="Admin login"
            >
              <span>Admin</span>
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gray-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 left-0 right-0 bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-800 z-[4999] px-4 py-4 md:hidden shadow-lg"
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((navItem: any, idx: number) => (
                <Link
                  key={`mobile-link=${idx}`}
                  href={navItem.link}
                  className="py-2 px-3 text-base font-medium text-black dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    {navItem.icon && <span className="mr-3">{navItem.icon}</span>}
                    <span>{navItem.name}</span>
                  </div>
                </Link>
              ))}
              
              <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-800">
                <button 
                  onClick={() => {
                    setShowSubscribeModal(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2 px-3 text-base font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors duration-200 flex items-center"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  <span>Subscribe</span>
                </button>
                
                <Link
                  href="/admin/login"
                  className="block w-full py-2 px-3 text-base font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/20 rounded-md transition-colors duration-200 mt-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subscription Modal */}
      <AnimatePresence>
        {showSubscribeModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[6000] flex items-center justify-center p-4"
            onClick={() => setShowSubscribeModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl max-w-md w-full p-6 relative"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowSubscribeModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Get Job Alerts</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Stay updated with the latest job opportunities that match your interests.
                </p>
              </div>
              
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="yourname@example.com"
                      className="w-full pl-4 pr-10 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-800 dark:text-white transition-all duration-200"
                      disabled={isSubmitting}
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                    </div>
                  </div>
                </div>
                
                <AnimatePresence>
                  {subscriptionStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-lg"
                    >
                      {errorMessage}
                    </motion.div>
                  )}
                  
                  {subscriptionStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-lg"
                    >
                      Success! You're now subscribed to job alerts.
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-2.5 px-4 rounded-lg font-medium text-white ${
                    isSubmitting 
                      ? "bg-blue-400 cursor-not-allowed" 
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700"
                  } transition-all duration-300 shadow-md hover:shadow-lg`}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Subscribing...
                    </span>
                  ) : (
                    "Subscribe Now"
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}; 