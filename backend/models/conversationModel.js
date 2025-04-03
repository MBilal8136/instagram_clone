import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    Message: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    },
    isGroup: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;