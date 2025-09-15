const loginContainer = document.getElementById('login-container');
const adminContent = document.getElementById('admin-content');
const loginBtn = document.getElementById('login-btn');
const passwordInput = document.getElementById('admin-password');
const loginError = document.getElementById('login-error');

const totalConversationsEl = document.getElementById('total-conversations');
const totalMessagesEl = document.getElementById('total-messages');
const latestConversationsEl = document.getElementById('latest-conversations');

const instructionTextarea = document.getElementById('system-instruction-textarea');
const saveInstructionBtn = document.getElementById('save-instruction-btn');
const instructionMsg = document.getElementById('instruction-msg');

let adminPassword = '';

async function fetchMetrics() {
  try {
    const res = await fetch('/api/admin/stats', {
      headers: {
        'Authorization': adminPassword,
      },
    });

    if (!res.ok) {
      throw new Error('Erro ao buscar métricas. Status: ' + res.status);
    }

    const data = await res.json();
    totalConversationsEl.textContent = data.totalConversations;
    totalMessagesEl.textContent = data.totalMessages;

    latestConversationsEl.innerHTML = '';
    data.latestConversations.forEach(conv => {
      const li = document.createElement('li');
      li.textContent = conv.title || '(Sem título)';
      latestConversationsEl.appendChild(li);
    });
  } catch (err) {
    alert(err.message);
  }
}

async function fetchInstruction() {
  try {
    const res = await fetch('/api/admin/system-instruction', {
      headers: {
        'Authorization': adminPassword,
      },
    });
    if (!res.ok) {
      throw new Error('Erro ao buscar instrução. Status: ' + res.status);
    }

    const data = await res.json();
    instructionTextarea.value = data.instruction || '';
  } catch (err) {
    alert(err.message);
  }
}

async function saveInstruction() {
  instructionMsg.textContent = '';
  try {
    const res = await fetch('/api/admin/system-instruction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': adminPassword,
      },
      body: JSON.stringify({ instruction: instructionTextarea.value.trim() }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Erro ao salvar instrução');
    }

    instructionMsg.style.color = 'green';
    instructionMsg.textContent = 'Instrução salva com sucesso!';
  } catch (err) {
    instructionMsg.style.color = 'red';
    instructionMsg.textContent = err.message;
  }
}

loginBtn.addEventListener('click', () => {
  const password = passwordInput.value.trim();

  if (!password) {
    loginError.textContent = 'Digite a senha.';
    return;
  }

  fetch('/api/admin/stats', {
    headers: { 'Authorization': password },
  })
    .then(res => {
      if (!res.ok) throw new Error('Senha inválida.');
      return res.json();
    })
    .then(() => {
      adminPassword = password;
      loginContainer.style.display = 'none';
      adminContent.style.display = 'block';
      loginError.textContent = '';

      fetchMetrics();
      fetchInstruction();
    })
    .catch(() => {
      loginError.textContent = 'Senha inválida.';
    });
});

saveInstructionBtn.addEventListener('click', () => {
  if (!instructionTextarea.value.trim()) {
    instructionMsg.style.color = 'red';
    instructionMsg.textContent = 'A instrução não pode ser vazia.';
    return;
  }
  saveInstruction();
});