import React, { useState } from 'react';
import { message } from 'antd';
import { Megaphone, PenSquare, MessageSquare, Users, CheckCircle, Send, Loader2, ChevronDown, XCircle } from 'lucide-react';
import { useCreateAnnouncementMutation } from '../../api/adminDashboardApi';

const AdminAnnouncementForm = () => {
  const [title, setTitle] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [audience, setAudience] = useState('all');
  const [createAnnouncement, { isLoading }] = useCreateAnnouncementMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAnnouncement({
        title,
        message: messageContent,
        audience,
      }).unwrap();

      setTitle('');
      setMessageContent('');
      setAudience('all');

      message.success({
        content: 'Announcement published successfully!',
        icon: <CheckCircle className="text-green-500" />,
      });
    } catch (err) {
      message.error({
        content: err?.data?.message || 'Failed to publish announcement',
        icon: <XCircle className="text-red-500" />,
      });
    }
  };

  return (
    <div className="flex items-center justify-center p-4 pt-0 min-w-[340px]">
      <div className="w-full max-w-3xl mx-auto mt-4 sm:mt-12 bg-white rounded-lg sm:rounded-2xl shadow-md sm:shadow-lg border border-indigo-100 sm:border-indigo-200 animate-fade-in">
        {/* Simplified Header */}
        <div className="bg-indigo-500 px-4 sm:px-8 py-3 sm:py-4 rounded-t-lg sm:rounded-t-xl flex items-center space-x-2 hover:brightness-105 transition-all duration-300">
          <Megaphone className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
          <span className="text-white font-medium text-sm sm:text-base">New Announcement</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-4 sm:space-y-6">
          <div className="space-y-1 sm:space-y-2">
            <label className="flex items-center text-gray-700 font-semibold uppercase text-[10px] sm:text-xs tracking-wider" style={{ fontFamily: 'Nunito, sans-serif' }}>
              <PenSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-indigo-500" />
              Announcement Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter announcement title"
              className="w-full border border-indigo-200 rounded-md sm:rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-indigo-50 placeholder-gray-400 text-sm sm:text-base"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ fontFamily: 'Nunito, sans-serif' }}
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <label className="flex items-center text-gray-700 font-semibold uppercase text-[10px] sm:text-xs tracking-wider" style={{ fontFamily: 'Nunito, sans-serif' }}>
              <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-indigo-500" />
              Message Content <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Enter detailed message here..."
              className="w-full border border-indigo-200 rounded-md sm:rounded-lg px-3 py-2 sm:px-4 sm:py-3 min-h-[120px] sm:min-h-[200px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-indigo-50 placeholder-gray-400 text-sm sm:text-base"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              required
              style={{ fontFamily: 'Nunito, sans-serif' }}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            <div className="space-y-1 sm:space-y-2">
              <label className="flex items-center text-gray-700 font-semibold uppercase text-[10px] sm:text-xs tracking-wider" style={{ fontFamily: 'Nunito, sans-serif' }}>
                <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-indigo-500" />
                Select Recipient Group
              </label>
              <div className="relative">
                <select
                  className="w-full border border-indigo-200 rounded-md sm:rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-indigo-50 appearance-none pr-8 sm:pr-10 text-sm sm:text-base"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  <option value="all">All Members</option>
                  <option value="teachers">Teachers Only</option>
                  <option value="students">Students Only</option>
                  <option value="parents">Parents Only</option>
                  <option value="students_parents">Students & Parents</option>
                  <option value="teachers_parents">Teachers & Parents</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3">
                  <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-500" />
                </div>
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-md sm:rounded-lg flex items-center justify-center space-x-2 shadow-sm sm:shadow-md hover:shadow-md sm:hover:shadow-lg transition-all ${isLoading ? 'opacity-75' : ''} text-sm sm:text-base`}
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Publish Announcement</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAnnouncementForm;