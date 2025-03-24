function Jobs() {
  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "Tech Corp",
      location: "Remote",
      type: "Full-time",
      posted: "1d ago",
      description: "Looking for an experienced frontend developer with React expertise..."
    },
    {
      id: 2,
      title: "Backend Engineer",
      company: "Software Solutions",
      location: "Hybrid",
      type: "Full-time",
      posted: "2d ago",
      description: "Backend developer with Node.js and database experience required..."
    },
    // Add more sample jobs here
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Latest Job Opportunities</h1>
      
      {/* Search and Filter Section */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search jobs..."
            className="w-full px-4 py-2 border rounded"
          />
          <select className="w-full px-4 py-2 border rounded">
            <option value="">Job Type</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
          </select>
          <select className="w-full px-4 py-2 border rounded">
            <option value="">Location</option>
            <option value="remote">Remote</option>
            <option value="onsite">On-site</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-6">
        {jobs.map((job) => (
          <div key={job.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <p className="text-gray-600">{job.company}</p>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Apply Now
              </button>
            </div>
            <div className="flex gap-4 text-sm text-gray-500 mb-4">
              <span>{job.location}</span>
              <span>{job.type}</span>
              <span>{job.posted}</span>
            </div>
            <p className="text-gray-700">{job.description}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <nav className="flex items-center gap-2">
          <button className="px-4 py-2 border rounded hover:bg-gray-100">Previous</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded">1</button>
          <button className="px-4 py-2 border rounded hover:bg-gray-100">2</button>
          <button className="px-4 py-2 border rounded hover:bg-gray-100">3</button>
          <button className="px-4 py-2 border rounded hover:bg-gray-100">Next</button>
        </nav>
      </div>
    </div>
  );
}

export default Jobs;