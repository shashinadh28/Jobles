function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center py-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg text-white mb-12">
        <h1 className="text-4xl font-bold mb-4">Find Your Dream Tech Job</h1>
        <p className="text-xl mb-8">Stay updated with the latest software job opportunities</p>
        <div className="max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search for jobs..."
            className="w-full px-6 py-3 rounded-lg text-gray-900"
          />
        </div>
      </div>

      {/* Featured Jobs Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample Job Cards */}
          {[1, 2, 3].map((job) => (
            <div key={job} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg mb-2">Software Engineer</h3>
              <p className="text-gray-600 mb-4">Company Name</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Full-time</span>
                <span>Remote</span>
                <span>Posted 2d ago</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Job Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Frontend', 'Backend', 'Full Stack', 'DevOps'].map((category) => (
            <div key={category} className="bg-gray-100 rounded-lg p-4 text-center hover:bg-gray-200 cursor-pointer">
              <h3 className="font-medium">{category}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <h3 className="font-semibold text-lg mb-2">Latest Opportunities</h3>
            <p className="text-gray-600">Daily updates with fresh job postings from top companies</p>
          </div>
          <div className="text-center p-6">
            <h3 className="font-semibold text-lg mb-2">Verified Listings</h3>
            <p className="text-gray-600">All job postings are verified and trustworthy</p>
          </div>
          <div className="text-center p-6">
            <h3 className="font-semibold text-lg mb-2">Career Resources</h3>
            <p className="text-gray-600">Access to interview tips and career guidance</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;