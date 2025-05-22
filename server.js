import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// __dirname para ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir frontend (se estiver na pasta public)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Instanciar modelo Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Funções auxiliares para Function Calling
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
    return { error: 'Erro ao obter o clima: ' + err.message };
  }
}

const availableFunctions = {
  getCurrentTime,
  getWeather,
};

// ✅ Rota básica para testar o backend
app.get('/', (req, res) => {
  res.send('✅ Backend do Chatbot está online!');
});

// Endpoint principal do chatbot
app.post('/chat', async (req, res) => {
  const { message, historico } = req.body;

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

  try {
    let response = await chat.sendMessage(message);

    if (response.functionCalls().length > 0) {
      const funcCall = response.functionCalls()[0];
      const functionName = funcCall.name;
      const args = funcCall.args;

      const result = await availableFunctions[functionName](args);

      const resultFromFunctionCall = await chat.sendMessage([
        {
          functionResponse: {
            name: functionName,
            response: result,
          },
        },
      ]);

      res.json({
        resposta: resultFromFunctionCall.response.text(),
        historico: chat.getHistory(),
      });
    } else {
      res.json({
        resposta: response.response.text(),
        historico: chat.getHistory(),
      });
    }
  } catch (error) {
    console.error('❌ Erro no backend:', error);
    res.status(500).json({ resposta: 'Erro interno no servidor.', historico: [] });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
