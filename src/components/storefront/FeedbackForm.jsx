import { useState } from 'react';
import { Star, Send, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../../lib/api';
import { useAuthStore } from '../../store/useAuthStore';

const FeedbackForm = () => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.email?.split('@')[0] || '',
    email: user?.email || '',
    message: '',
    rating: 5,
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/api/feedbacks', {
        user_id: user?.id || null,
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        rating: formData.rating
      });

      setSubmitted(true);
      setFormData({
        name: user?.email?.split('@')[0] || '',
        email: user?.email || '',
        message: '',
        rating: 5,
      });

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to submit feedback. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Share Your Experience</h2>
        <p className="text-slate-600">
          Returning customer? Share how your experience has been shopping with zibah stores
        </p>
      </div>

      {submitted && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-semibold text-green-900">Thank you!</p>
            <p className="text-green-800 text-sm">Your feedback has been received. We appreciate your support!</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-semibold text-red-900">Error</p>
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
            Your Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your name"
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
            Your Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your.email@example.com"
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Rating Field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            How would you rate your experience?
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  size={28}
                  className={`${
                    star <= formData.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
            Your Feedback *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Tell us about your shopping experience with zibah stores..."
            required
            rows={5}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <p className="text-xs text-slate-500 mt-1">
            {formData.message.length} / 1000 characters
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !formData.message.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send size={18} />
              Submit Feedback
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
