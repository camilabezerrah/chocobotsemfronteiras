import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

// Models
import Chat from './models/Chat.js';
import Message from './models/Message.js';
import SystemInstruction from './models/SystemInstruction.js';

// Config .env
dotenv.config();

// App setup
const app = express();
const port = process.env.PORT || 3000;

// Diretório __dirname (modo ESModules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conexão MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB conectado!'))
.catch(err => console.error('❌ Erro ao conectar MongoDB:', err));

// Middleware de autenticação para admin
const checkAdminAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

  if (!token || token !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  next();
};

// Google Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Funções externas disponíveis ao bot
function getCurrentTime() {
  return { currentTime: new Date().toLocaleString('pt-BR') };
}

async function getWeather(args) {
  const location = args.location;
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric&lang=pt_br`;

  try {
    const res = await axios.get(url);
    return {
      location: res.data.name,
      temperature: res.data.main.temp,
      description: res.data.weather[0].description,
    };
  } catch (err) {
    console.error("Erro ao obter clima:", err.message);
    return { error: 'Erro ao obter o clima: ' + err.message };
  }
}

const availableFunctions = {
  getCurrentTime,
  getWeather,
};

// ------------------------ ROTAS ADMIN ----------------------------

// GET: Estatísticas do chatbot
app.get('/api/admin/stats', checkAdminAuth, async (req, res) => {
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
    console.error('Erro ao buscar estatísticas:', err);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

// GET: Obter instrução atual do sistema (personalidade do bot)
app.get('/api/admin/system-instruction', checkAdminAuth, async (req, res) => {
  try {
    const latestInstruction = await SystemInstruction.findOne().sort({ createdAt: -1 });
    res.json({ instruction: latestInstruction?.instruction || '' });
  } catch (err) {
    console.error('Erro ao buscar instrução:', err);
    res.status(500).json({ error: 'Erro ao buscar instrução' });
  }
});

// POST: Atualizar instrução do sistema (personalidade do bot)
app.post('/api/admin/system-instruction', checkAdminAuth, async (req, res) => {
  const { instruction } = req.body;
  if (!instruction) {
    return res.status(400).json({ error: 'Instrução não fornecida' });
  }

  try {
    const newInstruction = new SystemInstruction({ instruction });
    await newInstruction.save();
    res.json({ message: 'Instrução atualizada com sucesso' });
  } catch (err) {
    console.error('Erro ao salvar nova instrução:', err);
    res.status(500).json({ error: 'Erro ao salvar nova instrução' });
  }
});

// ------------------------ ROTA PÁGINA PRINCIPAL ----------------------------

app.get('/', (req, res) => {
  res.send('✅ Backend do Chatbot está online!');
});

// ------------------------ ROTA CHATBOT ----------------------------

app.post('/chat', async (req, res) => {
  const { message, historico } = req.body;

  if (!message || message.trim() === '') {
    return res.status(400).json({ resposta: 'Mensagem inválida.', historico: [] });
  }

  try {
    // Buscar a instrução do sistema (personalidade)
    const systemInstructionDoc = await SystemInstruction.findOne().sort({ createdAt: -1 });
    const instruction = systemInstructionDoc?.instruction || "Você é um assistente virtual.";

    // Iniciar chat com Gemini
    const chat = model.startChat({
      tools: [
        {
          functionDeclarations: [
            {
              name: 'getCurrentTime',
              description: 'Obtém a data e hora atuais.',
              parameters: { type: 'object', properties: {} },
            },
            {
              name: 'getWeather',
              description: 'Obtém a previsão do tempo para uma cidade.',
              parameters: {
                type: 'object',
                properties: {
                  location: {
                    type: 'string',
                    description: 'Cidade desejada, ex: "São Paulo, BR"',
                  },
                },
                required: ['location'],
              },
            },
          ],
        },
      ],
      history: historico || [],
      systemMessage: instruction,
    });

    let response = await chat.sendMessage(message);

    // Se o bot fizer uma chamada de função
    if (response.functionCalls().length > 0) {
      const funcCall = response.functionCalls()[0];
      const functionName = funcCall.name;
      const args = funcCall.args;

      if (!availableFunctions[functionName]) {
        return res.status(400).json({ resposta: `Função ${functionName} não implementada.`, historico: [] });
      }

      const result = await availableFunctions[functionName](args);

      const resultFromFunctionCall = await chat.sendMessage([
        {
          functionResponse: {
            name: functionName,
            response: result,
          },
        },
      ]);

      return res.json({
        resposta: resultFromFunctionCall.response.text(),
        historico: chat.getHistory(),
      });
    }

    // Resposta padrão (sem função)
    res.json({
      resposta: response.response.text(),
      historico: chat.getHistory(),
    });

  } catch (error) {
    console.error('❌ Erro no backend:', error.message);
    res.status(500).json({
      resposta: 'Erro interno no servidor. Tente novamente mais tarde.',
      historico: [],
    });
  }
});

// ------------------------ INICIAR SERVIDOR ----------------------------

app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});