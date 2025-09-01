# 🤖 ChocoBot - Chatbot Inteligente com Function Calling

**ChocoBot** é um chatbot inteligente que utiliza a API **Google Gemini** para fornecer respostas naturais e úteis, além de executar funções do backend, como obter a data/hora atual e a previsão do tempo. Ele também possui memória de conversas, tratamento de erros e uma interface simples e responsiva.

---

## 🚀 Funcionalidades

### 1. **Function Calling**
O recurso de **Function Calling** da API Gemini permite que o chatbot execute funções reais do backend, como obter a hora ou clima, tornando-o mais útil e prático.

#### Como Funciona?
- O usuário envia uma mensagem.
- O Gemini identifica se uma função precisa ser chamada.
- O backend executa a função.
- A resposta final é enviada ao usuário com base nos dados retornados.

#### Exemplo:
> Usuário: "Que horas são?"  
> Bot: "Agora são 15:23 de 08/05/2025."

---

### 2. **Funções Implementadas**

#### 🕒 `getCurrentTime`
- Retorna a data e hora atual no formato brasileiro.

#### 🌤️ `getWeather`
- Consulta a API OpenWeather para mostrar a previsão do tempo de uma cidade específica.
- Exemplo: "A previsão para São Paulo é de 25°C com céu limpo."

---

## 🔁 Histórico de Conversa

ChocoBot mantém uma **memória temporária** durante a conversa, enviando o histórico ao backend, que o repassa à API Gemini, permitindo interações mais contextuais e naturais.

---

## 🛡️ Tratamento de Erros

Erros de API são tratados com mensagens amigáveis, evitando falhas abruptas.  
Exemplo: "Oops! Algo deu errado. Tente novamente."

---

## 💬 Indicador de Carregamento

Enquanto processa uma resposta, o bot exibe "digitando..." para simular uma conversa real, melhorando a **UX**.

---

## 🌐 Deploy

- **Backend (Render):** [https://chatbot-backend.onrender.com](https://chocobotsemfronteiras.onrender.com)
- **Frontend (Netlify/Vercel):** *(https://chocobotsemfronteiras.netlify.app/)
- **Repositório GitHub:** [https://github.com/camilabezerrah/chocobotsemfronteiras](https://github.com/camilabezerrah/chocobotsemfronteiras)

---

## 🔧 Como Rodar Localmente

### Pré-requisitos
- Node.js instalado

### Passos:
```bash
npm install
npm run dev

## Plano de Melhorias (B3.P1.A6)

### 🐞 Bugs Críticos (Prioridade Máxima)
- [ ] Bot não responde por erro de API → Verificar chave da Gemini e conexão Render
- [ ] Histórico visível para todos → Implementar userId com localStorage + filtro por usuário
- [ ] Layout quebrado no celular → Melhorar responsividade com media queries
- [ ] Logs de erro visíveis na UI → Remover console.log da interface

### 💡 Refinamentos e UX
- [ ] Melhorar system instruction para manter foco em autocuidado
- [ ] Respostas muito longas → Ajustar prompt para ser mais direto
- [ ] Permitir renomear histórico de forma intuitiva
- [ ] Mensagem personalizada para erros de API

### ✅ Pontos Fortes (Manter!)
- [x] Function calling funcionando (getTime, getWeather)
- [x] Design geral agradável
- [x] Indicação de "digitando..." melhora a experiência