"use client";

import { useState, useEffect } from "react";
import { JobsList } from "@/components/jobs-list";
import Link from "next/link";
import { Search, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import Footer from "@/components/ui/Footer";
import { TypeAnimation } from 'react-type-animation';
import LoadingAnimation from '@/components/ui/loading-animation';
import { useForm } from 'react-hook-form';
import { Send } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("all");
  const [selectedBatchYear, setSelectedBatchYear] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isIndexError, setIsIndexError] = useState(false);

  const locations = [
    { name: "Noida", jobs: 1200, image: "/noida.png" },
    { name: "Bengaluru", jobs: 2500, image: "/bengaluru.png" },
    { name: "Mumbai", jobs: 1800, image: "/mumbai.png" },
    { name: "Pune", jobs: 900, image: "/pune.png" },
    { name: "Kolkata", jobs: 800, image: "/kolkata.png" },
    { name: "Hyderabad", jobs: 1100, image: "/hyderabad.png" },
    { name: "Chennai", jobs: 950, image: "/chennai.png" },
    { name: "Delhi", jobs: 1500, image: "/delhi.png" },
  ];

  const batchYears = ["2027", "2026", "2025", "2024", "2023", "2022"];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    const timer = setTimeout(() => {
      setRefreshKey(prevKey => prevKey + 1);
      console.log(`Refreshing search results for: "${value}"`);
    }, 300);
    
    return () => clearTimeout(timer);
  };

  const handleExperienceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setExperienceLevel(e.target.value);
    setRefreshKey(prevKey => prevKey + 1);
  };

  const handleBatchYearChange = (batchYear: string | null) => {
    setSelectedBatchYear(batchYear);
    setIsIndexError(false);
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
     <div>
      <LoadingAnimation />
      {/* Hero Section with Background Beams */}
      <BackgroundBeamsWithCollision className="min-h-[90vh] from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
        <motion.div 
          className="relative z-30 max-w-5xl mx-auto text-center pt-12 md:pt-16"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          <motion.div 
            className="mb-8"
            variants={fadeIn}
          >
            <h1 className="relative text-6xl md:text-8xl lg:text-9xl font-extrabold text-center mb-4">
              <span className="oswald-font bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 via-blue-900 to-blue-950 drop-shadow-[0_5px_5px_rgba(0,0,100,0.2)] flex items-center justify-center">
                JoBless
                <Image 
                  src="/globe-icon.png" 
                  alt="Globe Icon" 
                  width={96}
                  height={96}
                  className="w-12 h-12 md:w-16 md:h-16 ml-2 animate-pulse"
                  priority
                />
              </span>
              <div className="absolute -bottom-3 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-600 transform scale-x-0 animate-expandWidth"></div>
            </h1>
            
            <div className="text-3xl md:text-5xl lg:text-6xl mt-6 pb-3 md:pb-5 font-semibold bg-gradient-to-r from-gray-700 via-gray-900 to-black bg-clip-text text-transparent">
              <TypeAnimation
                sequence={[
                  'Your daily dose of career blessings.',
                  1000,
                  'Your gateway to opportunities.',
                  1000,
                  'Your next career move starts here.',
                  1000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                cursor={true}
                className="typing-animation"
              />
            </div>
          </motion.div>
          
          <motion.p 
            className="text-lg text-center max-w-2xl mx-auto mb-6 pt-0 md:pt-3 text-gray-800" 
            variants={fadeIn}
          >
            Browse through thousands of job listings updated daily. From fresh graduate positions to remote opportunities - your next career move starts here.
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap gap-3 justify-center"
            variants={fadeIn}
          >
            <Link
              href="/fresher-jobs"
              className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-all hover:shadow-lg hover:scale-105"
            >
              Fresher Jobs
            </Link>
            <Link
              href="/internships"
              className="px-6 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-all hover:shadow-lg hover:scale-105"
            >
              Internships
            </Link>
            <Link
              href="/work-from-home"
              className="px-6 py-3 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-all hover:shadow-lg hover:scale-105"
            >
              Work From Home
            </Link>
          </motion.div>
        </motion.div>
      </BackgroundBeamsWithCollision>

      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Featured categories */}
        <section className="mb-12 md:mb-24">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4 text-center">
              <span className="text-black dark:md:text-white">Latest</span> <span className="text-blue-600">Job Listings</span>
            </h2>
            <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
              Explore the newest opportunities added to our platform
            </p>
          </div>
          
          {/* Search and filters */}
          <div className="mb-6 md:mb-10 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Search className="w-5 h-5 text-blue-500" />
              </div>
              <input 
                type="text" 
                className="block w-full rounded-full border border-gray-300 bg-white p-4 pl-12 text-base focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-neutral-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500" 
                placeholder="Search jobs by title, company or skills..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <select
              className="rounded-full border border-gray-300 bg-white p-4 text-base focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-neutral-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              value={experienceLevel}
              onChange={handleExperienceChange}
            >
              <option value="all">All Experience Levels</option>
              <option value="entry">Entry Level (0-2 years)</option>
              <option value="mid">Mid Level (2-5 years)</option>
              <option value="senior">Senior Level (5+ years)</option>
            </select>
          </div>
          
          {/* Category buttons that link to dedicated pages */}
          <div className="mb-12 flex flex-wrap justify-center gap-3">
            <Link href="/latest-jobs">
              <CategoryButton active={true}>
                Latest Jobs
              </CategoryButton>
            </Link>
            
            <Link href="/all-jobs">
              <CategoryButton active={false}>
                All Jobs
              </CategoryButton>
            </Link>
            
            <Link href="/fresher-jobs">
              <CategoryButton active={false}>
                Fresher Jobs
              </CategoryButton>
            </Link>
            
            <Link href="/work-from-home">
              <CategoryButton active={false}>
                Work From Home
              </CategoryButton>
            </Link>
            
            <Link href="/internships">
              <CategoryButton active={false}>
                Internships
              </CategoryButton>
            </Link>
          </div>
          
          {/* Batch year buttons */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-center mb-4">Filter by Batch Year</h3>
            <div className="flex flex-wrap justify-center gap-2">
              <BatchButton 
                active={selectedBatchYear === null} 
                onClick={() => handleBatchYearChange(null)}
              >
                All Batches
              </BatchButton>
              
              {batchYears.map(year => (
                <BatchButton 
                  key={year}
                  active={selectedBatchYear === year} 
                  onClick={() => handleBatchYearChange(year)}
                >
                  {year} Batch
                </BatchButton>
              ))}
            </div>
            
            {isIndexError && (
              <div className="mt-4 mx-auto max-w-md rounded-lg bg-amber-50 p-3 text-center text-amber-800 border border-amber-200">
                <p>The search index is still being created. This may take a few minutes. Please try again shortly.</p>
              </div>
            )}
          </div>
          
          {/* Latest Jobs Section with Load More Button */}
          <div className="mb-12">
            <JobsList 
              key={`latest-${refreshKey}`}
              type="all" 
              initialJobsPerPage={8}
              searchQuery={searchQuery}
              experienceLevel={experienceLevel}
              batchYear={selectedBatchYear || ''}
              onIndexError={setIsIndexError}
            />
            
            <div className="mt-8 flex justify-center">
              <Link href="/latest-jobs" 
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-all shadow hover:shadow-md"
              >
                Load More Jobs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Jobs by location section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Jobs by Location</h2>
              <p className="text-gray-600">Find opportunities in your preferred city</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {locations.map((location) => (
                <Link
                  key={location.name}
                  href={`/location/${location.name.toLowerCase()}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={location.image}
                        alt={location.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-xl font-semibold text-white">{location.name}</h3>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        {/* Contact Us Section */}
        <section id="contact-us" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Have questions or suggestions? We'd love to hear from you. Fill out the form below and our team will get back to you as soon as possible.</p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <ContactForm />
            </div>
          </div>
        </section>
      </div>
      <Footer />
     </div>
  );
}

interface CategoryButtonProps {
  children: React.ReactNode;
  active: boolean;
}

function CategoryButton({ children, active }: CategoryButtonProps) {
  return (
    <div
      className={`rounded-full px-6 py-3 text-base font-medium transition-all ${
        active 
          ? "bg-blue-600 text-white shadow-md" 
          : "bg-white text-neutral-600 border border-neutral-200 hover:border-blue-300 hover:text-blue-600 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700 dark:hover:border-blue-700"
      }`}
    >
      {children}
     </div>
  );
}

interface BatchButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

function BatchButton({ children, active, onClick }: BatchButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
        active 
          ? "bg-indigo-600 text-white shadow-md" 
          : "bg-white text-neutral-600 border border-neutral-200 hover:border-indigo-300 hover:text-indigo-600"
      }`}
    >
      {children}
    </button>
  );
}

function ContactForm() {
  interface FormData {
    name: string;
    email: string;
    message: string;
  }
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>();
  const [isSuccess, setIsSuccess] = useState(false);
  
  const onSubmit = async (data: FormData) => {
    try {
      // Here you can add your actual form submission logic
      console.log('Form data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSuccess(true);
      reset();
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
      {isSuccess ? (
        <div className="text-center py-8">
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">Thank You!</h3>
          <p className="text-gray-600">Your message has been sent successfully. We'll get back to you soon.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              id="name"
              type="text"
              className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Your name"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message?.toString()}</p>}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Your email address"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message?.toString()}</p>}
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              id="message"
              rows={5}
              className={`w-full px-4 py-3 rounded-lg border ${errors.message ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Your message"
              {...register('message', { required: 'Message is required' })}
            ></textarea>
            {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message?.toString()}</p>}
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            {isSubmitting ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </>
            )}
          </button>
        </form>
      )}
     </div>
  );
}
