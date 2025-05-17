import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { Brain, Send, CheckCircle, Loader2, Copy, Users, BookOpen, DollarSign, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useSelector } from 'react-redux';

const AdminAi = () => {
  const [prompt, setPrompt] = useState('');
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);
  const [copyLoading, setCopyLoading] = useState(false);
  const [error, setError] = useState(null);
  const outputRef = useRef(null);
  const user = useSelector((store) => store.userSlice.user);

  // Sample quick prompts
  const quickPrompts = [
    { icon: <Calendar size={16} />, text: "Show institute attendance summary" },
    { icon: <BookOpen size={16} />, text: "Show all students grades" },
    { icon: <DollarSign size={16} />, text: "Show all students fee vouchers" },
  ];

  useEffect(() => {
    if (report && outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [report]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      message.warning({
        content: 'Please enter a query.',
        duration: 2,
        style: { marginTop: '20px' },
      });
      return;
    }

    setLoading(true);
    setReport('');
    setError(null);

    try {
      const response = await axios.post(
        'http://localhost:8000/api/v1/admin-ai', // Adjust endpoint as needed
        { prompt },
        { withCredentials: true }
      );

      const result = response.data.result || 'No response data available.';
      setReport(result);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || 'Failed to process query. Please try again.';
      setError(errorMessage);
      message.error({
        content: errorMessage,
        duration: 3,
        style: { marginTop: '20px' },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!report) return;

    setCopyLoading(true);
    try {
      await navigator.clipboard.writeText(report);
      message.success({
        content: 'Copied to clipboard!',
        duration: 2,
        style: { marginTop: '20px' },
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      message.error({
        content: 'Failed to copy text.',
        duration: 2,
        style: { marginTop: '20px' },
      });
    } finally {
      setCopyLoading(false);
    }
  };

  const handleQuickPrompt = (text) => {
    setPrompt(text);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-100 p-3 rounded-xl">
              <Brain className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Admin Assistant</h1>
              <p className="text-gray-500">AI-powered insights for institute management</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 h-fit">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-500" />
              Quick Prompts
            </h2>
            <div className="space-y-3">
              {quickPrompts.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickPrompt(item.text)}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-indigo-50 rounded-lg border border-gray-200 transition-colors flex items-center gap-3 text-gray-700 hover:text-indigo-600"
                >
                  <span className="text-indigo-500">{item.icon}</span>
                  <span className="text-sm">{item.text}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-gray-200">
              <h2 className="font-semibold text-gray-800 mb-3">Tips for Best Results</h2>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500">•</span>
                  <span>Ask about classes, grades, attendance, or fee vouchers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500">•</span>
                  <span>Request institute-wide data or specific student details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500">•</span>
                  <span>Be specific, e.g., "Show unpaid fee vouchers"</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Query Box */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-200 bg-gray-50">
                <h2 className="font-semibold text-gray-800">Ask About Your Institute</h2>
              </div>
              <div className="p-5">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <textarea
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none pr-12"
                      rows={4}
                      placeholder={`e.g., "Show institute attendance summary", "List all student grades", "Show all fee vouchers", "List all classes and teachers"`}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      aria-required="true"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin h-5 w-5" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          <span>Get Answer</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrompt('')}
                      className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                    >
                      Clear
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Results Section */}
            {report && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" ref={outputRef}>
                <div className="p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                  <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    AI Response
                  </h2>
                  <button
                    onClick={handleCopy}
                    disabled={copyLoading}
                    className={`flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-md ${copyLoading ? 'text-gray-400' : 'text-indigo-600 hover:bg-indigo-50'}`}
                  >
                    {copyLoading ? (
                      <Loader2 className="animate-spin w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span>Copy</span>
                  </button>
                </div>
                <div className="p-5">
                  <div className="prose prose-indigo max-w-none">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-4 text-gray-700">{children}</p>,
                        strong: ({ children }) => <strong className="font-semibold text-gray-800">{children}</strong>,
                        ul: ({ children }) => <ul className="list-disc pl-5 mb-4 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-5 mb-4 space-y-1">{children}</ol>,
                        li: ({ children }) => <li className="text-gray-700">{children}</li>,
                        h2: ({ children }) => <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-lg font-medium text-gray-800 mt-5 mb-2">{children}</h3>,
                      }}
                    >
                      {report}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-red-800">Error Processing Request</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                    <button
                      onClick={() => setError(null)}
                      className="mt-2 text-sm font-medium text-red-600 hover:text-red-800"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAi;