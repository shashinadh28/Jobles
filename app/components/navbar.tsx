'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";

interface NavLinkProps {
  href: string;
  currentPath: string;
  children: React.ReactNode;
}

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    setMounted(true);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [jobsDropdownOpen, setJobsDropdownOpen] = useState(false);

  if (!mounted) return null;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-white shadow-md py-2" : "bg-white/80 backdrop-blur-md py-4"
    }`}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="/JOBLESS_LOGO2.png" 
              alt="Jobless Logo" 
              width={120} 
              height={36} 
              className="h-8 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink href="/" currentPath={pathname}>Home</NavLink>
            
            {/* Jobs Dropdown */}
            <div className="relative group">
              <button 
                className={`group flex items-center px-4 py-2 text-base font-medium rounded-full transition-all duration-200 ${
                  pathname.includes('/jobs') || pathname.includes('/fresher') || pathname.includes('/work-from-home')
                    ? "text-blue-600" 
                    : "text-gray-700 hover:text-blue-600"
                }`}
                onClick={() => setJobsDropdownOpen(!jobsDropdownOpen)}
              >
                Jobs
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                  jobsDropdownOpen ? "rotate-180" : ""
                }`} />
              </button>
              
              <div className={`absolute left-0 mt-2 w-56 origin-top-left transition-all duration-200 transform ${
                jobsDropdownOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
              } bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50`}>
                <div className="py-1">
                  <Link href="/fresher-jobs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    Fresher Jobs
                  </Link>
                  <Link href="/work-from-home" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    Work From Home
                  </Link>
                  <Link href="/internships" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    Internships
                  </Link>
                </div>
              </div>
            </div>
            
            <NavLink href="/about" currentPath={pathname}>About</NavLink>
            <NavLink href="/contact" currentPath={pathname}>Contact</NavLink>
            
            {/* Admin Button */}
            <Link 
              href="/admin/login" 
              className="ml-2 px-5 py-2 rounded-full text-white font-medium transition-all duration-300 
                bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700
                hover:shadow-md hover:scale-105"
            >
              Admin
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Main menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${menuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg rounded-b-lg">
          <MobileNavLink href="/" currentPath={pathname}>Home</MobileNavLink>
          <MobileNavLink href="/fresher-jobs" currentPath={pathname}>Fresher Jobs</MobileNavLink>
          <MobileNavLink href="/work-from-home" currentPath={pathname}>Work From Home</MobileNavLink>
          <MobileNavLink href="/internships" currentPath={pathname}>Internships</MobileNavLink>
          <MobileNavLink href="/about" currentPath={pathname}>About</MobileNavLink>
          <MobileNavLink href="/contact" currentPath={pathname}>Contact</MobileNavLink>
          
          <Link 
            href="/admin/login" 
            className="block w-full text-center px-3 py-2 rounded-md text-white font-medium
              bg-gradient-to-r from-blue-500 to-indigo-600"
          >
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
};

// Enhanced Desktop NavLink Component with Hover Effects
const NavLink = ({ href, currentPath, children }: NavLinkProps) => (
  <Link
    href={href}
    className={`relative px-4 py-2 text-base font-medium rounded-full transition-all duration-200 ${
      currentPath === href 
        ? "text-blue-600" 
        : "text-gray-700 hover:text-blue-600"
    }`}
  >
    {children}
    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform origin-bottom scale-x-0 transition-transform duration-200 ${
      currentPath === href ? "scale-x-100" : "group-hover:scale-x-100"
    }`}></span>
  </Link>
);

// Mobile NavLink Component
const MobileNavLink = ({ href, currentPath, children }: NavLinkProps) => (
  <Link
    href={href}
    className={`block px-3 py-2 rounded-md text-base font-medium ${
      currentPath === href 
        ? "bg-blue-50 text-blue-600" 
        : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
    }`}
  >
    {children}
  </Link>
);

export default Navbar; 