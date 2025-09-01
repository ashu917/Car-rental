import React, { useEffect, useState } from 'react';
import Title from '../../Components/Title';
import { useAppContext } from '../../Components/Context/AppContext';
import toast from 'react-hot-toast';
import { assets } from '../../assets/assets';

const Feedback = () => {
  const { isOwner, axios, authReady } = useAppContext();
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOwnerFeedback = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || '';
      const { data } = await axios.get('/api/feedback/owner', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        setFeedback(data.feedback);
      } else {
        toast.error(data.message || 'Failed to fetch feedback');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (feedbackId, status) => {
    try {
      const response = await axios.patch(`/api/feedback/moderate/${feedbackId}`, { status });
      if (response.data.success) {
        toast.success(`Feedback ${status} successfully`);
        fetchOwnerFeedback(); // Refresh the list
      }
    } catch (error) {
      toast.error('Failed to moderate feedback');
    }
  };

  const handleDelete = async (feedbackId) => {
    if (!window.confirm('Are you sure you want to delete this feedback? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await axios.delete(`/api/feedback/delete/${feedbackId}`);
      if (response.data.success) {
        toast.success('Feedback deleted successfully');
        fetchOwnerFeedback(); // Refresh the list
      }
    } catch (error) {
      toast.error('Failed to delete feedback');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      approved: { color: 'bg-green-100 text-green-800', text: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', text: 'Rejected' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  useEffect(() => {
    if (authReady && isOwner) {
      fetchOwnerFeedback();
    }
  }, [authReady, isOwner]);

  if (loading) {
    return (
      <div className="px-4 pt-6 md:px-8 flex-1 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Title
              title="Feedback"
              subTitle="View feedback and reviews from customers about your cars."
              align="left"
            />
          </div>
          <div className="animate-pulse">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 md:px-8 flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Title
            title="Feedback"
            subTitle="View feedback and reviews from customers about your cars."
            align="left"
          />
        </div>

        {/* Feedback Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Feedback</p>
                <p className="text-2xl font-bold text-blue-600">{feedback.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Positive</p>
                <p className="text-2xl font-bold text-green-600">
                  {feedback.filter(f => f.rating >= 4).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Neutral</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {feedback.filter(f => f.rating >= 3 && f.rating < 4).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Negative</p>
                <p className="text-2xl font-bold text-red-600">
                  {feedback.filter(f => f.rating < 3).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.259M15 9a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">All Feedback</h2>
            <p className="text-gray-500 text-sm mt-1">Customer reviews and feedback about your cars</p>
          </div>

          {feedback.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback yet</h3>
              <p className="text-gray-500">Customers haven't left any feedback for your cars yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {feedback.map((item) => (
                <div key={item._id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-5 h-5 ${
                                  i < item.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">{item.rating}/5</span>
                        </div>
                        {getStatusBadge(item.status)}
                      </div>
                      
                      {item.car && (
                        <div className="flex items-center gap-3 mb-3">
                          <img 
                            src={item.car.image} 
                            alt={`${item.car.brand} ${item.car.model}`} 
                            className="w-12 h-8 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {item.car.brand} {item.car.model}
                            </p>
                            <p className="text-sm text-gray-500">{item.car.year} • {item.car.category}</p>
                          </div>
                        </div>
                      )}
                      
                      <p className="text-gray-700 mb-3">{item.comment}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <img
                              className="h-6 w-6 rounded-full"
                              src={item.user?.image || assets.user_profile}
                              alt={item.user?.name}
                            />
                            <span>{item.user?.name || 'Anonymous'}</span>
                          </div>
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {item.status !== 'approved' && (
                            <button
                              onClick={() => handleModerate(item._id, 'approved')}
                              className="px-3 py-1 text-xs font-medium text-green-600 bg-green-100 hover:bg-green-200 rounded-md transition-colors"
                            >
                              Approve
                            </button>
                          )}
                          {item.status !== 'rejected' && (
                            <button
                              onClick={() => handleModerate(item._id, 'rejected')}
                              className="px-3 py-1 text-xs font-medium text-red-600 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
                            >
                              Reject
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-red-100 hover:text-red-600 rounded-md transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
