import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../Components/Context/AppContext';
import { toast } from 'react-hot-toast';
import { assets } from '../../assets/assets';

const ManageFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const { axios } = useAppContext();

  useEffect(() => {
    fetchOwnerFeedback();
    
    // Auto-refresh every 30 seconds to keep data updated
    const interval = setInterval(() => {
      fetchOwnerFeedback();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchOwnerFeedback = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/feedback/owner');

      if (response.data.success) {
        setFeedback(response.data.feedback);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast.error('Failed to fetch feedback');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModerate = async (feedbackId, status) => {
    try {
      const response = await axios.patch(`/api/feedback/moderate/${feedbackId}`, { status });
      if (response.data.success) {
        if (status === 'approved') {
          toast.success('Feedback approved successfully! It will now appear in testimonials.');
        } else {
          toast.success(`Feedback ${status} successfully`);
        }
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

  const filteredFeedback = feedback.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const stats = {
    total: feedback.length,
    pending: feedback.filter(f => f.status === 'pending').length,
    approved: feedback.filter(f => f.status === 'approved').length,
    rejected: feedback.filter(f => f.status === 'rejected').length
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 md:px-8 flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Feedback</h1>
            <p className="text-gray-600">Review and manage feedback for your cars</p>
          </div>
          <button
            onClick={fetchOwnerFeedback}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Feature Information Banner */}
        <div className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-green-100">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">✨ Connected System: Testimonials → ManageFeedback</p>
              <p className="text-sm text-green-700">When users submit feedback from the testimonials page, it appears here for your review. Approve it to show in testimonials!</p>
            </div>
          </div>
        </div>

                 {/* Statistics Cards */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
           <div className="bg-white rounded-xl p-6 shadow-lg">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-sm font-medium text-gray-600">Total Feedback</p>
                 <p className="text-3xl font-bold text-blue-600">
                   {isLoading ? (
                     <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                   ) : (
                     stats.total
                   )}
                 </p>
               </div>
               <div className="p-3 rounded-full bg-blue-100">
                 <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                 </svg>
               </div>
             </div>
           </div>

                     <div className="bg-white rounded-xl p-6 shadow-lg">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-sm font-medium text-gray-600">Pending</p>
                 <p className="text-3xl font-bold text-yellow-600">
                   {isLoading ? (
                     <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                   ) : (
                     stats.pending
                   )}
                 </p>
               </div>
               <div className="p-3 rounded-full bg-yellow-100">
                 <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
               </div>
             </div>
           </div>

           <div className="bg-white rounded-xl p-6 shadow-lg">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-sm font-medium text-gray-600">Approved</p>
                 <p className="text-3xl font-bold text-green-600">
                   {isLoading ? (
                     <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                   ) : (
                     stats.approved
                   )}
                 </p>
               </div>
               <div className="p-3 rounded-full bg-green-100">
                 <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                 </svg>
               </div>
             </div>
           </div>

           <div className="bg-white rounded-xl p-6 shadow-lg">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-sm font-medium text-gray-600">Rejected</p>
                 <p className="text-3xl font-bold text-red-600">
                   {isLoading ? (
                     <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                   ) : (
                     stats.rejected
                   )}
                 </p>
               </div>
               <div className="p-3 rounded-full bg-red-100">
                 <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </div>
             </div>
           </div>
                 </div>

         {/* Testimonials Preview */}
         <div className="mb-6 bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="p-2 rounded-full bg-green-100">
                 <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                 </svg>
               </div>
               <div>
                 <h3 className="text-lg font-semibold text-gray-800">Live Testimonials</h3>
                 <p className="text-sm text-gray-600">
                   {stats.approved === 0 
                     ? "No testimonials are currently live on your website" 
                     : `${stats.approved} testimonial${stats.approved === 1 ? '' : 's'} currently live on your website`
                   }
                 </p>
               </div>
             </div>
             {stats.approved > 0 && (
               <div className="text-right">
                 <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                 <p className="text-xs text-gray-500">Live now</p>
               </div>
             )}
           </div>
         </div>

                  {/* Filter Tabs */}
         <div className="mb-6">
           <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
             {[
               { key: 'all', label: 'All', count: stats.total },
               { key: 'pending', label: 'Pending', count: stats.pending },
               { key: 'approved', label: 'Approved', count: stats.approved },
               { key: 'rejected', label: 'Rejected', count: stats.rejected }
             ].map((tab) => (
               <button
                 key={tab.key}
                 onClick={() => setFilter(tab.key)}
                 className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                   filter === tab.key
                     ? 'bg-white text-indigo-600 shadow-sm'
                     : 'text-gray-600 hover:text-gray-900'
                 }`}
               >
                 {tab.label} ({tab.count})
               </button>
             ))}
           </div>
         </div>

         {/* Recent Feedback Card */}
         <div className="bg-white rounded-xl shadow-lg overflow-hidden">
           <div className="p-6 border-b border-gray-200">
             <h2 className="text-xl font-bold text-gray-800">Recent Feedback</h2>
             <p className="text-gray-600">Manage customer feedback and statuses</p>
           </div>

           {filteredFeedback.length === 0 ? (
             <div className="p-12 text-center">
               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                 </svg>
               </div>
               <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback found</h3>
                               <p className="text-gray-500 mb-4">
                  {filter === 'all' 
                    ? 'No feedback has been submitted yet. When users submit feedback from the testimonials page or for your cars, it will appear here with "Pending" status for your review and approval.' 
                    : `No ${filter} feedback found. Try changing the filter or check back later.`
                  }
                </p>
                               {filter === 'all' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-blue-800">How it works:</p>
                                                 <p className="text-sm text-blue-700">When users submit feedback from the testimonials page or for your cars, it will appear here with "Pending" status. You can then approve, reject, or delete the feedback. <strong>Approved feedback automatically appears in the testimonials section on your website!</strong></p>
                      </div>
                    </div>
                  </div>
                )}
             </div>
           ) : (
             <div className="overflow-x-auto">
               <table className="w-full">
                                   <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CAR/SERVICE</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USER</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RATING</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COMMENT</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
                    </tr>
                  </thead>
                 <tbody className="bg-white divide-y divide-gray-200">
                   {filteredFeedback.map((item) => (
                     <tr key={item._id} className="hover:bg-gray-50">
                                               {/* Car Column */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.car ? (
                            <div className="flex items-center">
                              <img 
                                className="h-10 w-16 object-cover rounded-lg mr-3" 
                                src={item.car.image} 
                                alt={`${item.car.brand} ${item.car.model}`} 
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {item.car.brand} {item.car.model}
                                </div>
                                <div className="text-sm text-gray-500">{item.car.category}</div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <div className="w-10 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg mr-3 flex items-center justify-center">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">General Service</div>
                                <div className="text-sm text-gray-500">From testimonials page</div>
                              </div>
                            </div>
                          )}
                        </td>

                       {/* User Column */}
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="flex items-center">
                           <img
                             className="h-8 w-8 rounded-full mr-3"
                             src={item.user?.image || assets.user_profile}
                             alt={item.user?.name}
                           />
                           <div>
                             <div className="text-sm font-medium text-gray-900">
                               {item.user?.name || 'Anonymous'}
                             </div>
                             <div className="text-sm text-gray-500">
                               {item.user?.email}
                             </div>
                           </div>
                         </div>
                       </td>

                       {/* Rating Column */}
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="flex items-center">
                           <div className="flex items-center mr-2">
                             {Array(5).fill(0).map((_, index) => (
                               <svg
                                 key={index}
                                 className={`w-4 h-4 ${
                                   index < item.rating ? 'text-yellow-400' : 'text-gray-300'
                                 }`}
                                 fill="currentColor"
                                 viewBox="0 0 20 20"
                               >
                                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                               </svg>
                             ))}
                           </div>
                           <span className="text-sm text-gray-900">{item.rating}/5</span>
                         </div>
                       </td>

                       {/* Comment Column */}
                       <td className="px-6 py-4">
                         <div className="text-sm text-gray-900 max-w-xs truncate" title={item.comment}>
                           {item.comment}
                         </div>
                       </td>

                       {/* Status Column */}
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="flex flex-col gap-1">
                           {getStatusBadge(item.status)}
                           {item.status === 'approved' && (
                             <div className="flex items-center gap-1 text-xs text-green-600">
                               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                               </svg>
                               <span>Live in testimonials</span>
                             </div>
                           )}
                           {item.status === 'pending' && (
                             <div className="flex items-center gap-1 text-xs text-yellow-600">
                               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                               </svg>
                               <span>Approve to show in testimonials</span>
                             </div>
                           )}
                         </div>
                       </td>

                       {/* Actions Column */}
                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                         <div className="flex space-x-2">
                           {item.status !== 'approved' && (
                             <button
                               onClick={() => handleModerate(item._id, 'approved')}
                               className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                               title="Approve and show in testimonials"
                             >
                               <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                               </svg>
                               Approve & Show
                             </button>
                           )}
                           {item.status !== 'rejected' && (
                             <button
                               onClick={() => handleModerate(item._id, 'rejected')}
                               className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                             >
                               <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                               </svg>
                               Cancel
                             </button>
                           )}
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           )}
         </div>
      </div>
    </div>
  );
};

export default ManageFeedback;
