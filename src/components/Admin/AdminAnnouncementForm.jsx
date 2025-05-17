import React, { useState } from 'react';
import { message } from 'antd';
import { Megaphone, PenSquare, MessageSquare, Users, CheckCircle, Send, Loader2, ChevronDown, XCircle } from 'lucide-react';
import { useCreateAnnouncementMutation } from '../../store/slices/adminDashboardApi';

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
    <div className="flex items-center justify-center p-4 pt-0">
      <div className="max-w-3xl w-full mx-auto mt-12 bg-white rounded-2xl shadow-lg border border-indigo-200 animate-fade-in">
        {/* Header */}
        <div className="bg-indigo-500 px-8 py-6 rounded-t-xl flex items-center space-x-4 hover:brightness-105 transition-all duration-300">
          <div className="bg-indigo-100 p-2 rounded-lg animate-pulse">
            <Megaphone className="h-8 w-8 text-indigo-500" />
          </div>
          <div>
            <h2 className="text-[30px] font-extrabold text-white" style={{ fontFamily: 'Nunito, sans-serif' }}>
              Create New Announcement
            </h2>
            <p className="text-indigo-100 text-sm -mt-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
              Broadcast updates to your school community!
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="flex items-center text-gray-700 font-semibold uppercase text-xs tracking-wider" style={{ fontFamily: 'Nunito, sans-serif' }}>
              <PenSquare className="h-4 w-4 mr-1 text-indigo-500" />
              Announcement Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter announcement title"
              className="w-full border border-indigo-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-indigo-50 placeholder-gray-400"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ fontFamily: 'Nunito, sans-serif' }}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-gray-700 font-semibold uppercase text-xs tracking-wider" style={{ fontFamily: 'Nunito, sans-serif' }}>
              <MessageSquare className="h-4 w-4 mr-1 text-indigo-500" />
              Message Content <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Enter detailed message here..."
              className="w-full border border-indigo-200 rounded-lg px-4 py-3 min-h-[200px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-indigo-50 placeholder-gray-400"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              required
              style={{ fontFamily: 'Nunito, sans-serif' }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center text-gray-700 font-semibold uppercase text-xs tracking-wider" style={{ fontFamily: 'Nunito, sans-serif' }}>
                <Users className="h-4 w-4 mr-1 text-indigo-500" />
                Select Recipient Group
              </label>
              <div className="relative">
                <select
                  className="w-full border border-indigo-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-indigo-50 appearance-none pr-10"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  <option value="all">All Members (Students, Parents & Teachers)</option>
                  <option value="teachers">Teachers Only</option>
                  <option value="students">Students Only</option>
                  <option value="parents">Parents Only</option>
                  <option value="students_parents">Students & Parents</option>
                  <option value="teachers_parents">Teachers & Parents</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <ChevronDown className="h-4 w-4 text-indigo-500" />
                </div>
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all ${isLoading ? 'opacity-75' : ''}`}
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
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