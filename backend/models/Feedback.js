import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: false
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        maxlength: 500
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    reply: {
        text: { type: String, default: '' },
        repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        repliedAt: { type: Date }
    }
}, {
    timestamps: true
});

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;
