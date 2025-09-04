import express from 'express';
import { 
    submitFeedback, 
    getTestimonials, 
    getUserFeedback, 
    getOwnerFeedback,
    moderateFeedback,
    deleteFeedback, 
    updateMyFeedback,
    deleteMyFeedback,
    replyToFeedback,
    deleteReplyFromFeedback
} from '../controllers/feedbackController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public route - get approved testimonials
router.get('/testimonials', getTestimonials);

// Protected routes - require authentication
router.post('/submit', protect, submitFeedback);
router.get('/user', protect, getUserFeedback);
router.patch('/user/:feedbackId', protect, updateMyFeedback);
router.delete('/user/:feedbackId', protect, deleteMyFeedback);

// Owner reply endpoint
router.post('/reply/:feedbackId', protect, replyToFeedback);
router.delete('/reply/:feedbackId', protect, deleteReplyFromFeedback);

// Owner management routes
router.get('/owner', protect, getOwnerFeedback);
router.patch('/moderate/:feedbackId', protect, moderateFeedback);
router.delete('/delete/:feedbackId', protect, deleteFeedback);

export default router;
