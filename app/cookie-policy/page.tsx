'use client';
import React from 'react';

const CookiePolicy = () => {
  return (
    <div className="container mx-auto px-4 py-10 prose max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
      <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
        <p>
          This Cookie Policy explains how JobLess ("we", "us", and "our") uses cookies and similar technologies 
          to recognize you when you visit our website ("Website"). It explains what these technologies are and why 
          we use them, as well as your rights to control our use of them.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">What are cookies?</h2>
        <p>
          Cookies are small data files that are placed on your computer or mobile device when you visit a website. 
          Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, 
          as well as to provide reporting information.
        </p>
        <p className="mt-2">
          Cookies set by the website owner (in this case, JobLess) are called "first-party cookies". Cookies set by 
          parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party 
          features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics). 
          The parties that set these third-party cookies can recognize your computer both when it visits the website in question and 
          also when it visits certain other websites.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Why do we use cookies?</h2>
        <p>
          We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order 
          for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable 
          us to track and target the interests of our users to enhance the experience on our Website. Third parties serve cookies 
          through our Website for advertising, analytics, and other purposes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Types of cookies we use</h2>
        <p>The specific types of first and third-party cookies served through our Website include:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>
            <strong>Essential cookies:</strong> These cookies are strictly necessary to provide you with services available through our Website 
            and to use some of its features, such as access to secure areas. Because these cookies are strictly necessary to deliver the Website, 
            you cannot refuse them without impacting how our Website functions.
          </li>
          <li>
            <strong>Performance cookies:</strong> These cookies collect information that is used either in aggregate form to help us understand 
            how our Website is being used or how effective our marketing campaigns are, or to help us customize our Website for you.
          </li>
          <li>
            <strong>Functionality cookies:</strong> These cookies allow our Website to remember choices you make when you use our Website. 
            The purpose of these cookies is to provide you with a more personal experience and to avoid you having to re-select your 
            preferences every time you visit our Website.
          </li>
          <li>
            <strong>Marketing cookies:</strong> These cookies are used to track advertising effectiveness and to provide more relevant ads to users.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">How can you control cookies?</h2>
        <p>
          You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to 
          accept or refuse cookies. If you choose to reject cookies, you may still use our Website though your access to some 
          functionality and areas of our Website may be restricted.
        </p>
        <p className="mt-2">
          Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, 
          including how to see what cookies have been set, visit <a href="https://www.aboutcookies.org" className="text-blue-600 hover:underline">www.aboutcookies.org</a> or 
          <a href="https://www.allaboutcookies.org" className="text-blue-600 hover:underline">www.allaboutcookies.org</a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">How often will we update this Cookie Policy?</h2>
        <p>
          We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for 
          other operational, legal, or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed 
          about our use of cookies and related technologies.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p>
          If you have any questions about our use of cookies or other technologies, please contact us at:
        </p>
        <p><a href="mailto:durgashashinadhwork@gmail.com" className="text-blue-600 hover:underline">durgashashinadhwork@gmail.com</a></p>
      </section>
    </div>
  );
};

export default CookiePolicy; 