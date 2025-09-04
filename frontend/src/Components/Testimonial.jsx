import React, { useState, useEffect } from 'react'
import Title from './Title'
import { assets } from '../assets/assets';
import { useAppContext } from './Context/AppContext';
import FeedbackForm from './FeedbackForm';
import { useAuth } from '../hooks/useAuth';
import Swal from 'sweetalert2'

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { axios } = useAppContext();
  const { isAuthenticated, user } = useAuth();

  // Fetch testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get('/api/feedback/testimonials');
        if (response.data.success) {
          setTestimonials(response.data.testimonials);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        // Fallback to static testimonials if API fails
        setTestimonials([
          { 
            user: { name: "Emma Rodriguez", image: assets.testimonial_image_1 },
            rating: 5,
            comment: "Exceptional service and attention to detail. Everything was handled professionally and efficiently from start to finish. Highly recommended!",
            createdAt: new Date()
          },
          { 
            user: { name: "Liam Johnson", image: assets.testimonial_image_2 },
            rating: 5,
            comment: "I'm truly impressed by the quality and consistency. The entire process was smooth, and the results exceeded all expectations. Thank you!",
            createdAt: new Date()
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, [axios]);

  const handleFeedbackSubmitted = () => {
    // Refresh testimonials after new feedback
    window.location.reload();
  };

  const openMyReviewEditor = async (testimonial) => {
    try {
      // Owner can reply/edit/delete on any testimonial visible here
      if (user?.role === 'owner' && testimonial?._id) {
        const { value: text, isConfirmed, isDenied } = await Swal.fire({
          title: 'Reply to review',
          input: 'textarea',
          inputPlaceholder: 'Write a helpful reply... ',
          inputValue: testimonial.reply?.text || '',
          showDenyButton: !!testimonial.reply?.text,
          denyButtonText: 'Delete reply',
          showCancelButton: true,
          confirmButtonText: 'Save reply'
        })
        if (isConfirmed) {
          if (!text) return
          const res = await axios.post(`/api/feedback/reply/${testimonial._id}`, { text })
          if (res.data?.success) {
            await Swal.fire({ title: 'Saved', text: 'Reply saved.', icon: 'success', timer: 1200, showConfirmButton: false })
            window.location.reload()
          }
          return
        }
        if (isDenied) {
          const ok = await Swal.fire({ title: 'Delete reply?', text: 'This will remove your reply.', icon: 'warning', showCancelButton: true, confirmButtonColor: '#e02424' })
          if (!ok.isConfirmed) return
          const del = await axios.delete(`/api/feedback/reply/${testimonial._id}`)
          if (del.data?.success) {
            await Swal.fire({ title: 'Deleted', text: 'Reply removed.', icon: 'success', timer: 1200, showConfirmButton: false })
            window.location.reload()
          }
          return
        }
      }
      // Only allow edit/delete for the logged user's own card
      const res = await axios.get('/api/feedback/user')
      const my = res.data?.feedback
      if (!my || (testimonial?._id && testimonial._id !== my._id)) {
        return
      }
      const result = await Swal.fire({
        title: 'Your Review',
        html:
          `<div class="text-left">`+
          `<label class="block text-sm text-gray-600 mb-1">Rating (1-5)</label>`+
          `<input id="swal-rating" type="number" min="1" max="5" class="swal2-input" value="${my?.rating || 5}">`+
          `<label class="block text-sm text-gray-600 mb-1">Comment</label>`+
          `<textarea id="swal-comment" class="swal2-textarea" maxlength="500">${my?.comment || ''}</textarea>`+
          `</div>`,
        focusConfirm: false,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: 'Delete',
        preConfirm: () => {
          const rating = Number((document.getElementById('swal-rating') || {}).value)
          const comment = (document.getElementById('swal-comment') || {}).value
          if (!rating || rating < 1 || rating > 5) return Swal.showValidationMessage('Enter rating between 1 and 5')
          if (!comment || !comment.trim()) return Swal.showValidationMessage('Comment is required')
          return { rating, comment: comment.trim() }
        }
      })
      if (result.isConfirmed && result.value) {
        const upd = await axios.patch(`/api/feedback/user/${my._id}`, result.value)
        if (upd.data?.success) {
          await Swal.fire({ title: 'Saved', text: 'Your review was updated.', icon: 'success', timer: 1400, showConfirmButton: false })
          window.location.reload()
        }
        return
      }
      // if Delete button clicked
      if (result.isDenied) {
        const ok = await Swal.fire({ title: 'Delete your review?', text: 'This cannot be undone.', icon: 'warning', showCancelButton: true, confirmButtonColor: '#e02424' })
        if (!ok.isConfirmed) return
        const del = await axios.delete(`/api/feedback/user/${my._id}`)
        if (del.data?.success) {
          await Swal.fire({ title: 'Deleted', text: 'Your review was deleted.', icon: 'success', timer: 1200, showConfirmButton: false })
          window.location.reload()
        }
      }
    } catch (err) {
      // no-op for others
    }
  }

  
  return (
     <div className="py-28 px-6 md:px-16 lg:px-24 xl:px-44 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
            <Title title="What Our Customer Say"  subTitle="Real feedback from our valued customers about their experience with CarRental."/>
            
            {/* Feedback Button */}
            <div className="text-center mb-12">
              <button
                onClick={() => setShowFeedbackForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <img src={assets.addIcon} alt="add" className="w-5 h-5 brightness-300" />
                {isAuthenticated() ? 'Share Your Experience' : 'Login to Share Feedback'}
              </button>
              
              <p className="text-sm text-gray-600 mt-3">
                Your feedback will be reviewed and may be published as a testimonial
              </p>
            </div>

            {/* Testimonials Grid */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="mt-2 text-gray-600">Loading testimonials...</p>
              </div>
            ) : testimonials.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18">
                  {testimonials.map((testimonial, index) => (
                      <div key={index} onClick={() => openMyReviewEditor(testimonial)} className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/30 max-w-xs cursor-pointer">
                          <div className="flex items-center gap-4 mb-6">
                              <img 
                                className="w-14 h-14 rounded-full ring-4 ring-indigo-100 shadow-lg object-cover" 
                                src={testimonial.user?.image || assets.user_profile} 
                                alt={testimonial.user?.name || 'User'} 
                              />
                              <div>
                                  <p className="font-bold text-xl text-gray-800">{testimonial.user?.name || 'Anonymous'}</p>
                                  <p className="text-gray-600 text-sm">
                                    {new Date(testimonial.createdAt).toLocaleDateString()}
                                  </p>
                              </div>
                          </div>
                          <div className="flex items-center gap-1 mb-4">
                              {Array(5).fill(0).map((_, starIndex) => (
                                  <img 
                                    key={starIndex} 
                                    src={assets.star_icon} 
                                    alt='star_icon' 
                                    className={`w-5 h-5 ${
                                      starIndex < testimonial.rating ? 'brightness-100' : 'brightness-50'
                                    }`}
                                  /> 
                              ))}
                          </div>
                          {testimonial.car && (
                            <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                              <p className="text-xs text-gray-600 font-medium">
                                Car: {testimonial.car.brand} {testimonial.car.model} ({testimonial.car.year})
                              </p>
                            </div>
                          )}
                          <p className="text-gray-700 max-w-90 leading-relaxed italic">"{testimonial.comment}"</p>
                          {testimonial.reply?.text && (
                            <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                              <p className="text-xs text-indigo-600 font-semibold mb-1">Owner Reply</p>
                              <p className="text-sm text-gray-700">{testimonial.reply.text}</p>
                              {testimonial.reply.repliedAt && (
                                <p className="text-xs text-gray-400 mt-1">{new Date(testimonial.reply.repliedAt).toLocaleDateString()}</p>
                              )}
                            </div>
                          )}
                      </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No testimonials yet. Be the first to share your experience!</p>
              </div>
            )}

            {/* Feedback Form Modal */}
            {showFeedbackForm && (
              <FeedbackForm
                onClose={() => setShowFeedbackForm(false)}
                onFeedbackSubmitted={handleFeedbackSubmitted}
              />
            )}
        </div>
  )
}

export default Testimonial
