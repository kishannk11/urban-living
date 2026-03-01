export default function NotFound() {
    return (
        <div className="flex flex-col justify-center items-center min-h-[60vh] text-center px-4">
            <svg
                className="w-16 h-16 text-gray-400 mb-4"
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Building Not Found
            </h2>
            <p className="text-gray-600 mb-6">
                The property you're looking for doesn't exist or has been removed.
            </p>
            <a
                href="/"
                className="inline-flex items-center px-6 py-3 bg-brand-red hover:bg-brand-red-hover text-white font-medium rounded-lg transition-colors duration-200"
            >
                <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                </svg>
                Go Back Home
            </a>
        </div>
    );
}
