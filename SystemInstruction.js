const mongoose = require('mongoose');

const systemInstructionSchema = new mongoose.Schema({
  instruction: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('SystemInstruction', systemInstructionSchema);