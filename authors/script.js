const authorList = document.getElementById('author-list');
const authorTemplate = document.getElementById('author-template');

const loginButton = document.getElementById('in');
const profileButton = document.getElementById('profileButton');
const logoutButton = document.getElementById('logoutButton');
const userMenu = document.getElementById('userMenu');
let userMenuListenerAttached = false;

function formatDate(dateString) {
  // Convert the date string to a Date object
  const date = new Date(dateString);

  // Extract year, month, and day
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(date.getDate()).padStart(2, '0');

  // Format the date as DD.MM.YYYY
  return `${day}.${month}.${year}`;
}

function activate(email){
  if (!userMenuListenerAttached) {
    loginButton.addEventListener('click', () => {
    userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
    });
    loginButton.textContent = email + ' ▾';
    profileButton.style.display = 'inline-block';
    logoutButton.style.display = 'inline-block';

    profileButton.addEventListener('click', () => {
      window.location.href = 'file:///C:/lab2/prof/profile.html'
        alert("Переход на страницу профиля");
    });

    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('token');
        window.location.reload();
        alert("Вы вышли из аккаунта");
    });
    userMenuListenerAttached = true;
  }
}

window.addEventListener('load', () => {
  const authToken = localStorage.getItem('token');
  if (authToken) {
    console.log('Токен получен из localStorage:', localStorage.getItem('token'));
    email=localStorage.getItem('email')
    document.getElementById('in').textContent=email;
    activate(email);
    fetch('https://blog.kreosoft.space/api/author/list', { 
      method: 'GET', 
      headers: { 
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json' 
      }, 
    }) 
    .then(response => { 
      if (!response.ok) { 
          
        return response.text().then(text => { throw new Error(text) }); 
      } 
      return response.json();
    })
    .then(data => { 
      data.forEach(author => {
        const authorBlock = authorTemplate.content.cloneNode(true);
        
        if(author.gender=="Male")        {
          authorBlock.querySelector('img').src = 'https://sun9-16.userapi.com/impg/Bto5XYXGIRXQmSbE8EeTg-hflUVWCs8JISFsAQ/wV6uTSmo2bQ.jpg?size=373x374&quality=95&sign=997a3ac7da07676d3e65910d7102a5e5&type=album';
        }
        else {authorBlock.querySelector('img').src = 'https://sun9-76.userapi.com/impg/MCEJgo4lJPINMM9pRw3P2zm4VSz9kJO4D5irgQ/zIQ28KZhNKw.jpg?size=375x374&quality=95&sign=cd0248fc28ee2a608c61b5b202ea924d&type=album';}
        
        authorBlock.querySelector('h2').textContent = author.fullName;
        authorBlock.querySelector('p:first-of-type').textContent = `Создан: ${formatDate(author.created)}`;
        authorBlock.querySelector('.birthdate').textContent = `Дата рождения: ${formatDate(author.birthDate)}`;
        authorBlock.querySelector('.author-stats button:first-of-type').textContent = `Постов: ${author.posts}`;
        authorBlock.querySelector('.author-stats button:last-of-type').textContent = `Лайков: ${author.likes}`;
        authorList.appendChild(authorBlock); 
      });
    }) 
    .catch(error => { 
      console.error('Ошибка получения параметров профиля:', error); 
      alert('Ошибка получения параметров профиля: ' + error.message); 
    }); 
  } else {
    console.log('Токен не найден в localStorage.');
    loginButton.addEventListener('click', () => {
      window.location.href = 'file:///C:/lab2/log/login.html';
    });
  }
});