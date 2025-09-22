import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  sender: {
    type: String,
    enum: ['user', 'bot'],
    required: true
  },
  text: {
    type: String,
    required: true
  }
}, {
  timestamps: true // cria createdAt e updatedAt automaticamente
});

export default mongoose.model('Message', MessageSchema);