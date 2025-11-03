const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define o schema do usuário
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  // Campo novo para guardar a personalidade personalizada do usuário
  systemInstruction: {
    type: String,
    default: "" // se vazio, o sistema usará a personalidade global do admin
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


// Middleware para hash da senha antes de salvar
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Método para comparar senha (login)
UserSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Exporta o modelo
module.exports = mongoose.model('User', UserSchema);