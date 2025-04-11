"use client";

import { useState, useEffect } from "react";
import { JobsList } from "@/components/jobs-list";
import Link from "next/link";
import { Search, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import Footer from "@/components/ui/Footer";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);

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

  return (
     <div>
      {/* Hero Section with Background Beams */}
      <BackgroundBeamsWithCollision className="min-h-[100vh] from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
        <motion.div 
          className="relative z-30 max-w-5xl mx-auto text-center"
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
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-center text-neutral-900 dark:text-white mb-8"
            variants={fadeIn}
          >
            Find Your <span className="text-blue-600 relative">
              Dream Job
              <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-200/50 dark:bg-blue-700/30 -z-10 rounded-md"></span>
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-center text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto mb-12"
            variants={fadeIn}
          >
            Browse through thousands of job listings updated daily. From fresh graduate positions to 
            remote opportunities - your next career move starts here.
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap gap-4 justify-center"
            variants={fadeIn}
          >
            <Link
              href="/fresher-jobs"
              className="px-8 py-4 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-all hover:shadow-lg hover:scale-105"
            >
              Fresher Jobs
            </Link>
            <Link
              href="/internships"
              className="px-8 py-4 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-all hover:shadow-lg hover:scale-105"
            >
              Internships
            </Link>
            <Link
              href="/work-from-home"
              className="px-8 py-4 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-all hover:shadow-lg hover:scale-105"
            >
              Work From Home
            </Link>
          </motion.div>
        </motion.div>
      </BackgroundBeamsWithCollision>

      <div className="container mx-auto px-4 py-20">
        {/* Featured categories */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              Latest <span className="text-blue-600">Job Listings</span>
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
              Explore the newest opportunities added to our platform
            </p>
          </div>
          
          {/* Search and filters */}
          <div className="mb-10 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
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
          
          {/* Latest Jobs Section with See More Button */}
          <div className="mb-12">
            <JobsList 
              key={`latest-${refreshKey}`}
              type="all" 
              initialJobsPerPage={6}
              searchQuery={searchQuery}
              experienceLevel={experienceLevel}
            />
            
            <div className="mt-8 flex justify-center">
              <Link href="/latest-jobs" 
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-all shadow hover:shadow-md"
              >
                See More Jobs <ArrowRight className="w-4 h-4" />
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
