const API_URL = 'https://jsonplaceholder.typicode.com/users';

const btnSearch = document.getElementById('btnSearch');
const btnReset = document.getElementById('btnReset');
const searchInput = document.getElementById('searchInput');
const userGrid = document.getElementById('userGrid');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');

function showLoading(show) {
  loadingDiv.classList.toggle('hidden', !show);
}

function showError(msg) {
  if (msg) {
    errorDiv.textContent = msg;
    errorDiv.classList.remove('hidden');
  } else {
    errorDiv.classList.add('hidden');
  }
}

function renderUsers(users) {
  userGrid.innerHTML = '';
  if (users.length === 0) {
    userGrid.innerHTML = '<p>Nessun utente trovato.</p>';
    return;
  }
  users.forEach(user => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${user.name}</h3>
      <p><strong>Username:</strong> ${user.username}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Città:</strong> ${user.address.city}</p>
      <p><strong>Società:</strong> ${user.company.name}</p>
    `;
    userGrid.appendChild(card);
  });
}

function fetchUsers(query = '') {
  showError(null);
  showLoading(true);

  const xhr = new XMLHttpRequest();
  
  let url = API_URL;
  if (query.trim() !== '') {
    url += `?name_like=${encodeURIComponent(query)}`;
  }

  xhr.open('GET', url, true);

  xhr.onload = function () {
    showLoading(false);
    if (xhr.status >= 200 && xhr.status < 300) {
      const data = JSON.parse(xhr.responseText);
      renderUsers(data);
    } else {
      showError(`Errore del server: stato ${xhr.status}`);
    }
  };

  xhr.onerror = function () {
    showLoading(false);
    showError('Errore di rete: impossibile raggiungere la risorsa.');
  };

  xhr.send();
}

btnSearch.addEventListener('click', () => {
  fetchUsers(searchInput.value);
});

btnReset.addEventListener('click', () => {
  searchInput.value = '';
  fetchUsers();
});

fetchUsers();
