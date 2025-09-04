import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAppContext } from './Context/AppContext';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { assets } from '../assets/assets';

const FeedbackForm = ({ onClose, onFeedbackSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { requireAuth } = useAuth();
  const { axios } = useAppContext();

  const handleRatingClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!requireAuth('submit feedback')) return;
    
    if (rating === 0) {
      await Swal.fire({ title: 'Rating required', text: 'Please select a rating', icon: 'info' });
      return;
    }
    if (!comment.trim()) {
      await Swal.fire({ title: 'Write your feedback', text: 'Please enter your experience', icon: 'info' });
      return;
    }

    await Swal.fire({
      title: 'Be positive and honest',
      text: 'Please give a positive review according to your experience.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continue',
      cancelButtonText: 'Cancel'
    }).then(async (res) => {
      if (!res.isConfirmed) return;

      setIsSubmitting(true);
      try {
        const response = await axios.post('/api/feedback/submit', {
          rating,
          comment: comment.trim(),
        });
        if (response.data.success) {
          await Swal.fire({ title: 'Thank you!', text: 'Your feedback has been submitted for review.', icon: 'success', timer: 1600, showConfirmButton: false })
          setRating(0);
          setComment('');
          onFeedbackSubmitted();
          onClose();
        }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to submit feedback';
        await Swal.fire({ title: 'Failed', text: message, icon: 'error' })
      } finally {
        setIsSubmitting(false);
      }
    })
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Share Your Experience</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <img src={assets.close_icon} alt="close" className="w-6 h-6" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Your feedback will be reviewed by our team. Once approved, it will be published as a testimonial on our website to help other customers.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How would you rate your experience? *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    rating >= star
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  <img 
                    src={assets.star_icon} 
                    alt={`${star} star`} 
                    className={`w-6 h-6 ${
                      rating >= star ? 'brightness-100' : 'brightness-50'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                You rated: {rating} star{rating > 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Tell us about your experience *
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={500}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              placeholder="Share your thoughts about our service..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {comment.length}/500 characters
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0 || !comment.trim()}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
