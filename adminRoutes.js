const express = require('express');
const router = express.Router();
const checkAdminAuth = require('../middlewares/checkAdminAuth');

const Chat = require('../models/Chat');
const Message = require('../models/Message');
const SystemInstruction = require('../models/SystemInstruction');

router.get('/stats', checkAdminAuth, async (req, res) => {
  try {
    const totalConversations = await Chat.countDocuments();
    const totalMessages = await Message.countDocuments();
    const latestConversations = await Chat.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title createdAt');

    res.json({
      totalConversations,
      totalMessages,
      latestConversations
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

router.get('/system-instruction', checkAdminAuth, async (req, res) => {
  try {
    const latestInstruction = await SystemInstruction.findOne().sort({ createdAt: -1 });
    res.json({ instruction: latestInstruction?.instruction || '' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar instrução' });
  }
});

router.post('/system-instruction', checkAdminAuth, async (req, res) => {
  const { instruction } = req.body;
  if (!instruction) {
    return res.status(400).json({ error: 'Instrução não fornecida' });
  }

  try {
    const newInstruction = new SystemInstruction({ instruction });
    await newInstruction.save();
    res.json({ message: 'Instrução atualizada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar nova instrução' });
  }
});

module.exports = router;