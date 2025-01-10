import { useState } from 'react';
import { FaYoutube, FaHistory, FaCopy } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getTranscript, logout } from '../lib/utils.js';
import ReactMarkdown from 'react-markdown';

export default function Dashboard() {
  const [showSummary, setShowSummary] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [summary, setSummary] = useState('');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowSummary(false);

    try {
      // Validate URL format
      const url = new URL(videoUrl);
      const isValidYouTubeUrl = url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be');
      
      if (!isValidYouTubeUrl) {
        throw new Error('Please enter a valid YouTube URL');
      }

      // Get video transcript
      const response = await getTranscript(videoUrl);
      // console.log(response.summary);
      setSummary(response.summary);
      setShowSummary(true);
      toast.success('Transcript fetched successfully!');

    } catch (error: any) {
      toast.error('Failed to fetch video transcript');
      setShowSummary(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
    if (showSummary) {
      setShowSummary(false); // Reset summary when URL changes
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy text');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Video Summary Dashboard</h1>
              
            </div>
            <p className="mt-2 text-gray-600">Generate summaries of YouTube videos instantly</p>
          </div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-8"
          >
            <div className="flex items-center space-x-4 mb-8">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <FaYoutube className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">YouTube Video Summary</h2>
                <p className="text-gray-600">Enter a YouTube URL to get started</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <label 
                  htmlFor="videoUrl" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  YouTube Video URL
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaYoutube className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="videoUrl"
                    type="url"
                    value={videoUrl}
                    onChange={handleUrlChange}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-50 disabled:text-gray-500"
                    required
                    pattern="^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+"
                    disabled={isSubmitting}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Paste any YouTube video URL to generate its summary
                </p>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting || !videoUrl}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed font-medium"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <motion.span
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Generate Summary'
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Summary Section */}
          {(isSubmitting || showSummary) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 bg-white rounded-lg shadow-sm p-8"
            >
              {isSubmitting ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <motion.div
                    className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <p className="text-gray-600 font-medium">Generating summary...</p>
                </div>
              ) : showSummary && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-900">Video Summary</h3>
                    <button
                      onClick={handleCopy}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                        copied 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <FaCopy className="h-4 w-4" />
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-lg prose prose-sm max-w-none">
                    <ReactMarkdown>{summary}</ReactMarkdown>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Logout Button - fixed at bottom */}
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200 shadow-lg">
            <div className="max-w-4xl mx-auto flex justify-end">
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3zm11 4.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L11.586 7H6a1 1 0 1 1 0-2h5.586L8.293 1.707a1 1 0 0 1 1.414-1.414L14 4.586v2.828z" clipRule="evenodd" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Add bottom padding to prevent content from being hidden behind fixed button */}
          <div className="pb-24"></div>
        </div>
      </div>
    </div>
  );
}