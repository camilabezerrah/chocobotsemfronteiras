// server.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';

// Configura variáveis de ambiente
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Compatibilidade __dirname com ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ CORS – Libera acesso do frontend (Vercel, Netlify, etc.)
app.use(cors({
  origin: '*', // Em produção, substitua por: ['https://chocobotsemfronteiras.netlify.app/']
}));

// ✅ Middleware para JSON
app.use(bodyParser.json());

// ✅ Servir arquivos estáticos (caso use frontend no mesmo servidor)
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Instanciar modelo Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// ✅ Funções para Function Calling
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

// ✅ Rota para verificação no navegador ou Render
app.get('/', (req, res) => {
  res.send('✅ Backend do Chatbot está online!');
});

// ✅ Endpoint principal da aplicação
app.post('/chat', async (req, res) => {
  const { message, historico } = req.body;

  if (!message || message.trim() === '') {
    return res.status(400).json({ resposta: 'Mensagem inválida.', historico: [] });
  }

  try {
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
    });

    let response = await chat.sendMessage(message);

    // Verifica se há chamadas de função
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

    // Resposta direta
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

// ✅ Inicialização do servidor
app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});