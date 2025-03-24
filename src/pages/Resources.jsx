function Resources() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Career Resources</h1>

      {/* Interview Preparation */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Interview Preparation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-3">Technical Interview Guide</h3>
            <p className="text-gray-600 mb-4">
              Comprehensive guide to ace your technical interviews with common questions and best practices.
            </p>
            <button className="text-blue-600 hover:underline">Read More →</button>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-3">Behavioral Questions</h3>
            <p className="text-gray-600 mb-4">
              Learn how to answer behavioral questions using the STAR method with real examples.
            </p>
            <button className="text-blue-600 hover:underline">Read More →</button>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-3">System Design</h3>
            <p className="text-gray-600 mb-4">
              Essential system design concepts and approaches for senior-level interviews.
            </p>
            <button className="text-blue-600 hover:underline">Read More →</button>
          </div>
        </div>
      </section>

      {/* Resume Building */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Resume Building</h2>
        <div className="bg-gray-50 rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">Resume Templates</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="mr-2">📄</span>
                  <a href="#" className="text-blue-600 hover:underline">Software Engineer Template</a>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📄</span>
                  <a href="#" className="text-blue-600 hover:underline">Full Stack Developer Template</a>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📄</span>
                  <a href="#" className="text-blue-600 hover:underline">DevOps Engineer Template</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Resume Tips</h3>
              <ul className="space-y-3">
                <li>✓ Keep it concise and relevant</li>
                <li>✓ Highlight your achievements</li>
                <li>✓ Use action verbs</li>
                <li>✓ Include relevant keywords</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Resources */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Learning Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {['Programming', 'Web Development', 'Cloud Computing', 'Data Structures'].map((topic) => (
            <div key={topic} className="bg-white shadow rounded-lg p-6">
              <h3 className="font-semibold mb-3">{topic}</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Online Courses</li>
                <li>• Video Tutorials</li>
                <li>• Practice Problems</li>
                <li>• Documentation</li>
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Resources;