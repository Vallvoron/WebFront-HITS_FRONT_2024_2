
const loginButton = document.getElementById('in');
const profileButton = document.getElementById('profileButton');
const logoutButton = document.getElementById('logoutButton');
const userMenu = document.getElementById('userMenu');
let userMenuListenerAttached = false;

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
  } else {
    console.log('Токен не найден в localStorage.');
    loginButton.addEventListener('click', () => {
      window.location.href = 'file:///C:/lab2/log/login.html';
    });
  }
});
function a(){ 
  const email = document.getElementById('email').value; 
  const password = document.getElementById('password').value; 

  if (email === '' || password === '') { 
    alert('Пожалуйста, заполните все поля!'); 
    return; 
  } 
 
  fetch('https://blog.kreosoft.space/api/account/login', { 
    method: 'POST', 
    headers: { 
      'Content-Type': 'application/json' 
    }, 
    body: JSON.stringify({ email: email, password: password }) 
  }) 
  .then(response => { 
    if (!response.ok) { 
       
      return response.text().then(text => { throw new Error(text) }); 
    } 
    return response.json();
  }) 
  .then(data => { 
    
    console.log('Успешный вход:', data); 
    const token = data.token; 
    if (token) {  
      localStorage.setItem('token', token);
      localStorage.setItem('email', email);
      console.log('Токен получен из заголовка:', token);
      console.log(localStorage.getItem('email'));
      activate(email);
      window.location.href = 'file:///C:/lab2/post/post.html';
    } else {  
      console.error('Токен не найден в заголовке ответа.');  
    }  
  }) 
  .catch(error => { 
    console.error('Ошибка входа:', error); 
    alert('Ошибка входа: ' + error.message); 
  }); 
}
function b()
{
  window.location.href = 'file:///C:/lab2/reg/reg.html';
}