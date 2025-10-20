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
- **Frontend (Netlify/Vercel):** *(https://chocobotsemfronteiras.netlify.app/)*  
- **Repositório GitHub:** [https://github.com/camilabezerrah/chocobotsemfronteiras](https://github.com/camilabezerrah/chocobotsemfronteiras)

---

## 🧭 Missão B4.P1.A3 - Operação: Sala de Guerra de Dados 

### 🎯 Objetivo
Transformar o painel de administração em um dashboard estratégico e dinâmico, revelando o engajamento real dos usuários e os pontos de falha do bot.

### 🚀 Entregas Concluídas
- [x] Novo endpoint `/api/admin/dashboard` com agregações MongoDB:
  - Duração média das conversas.
  - Conversas curtas vs longas.
  - Top 5 usuários mais ativos.
  - Identificação de falhas nas respostas do bot.
- [x] Atualização de **admin.html** com novos widgets e cards.
- [x] Atualização de **admin.js** com renderização dinâmica e botão de exportação.
- [x] Deploy e validação do dashboard no ambiente de produção.

### 📈 Plano de Melhorias Baseado em Dados
1. O bot apresentou falhas recorrentes em perguntas sobre **preços** e **horários de funcionamento**.  
   🛠️ **Ação:** atualizar a *System Instruction* no painel para incluir respostas claras e redirecionamentos automáticos.
2. A média de duração das conversas ficou abaixo de 3 mensagens.  
   💬 **Ação:** tornar o bot mais proativo, incentivando o usuário a continuar interagindo.
3. Apenas 3 usuários concentraram a maioria das conversas.  
   🎯 **Ação:** lançar uma campanha de engajamento no app, incentivando novos usuários a testar o chatbot.

### 🧩 Resultado
> A “Sala de Guerra de Dados” foi ativada com sucesso.  
> Agora o time pode tomar decisões baseadas em métricas reais, ajustando continuamente a performance do bot.

---

## 🪙 **6. Relatório Automático (Adicional – Inventado com Dados Fictícios)**

Durante o deploy, foi testado o novo recurso de exportação (`Baixar Relatório .CSV`), gerando o arquivo: