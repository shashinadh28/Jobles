'use client';
import React from 'react';

const TermsOfUse = () => {
  return (
    <div className="container mx-auto px-4 py-10 prose max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Use</h1>
      <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
        <p>
          Welcome to JobLess. These Terms of Use govern your use of our website located at 
          jobless.com (the "Site") and form a binding contractual agreement between you, the user 
          of the Site, and us, JobLess.
        </p>
        <p className="mt-2">
          By accessing or using the Site, you agree to be bound by these Terms of Use. If you do not 
          agree to all the terms and conditions of this agreement, you may not access the Site or use 
          any services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Eligibility</h2>
        <p>
          The Site is intended for users who are at least 18 years old. By using the Site, you represent 
          and warrant that you are of legal age to form a binding contract with JobLess and meet all of 
          the foregoing eligibility requirements. If you do not meet all of these requirements, you must 
          not access or use the Site.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Account Registration</h2>
        <p>
          You may be required to register with the Site. You agree to keep your password confidential 
          and will be responsible for all use of your account and password. We reserve the right to 
          remove, reclaim, or change a username you select if we determine, in our sole discretion, 
          that such username is inappropriate, obscene, or otherwise objectionable.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">User Conduct</h2>
        <p>
          By using the Site, you agree not to:
        </p>
        <ul className="list-disc ml-6 mb-4">
          <li>Use the Site in any way that violates any applicable local, state, national, or international law or regulation.</li>
          <li>Impersonate or attempt to impersonate JobLess, a JobLess employee, another user, or any other person or entity.</li>
          <li>Upload or transmit viruses, Trojan horses, or other material designed to interrupt, destroy, or limit the functionality of the Site.</li>
          <li>Harvest or collect email addresses or other contact information of other users from the Site.</li>
          <li>Use the Site to advertise or offer to sell goods and services except as expressly permitted by JobLess.</li>
          <li>Engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Site, or which may harm JobLess or users of the Site.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Intellectual Property Rights</h2>
        <p>
          The Site and its entire contents, features, and functionality (including but not limited to all 
          information, software, text, displays, images, video, and audio, and the design, selection, 
          and arrangement thereof), are owned by JobLess, its licensors, or other providers of such 
          material and are protected by copyright, trademark, patent, trade secret, and other intellectual 
          property or proprietary rights laws.
        </p>
        <p className="mt-2">
          These Terms of Use permit you to use the Site for your personal, non-commercial use only. 
          You must not reproduce, distribute, modify, create derivative works of, publicly display, 
          publicly perform, republish, download, store, or transmit any of the material on our Site.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
        <p>
          In no event will JobLess, its affiliates, or their licensors, service providers, employees, 
          agents, officers, or directors be liable for damages of any kind, under any legal theory, 
          arising out of or in connection with your use, or inability to use, the Site, including any direct, 
          indirect, special, incidental, consequential, or punitive damages.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Changes to Terms of Use</h2>
        <p>
          We may revise and update these Terms of Use from time to time in our sole discretion. All 
          changes are effective immediately when we post them, and apply to all access to and use of 
          the Site thereafter. Your continued use of the Site following the posting of revised Terms of 
          Use means that you accept and agree to the changes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p>
          If you have any questions about these Terms of Use, please contact us at:
        </p>
        <p><a href="mailto:durgashashinadhwork@gmail.com" className="text-blue-600 hover:underline">durgashashinadhwork@gmail.com</a></p>
      </section>
    </div>
  );
};

export default TermsOfUse; 