import express from 'express';
import { 
    submitFeedback, 
    getTestimonials, 
    getUserFeedback, 
    getOwnerFeedback,
    moderateFeedback,
    deleteFeedback 
} from '../controllers/feedbackController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public route - get approved testimonials
router.get('/testimonials', getTestimonials);

// Protected routes - require authentication
router.post('/submit', protect, submitFeedback);
router.get('/user', protect, getUserFeedback);

// Owner routes - require owner authentication
router.get('/owner', protect, getOwnerFeedback);

// Owner routes - require owner privileges
router.patch('/moderate/:feedbackId', protect, moderateFeedback);
router.delete('/delete/:feedbackId', protect, deleteFeedback);

export default router;
