import mongoose from 'mongoose';

const systemInstructionSchema = new mongoose.Schema({
  instruction: {
    type: String,
    required: true
  }
}, {
  timestamps: true // Adiciona createdAt e updatedAt automaticamente
});

export default mongoose.model('SystemInstruction', systemInstructionSchema);