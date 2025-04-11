'use client';
import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-10 prose max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
        <p>
          Welcome to JobLess. We respect your privacy and are committed to protecting your personal data. 
          This privacy policy will inform you about how we look after your personal data when you visit our website
          and tell you about your privacy rights and how the law protects you.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">The Data We Collect About You</h2>
        <p>
          Personal data, or personal information, means any information about an individual from which that person can be identified.
          It does not include data where the identity has been removed (anonymous data).
        </p>
        <p className="mb-2">We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
        <ul className="list-disc ml-6 mb-4">
          <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
          <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
          <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
          <li><strong>Profile Data</strong> includes your username and password, your interests, preferences, feedback and survey responses.</li>
          <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">How We Use Your Personal Data</h2>
        <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
          <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
          <li>Where we need to comply with a legal obligation.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
        <p>
          We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. 
          In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know. 
          They will only process your personal data on our instructions and they are subject to a duty of confidentiality.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Legal Rights</h2>
        <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:</p>
        <ul className="list-disc ml-6 mb-4">
          <li><strong>Request access</strong> to your personal data.</li>
          <li><strong>Request correction</strong> of your personal data.</li>
          <li><strong>Request erasure</strong> of your personal data.</li>
          <li><strong>Object to processing</strong> of your personal data.</li>
          <li><strong>Request restriction of processing</strong> your personal data.</li>
          <li><strong>Request transfer</strong> of your personal data.</li>
          <li><strong>Right to withdraw consent</strong>.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p>
          If you have any questions about this privacy policy or our privacy practices, please contact us at:
        </p>
        <p><a href="mailto:durgashashinadhwork@gmail.com" className="text-blue-600 hover:underline">durgashashinadhwork@gmail.com</a></p>
      </section>
    </div>
  );
};

export default PrivacyPolicy; 