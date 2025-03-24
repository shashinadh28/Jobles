function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">About TechJobs Alert</h1>
        
        {/* Mission Statement */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-6">
            At TechJobs Alert, we're dedicated to bridging the gap between talented students and 
            their dream jobs in the tech industry. We understand the challenges students face in 
            finding the right career opportunities, which is why we've created this platform to 
            make the job search process easier and more efficient.
          </p>
        </section>

        {/* What We Offer */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">What We Offer</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Curated Job Listings</h3>
              <p className="text-gray-700">
                We carefully select and verify job opportunities from top tech companies, 
                ensuring you have access to legitimate and high-quality positions.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Career Resources</h3>
              <p className="text-gray-700">
                Access comprehensive guides, interview preparation materials, and resume 
                templates to help you succeed in your job search.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Regular Updates</h3>
              <p className="text-gray-700">
                Stay informed with daily updates on new job opportunities and industry trends.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Our Team</h2>
          <p className="text-gray-700 mb-6">
            Our team consists of experienced professionals who are passionate about helping 
            students succeed in their tech careers. We combine our industry knowledge and 
            expertise to provide you with the best possible job search experience.
          </p>
        </section>

        {/* Contact CTA */}
        <section className="bg-blue-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Want to Know More?</h2>
          <p className="mb-6">
            We're always happy to help and answer any questions you might have about our platform.
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100"
          >
            Contact Us
          </a>
        </section>
      </div>
    </div>
  );
}

export default About;