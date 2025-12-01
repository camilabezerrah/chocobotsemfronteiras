# 🟫🍫 **ChocoBot – Seu Aconchego Digital com IA Personalizável**
### *“Um chatbot doce, inteligente e feito para evoluir com você.”*

---

## 🎥 **Demonstração Visual**

>

**🔐 Login**  
![login-demo](./demo/login.gif)

**💬 Conversa**  
![chat-demo](./demo/chat.gif)

**🧠 Personalização do Bot**  
![settings-demo](./demo/settings.gif)

---

# 🚀 **Principais Funcionalidades**

### 🤖 **IA Personalizável por Usuário**
Cada pessoa pode definir:
- Personalidade do bot  
- Tom de fala  
- Estilo de resposta  
- Nível de profundidade  

Tudo salvo e aplicado automaticamente nas próximas sessões.

---

### 🛠️ **Function Calling com Google Gemini**
ChocoBot executa **funções reais do backend** quando necessário.  
Funções implementadas:

#### 🕒 `getCurrentTime`  
Retorna data e hora no padrão brasileiro.

#### 🌤️ `getWeather`  
Obtém clima atual via OpenWeather:  
> “A previsão para São Paulo é 25°C com céu limpo.”

---

### 🗂️ **Memória de Conversas**
O bot mantém o histórico ativo para conversas coerentes e naturais.

---

### 📊 **Painel Admin Completo**
- Últimas conversas  
- Cards com métricas básicas  
- Editor de System Instruction em tempo real  
- Interface moderna responsiva  

---

### 🧩 **Títulos de Conversa Gerados Automaticamente**
Cada conversa recebe um título automático com IA.

---

### 🛡️ **Tratamento de Erros Inteligente**
Mensagens amigáveis sempre que a API falha:
> “Oops! Algo deu errado. Tente novamente.”

---

### ✨ **UX Aprimorada**
- Indicador “digitando...”  
- Animações suaves  
- Layout limpo  
- Totalmente responsivo  

---

# 🧰 **Tech Stack**

### **Backend**
- 🟢 Node.js  
- ⚡ Express.js  
- 🧠 Google Gemini API  
- 🌦️ OpenWeather API  
- 🍪 JWT + Login  
- 🛢️ MongoDB Atlas  

### **Frontend**
- ⚛️ React / Vite  
- 🎨 CSS moderno  
- 🔗 Fetch API  

---

# 🔗 **Links de Demo**

🔹 **Frontend (Netlify/Vercel):**  
https://chocobotsemfronteiras.netlify.app/

🔹 **Backend (Render):**  
https://chocobotsemfronteiras.onrender.com

🔹 **Repositório GitHub:**  
https://github.com/camilabezerrah/chocobotsemfronteiras

---

# 📚 **Como Rodar Localmente**

### **Pré-requisitos**
- Node.js instalado  
- Chave da API Gemini  
- Chave da API OpenWeather  
- MongoDB Atlas configurado  

### **Passos**
```bash
npm install
npm run dev