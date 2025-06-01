import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-indigo-500 text-white p-6">
      <div className="text-center max-w-md mx-auto">
        {/* 404 Title */}
        <h1 className="text-8xl font-bold mb-4 text-indigo-100">404</h1>
        
        {/* Page Title */}
        <h2 className="text-3xl font-semibold mb-6">Page Not Found</h2>
        
        {/* Description */}
        <p className="text-lg mb-8 text-indigo-100">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="bg-white text-indigo-600 font-medium py-2 px-6 rounded-md hover:bg-indigo-50 transition-colors"
        >
          Go Back
        </button>

        {/* Support Contact */}
        <div className="mt-10 pt-6 border-t border-indigo-400/50">
          <p className="text-indigo-200 text-sm">
            Need help? Contact support at{" "}
            <a href="mailto:uemyy1@gmail.com" className="underline hover:text-white">
              uemyy1@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;