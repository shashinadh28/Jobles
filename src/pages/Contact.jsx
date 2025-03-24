function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Contact Us</h1>

        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="What is this regarding?"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                rows="6"
                className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your message..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Additional Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Other Ways to Reach Us</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Email</h3>
                <p className="text-gray-600">support@techjobsalert.com</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Working Hours</h3>
                <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Follow Us</h2>
            <div className="space-y-4">
              <a href="#" className="block text-blue-600 hover:underline">LinkedIn</a>
              <a href="#" className="block text-blue-600 hover:underline">Twitter</a>
              <a href="#" className="block text-blue-600 hover:underline">Facebook</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;