import { Server, Clock, Wrench } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function ServerDown() {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-2xl w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 md:p-12 text-center">
          {/* Icon section */}
          <div className="mb-5">
            <div className="relative inline-flex items-center justify-center">
              <div className="absolute inset-0 bg-red-100/50 rounded-full animate-pulse"></div>
              <div className="relative bg-red-500/10 p-6 rounded-full">
                <Server className="w-16 h-16 md:w-18 md:h-18 text-red-500" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Main heading */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-4 tracking-tight">
              Server Unavailable
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-red-400 to-red-600 mx-auto rounded-full"></div>
          </div>

          {/* Description */}
          <div className="mb-10 space-y-4">
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-lg mx-auto">
              Our server is currently experiencing technical difficulties or undergoing scheduled maintenance.
            </p>
            <p className="text-base md:text-lg text-slate-500 max-w-md mx-auto">
              We're working diligently to restore full functionality as quickly as possible.
            </p>
          </div>

          {/* Action button */}
          <div className="mb-3">
            <button
              onClick={() => navigate('/')}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              <span className="relative flex items-center space-x-2">
                <span>Try Again</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </span>
            </button>
          </div>

          {/* Footer message */}
          <div className="pt-6 border-t border-slate-200/50">
            <p className="text-slate-500 text-sm md:text-base">
              Thank you for your patience and understanding while we resolve this issue.
            </p>
            <p className="text-slate-400 text-xs md:text-sm mt-2">
              Please check back in a few minutes
            </p>
          </div>
        </div>

        {/* Subtle animation elements */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-red-400 to-pink-400 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
}