import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Urban Living
              </h1>
            </div>
            <Link
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors duration-200"
            >
              Property Owner Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            Modern Property Management
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Made Simple
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            A powerful B2B2C platform connecting property owners with tenants.
            Scan QR codes to explore available properties instantly.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Started as Property Owner
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-900 font-semibold px-8 py-4 rounded-lg transition-all duration-200 border-2 border-gray-200 hover:border-gray-300"
            >
              Learn More
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto mb-20">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-4xl font-bold text-blue-600 mb-2">🏢</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">Easy</div>
              <div className="text-gray-600">Property Management</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-4xl font-bold text-purple-600 mb-2">📱</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">QR</div>
              <div className="text-gray-600">Code Integration</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-4xl font-bold text-green-600 mb-2">⚡</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">Instant</div>
              <div className="text-gray-600">Property Viewing</div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="py-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            Platform Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Property Owners */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                For Property Owners
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Manage multiple buildings from one dashboard</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Add and update property listings easily</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Generate unique QR codes for each property</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Track unit availability and status</span>
                </li>
              </ul>
            </div>

            {/* For Tenants */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                For Tenants
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Scan QR codes to view property details instantly</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Browse available units with pricing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>View amenities and unit specifications</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Mobile-optimized viewing experience</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="py-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Create Listing
              </h3>
              <p className="text-gray-600">
                Property owners add their buildings and units to the platform
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Generate QR Code
              </h3>
              <p className="text-gray-600">
                Each property gets a unique QR code and URL
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Scan & View
              </h3>
              <p className="text-gray-600">
                Potential tenants scan QR codes to view property details instantly
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join Urban Living and modernize your property management today
            </p>
            <Link
              href="/dashboard"
              className="inline-block bg-white hover:bg-gray-100 text-blue-600 font-semibold px-8 py-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Access Dashboard
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2026 Urban Living. Built with Next.js, TypeScript, and Firebase.
          </p>
        </div>
      </footer>
    </div>
  );
}
