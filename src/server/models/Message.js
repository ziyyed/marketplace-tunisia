import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true
  },
  read: {
    type: Boolean,
    default: false
  },
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing'
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
messageSchema.index({ sender: 1, recipient: 1 });
messageSchema.index({ createdAt: -1 });

export default mongoose.model('Message', messageSchema); 