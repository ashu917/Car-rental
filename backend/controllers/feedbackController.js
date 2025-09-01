import Feedback from '../models/Feedback.js';
import User from '../models/User.js';

// Submit feedback
export const submitFeedback = async (req, res) => {
    try {
        const { rating, comment, carId } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!rating || !comment) {
            return res.status(400).json({
                success: false,
                message: "Rating and comment are required"
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        // Check if user already submitted feedback (for general feedback, check if they have any feedback)
        if (carId) {
            // Car-specific feedback
            const existingFeedback = await Feedback.findOne({ user: userId, car: carId });
            if (existingFeedback) {
                return res.status(400).json({
                    success: false,
                    message: "You have already submitted feedback for this car"
                });
            }
        } else {
            // General service feedback - check if user has already submitted general feedback
            const existingGeneralFeedback = await Feedback.findOne({ user: userId, car: { $exists: false } });
            if (existingGeneralFeedback) {
                return res.status(400).json({
                    success: false,
                    message: "You have already submitted general feedback about our service"
                });
            }
        }

        // Create new feedback
        const feedback = new Feedback({
            user: userId,
            rating,
            comment,
            ...(carId && { car: carId }) // Only add car field if carId is provided
        });

        await feedback.save();

        res.status(201).json({
            success: true,
            message: "Feedback submitted successfully",
            feedback
        });

    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Owner: Get feedback for cars owned by the authenticated owner + general service feedback
export const getOwnerFeedback = async (req, res) => {
    try {
        const ownerId = req.user.id;
        
        // Get feedback for cars owned by this owner
        const carFeedback = await Feedback.find()
            .populate({
                path: 'car',
                match: { owner: ownerId },
                select: 'brand model year image category'
            })
            .populate('user', 'name image email')
            .sort({ createdAt: -1 });

        // Get general service feedback (feedback without specific car)
        const generalFeedback = await Feedback.find({ 
            car: { $exists: false } 
        })
        .populate('user', 'name image email')
        .sort({ createdAt: -1 });

        // Filter out feedback that doesn't have a car or the car doesn't belong to this owner
        const ownerCarFeedback = carFeedback.filter(f => f.car);
        
        // Combine car-specific feedback and general service feedback
        const allOwnerFeedback = [...ownerCarFeedback, ...generalFeedback];

        res.status(200).json({
            success: true,
            feedback: allOwnerFeedback
        });

    } catch (error) {
        console.error('Error fetching owner feedback:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get approved testimonials for display
export const getTestimonials = async (req, res) => {
    try {
        const testimonials = await Feedback.find({ 
            status: 'approved' 
        })
        .populate('user', 'name image')
        .populate('car', 'brand model year') // Populate car info if it exists
        .sort({ createdAt: -1 })
        .limit(6);

        res.status(200).json({
            success: true,
            testimonials
        });

    } catch (error) {
        console.error('Error fetching testimonials:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get user's feedback (for authenticated users)
export const getUserFeedback = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const feedback = await Feedback.findOne({ user: userId });
        
        res.status(200).json({
            success: true,
            feedback
        });

    } catch (error) {
        console.error('Error fetching user feedback:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};



// Admin/Owner: Approve/reject feedback
export const moderateFeedback = async (req, res) => {
    try {
        const { feedbackId } = req.params;
        const { status } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be 'approved', 'rejected', or 'pending'"
            });
        }

        // Find the feedback first to check permissions
        const feedback = await Feedback.findById(feedbackId).populate('car', 'owner');

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: "Feedback not found"
            });
        }

        // Check permissions: Only owners can moderate feedback
        if (userRole !== 'owner') {
            return res.status(403).json({
                success: false,
                message: "Access denied. Owner privileges required."
            });
        }
        
        // For owners, check if the feedback is for their car OR is general service feedback
        if (feedback.car && feedback.car.owner.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You can only moderate feedback for your own cars or general service feedback."
            });
        }

        // Update the feedback
        const updatedFeedback = await Feedback.findByIdAndUpdate(
            feedbackId,
            { 
                status,
                isApproved: status === 'approved'
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: `Feedback ${status} successfully`,
            feedback: updatedFeedback
        });

    } catch (error) {
        console.error('Error moderating feedback:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Admin/Owner: Delete feedback
export const deleteFeedback = async (req, res) => {
    try {
        const { feedbackId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        // Find the feedback first to check permissions
        const feedback = await Feedback.findById(feedbackId).populate('car', 'owner');

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: "Feedback not found"
            });
        }

        // Check permissions: Only owners can delete feedback
        if (userRole !== 'owner') {
            return res.status(403).json({
                success: false,
                message: "Access denied. Owner privileges required."
            });
        }
        
        // For owners, check if the feedback is for their car OR is general service feedback
        if (feedback.car && feedback.car.owner.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You can only delete feedback for your own cars or general service feedback."
            });
        }

        // Delete the feedback
        await Feedback.findByIdAndDelete(feedbackId);

        res.status(200).json({
            success: true,
            message: "Feedback deleted successfully"
        });

    } catch (error) {
        console.error('Error deleting feedback:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
