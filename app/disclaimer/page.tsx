'use client';
import React from 'react';

const Disclaimer = () => {
  return (
    <div className="container mx-auto px-4 py-10 prose max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Disclaimer</h1>
      <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Website Disclaimer</h2>
        <p>
          The information provided by JobLess ("we," "us," or "our") on our website (the "Site") is for general informational purposes only. 
          All information on the Site is provided in good faith, however we make no representation or warranty of any kind, express or implied, 
          regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Job Listings Disclaimer</h2>
        <p>
          JobLess acts as a platform that connects job seekers with potential employers. While we strive to maintain accurate and up-to-date job listings, 
          we cannot guarantee the accuracy, currency, or completeness of job postings. We do not endorse or take responsibility for the content of job listings, 
          the hiring practices of employers using our platform, or any other aspect of the employment relationship that may result from connections made through our site.
        </p>
        <p className="mt-2">
          Users are advised to verify all information independently before taking any action based on job listings found on our platform. 
          JobLess is not an employment agency and does not function as an employer with respect to your use of this site.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">External Links Disclaimer</h2>
        <p>
          The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties or 
          links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, 
          adequacy, validity, reliability, availability, or completeness by us. We do not warrant, endorse, guarantee, or assume responsibility for the 
          accuracy or reliability of any information offered by third-party websites linked through the Site or any website or feature linked in any banner or 
          other advertising.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Professional Disclaimer</h2>
        <p>
          The Site cannot and does not contain career or employment advice. The career and employment information is provided for general informational and 
          educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, 
          we encourage you to consult with the appropriate professionals.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Affiliates Disclaimer</h2>
        <p>
          The Site may contain links to affiliate websites, and we receive an affiliate commission for any purchases made by you on the affiliate website using such links.
          Our affiliates include career services, educational institutions, and other job-related service providers.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p>
          If you have any questions or concerns about this disclaimer, please contact us at:
        </p>
        <p><a href="mailto:durgashashinadhwork@gmail.com" className="text-blue-600 hover:underline">durgashashinadhwork@gmail.com</a></p>
      </section>
    </div>
  );
};

export default Disclaimer; 