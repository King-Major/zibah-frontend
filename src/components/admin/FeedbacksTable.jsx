import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Search, MessageSquare, Star, Trash2, Loader2, Mail } from 'lucide-react';

const FeedbacksTable = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadFeedbacks = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await api.get('/api/feedbacks', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (isMounted) {
          setFeedbacks(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch feedbacks:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadFeedbacks();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredFeedbacks = feedbacks.filter(feedback =>
    feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feedback.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feedback.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (feedbackId) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;

    setDeletingId(feedbackId);
    try {
      const token = localStorage.getItem('adminToken');
      await api.delete(`/api/feedbacks/${feedbackId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFeedbacks(prevFeedbacks => prevFeedbacks.filter(f => f.id !== feedbackId));
    } catch (error) {
      console.error('Failed to delete feedback:', error);
      alert('Failed to delete feedback.');
    } finally {
      setDeletingId(null);
    }
  };

  const getRatingColor = (rating) => {
    switch (rating) {
      case 5: return 'text-green-600';
      case 4: return 'text-blue-600';
      case 3: return 'text-yellow-600';
      case 2: return 'text-orange-600';
      case 1: return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            size={16}
            className={`${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full relative">
      <div className="p-4 lg:p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="hidden sm:flex w-9 h-9 rounded-lg bg-zibah-stores/5 items-center justify-center text-zibah-stores shrink-0">
            <MessageSquare size={16} />
          </div>
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zibah-stores/20 focus:border-zibah-stores transition-all"
            />
          </div>
        </div>
        <div className="text-sm text-gray-600 font-medium">
          {filteredFeedbacks.length} feedback{filteredFeedbacks.length !== 1 ? 's' : ''}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 size={40} className="text-zibah-stores animate-spin" />
        </div>
      ) : filteredFeedbacks.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-gray-400">
          <MessageSquare size={48} className="mb-4 opacity-50" />
          <p className="font-medium">No feedbacks yet</p>
          <p className="text-sm">Customer feedback will appear here</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Rating</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Feedback</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredFeedbacks.map((feedback, index) => (
                <tr
                  key={feedback.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                  }`}
                >
                  <td className="px-4 py-4">
                    <div className="font-medium text-gray-900">{feedback.name}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-gray-600 text-xs">
                      <Mail size={14} className="text-gray-400" />
                      <a href={`mailto:${feedback.email}`} className="hover:text-zibah-stores underline">
                        {feedback.email}
                      </a>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {renderStars(feedback.rating)}
                      <span className={`text-xs font-semibold ${getRatingColor(feedback.rating)}`}>
                        ({feedback.rating})
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-gray-600 line-clamp-2 max-w-xs">{feedback.message}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-gray-500 text-xs">
                      {new Date(feedback.created_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => handleDelete(feedback.id)}
                      disabled={deletingId === feedback.id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete feedback"
                    >
                      {deletingId === feedback.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FeedbacksTable;
