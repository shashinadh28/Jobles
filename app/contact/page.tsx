"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative">
        <BackgroundBeamsWithCollision className="min-h-[40vh] from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="relative z-30 flex flex-col items-center justify-center pt-20 pb-16 text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Contact Us</h1>
            <p className="max-w-2xl text-xl text-gray-600">
              Have questions or suggestions? We'd love to hear from you. Fill out the form below and our team will get back to you as soon as possible.
            </p>
          </div>
        </BackgroundBeamsWithCollision>
      </div>

      <div className="container mx-auto px-4 py-16 -mt-20">
        <div className="max-w-3xl mx-auto">
          <ContactForm />
        </div>
        
        <div className="max-w-4xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Email Us</h3>
            <p className="text-gray-600 mb-2">For general inquiries</p>
            <a href="mailto:info@jobless.com" className="text-blue-600 hover:underline">info@jobless.com</a>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Call Us</h3>
            <p className="text-gray-600 mb-2">Mon-Fri, 9am-5pm</p>
            <a href="tel:+91 9876543210" className="text-blue-600 hover:underline">+91 9876543210</a>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
            <p className="text-gray-600 mb-2">Office Location</p>
            <address className="text-blue-600 not-italic">Noida, Uttar Pradesh, India</address>
          </div>
        </div>
      </div>
    </div>
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