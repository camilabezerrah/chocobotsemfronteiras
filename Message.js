import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
  sender: { type: String, enum: ['user', 'bot'], required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

export default mongoose.model('Message', MessageSchema);