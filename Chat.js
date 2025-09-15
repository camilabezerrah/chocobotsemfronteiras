import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

export default mongoose.model('Chat', ChatSchema);