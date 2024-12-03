const loginButton = document.getElementById('in');
const profileButton = document.getElementById('profileButton');
const logoutButton = document.getElementById('logoutButton');
const userMenu = document.getElementById('userMenu');
const useremail = document.getElementById('email');
const fio = document.getElementById('fio');
const phone = document.getElementById('phone');
const gender = document.getElementById('gender');
const birthdate = document.getElementById('birthdate');
const savebutton = document.getElementById('save');
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
    fetch('https://blog.kreosoft.space/api/account/profile', { 
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
      useremail.value=data.email;
      fio.value=data.fullName;
      phone.value=data.phoneNumber;
      gender.value=data.gender;
      birthdate.value=data.birthDate;
      savebutton.addEventListener('click',()=>{
        fetch('https://blog.kreosoft.space/api/account/profile', { 
          method: 'PUT', 
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }, 
          body: JSON.stringify({ email: useremail.value, fullName: fio.value, gender: gender.value, phoneNumber: phone.value}) 
        }) 
        .then(response => { 
          if (!response.ok) { 
             
            return response.text().then(text => { throw new Error(text) }); 
          }
        }) 
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
$( function() { 
    $( "#birthdate" ).datepicker({ 
      dateFormat: "dd.mm.yy",
      changeMonth: true, 
      changeYear: true, 
      yearRange: "1900:2024",
    }); 
  } ); 

  $(function() { 

    $("#phone").keyup(function() { 
        let phone = $(this).val().replace(/\D/g, ""); 
        phone = phone.substring(0, 12);
     
        let formattedPhone = ""; 
        console.log(phone.substring(0, 12));
        
        if (phone.length > 0) { 
          formattedPhone += "+7 ("; 
        }

          if (phone.length >= 4) { 
            formattedPhone += phone.substring(1, 4) + ") "; 
          } else { 
            formattedPhone += phone.substring(1, phone.length); 
          } 
          if (phone.length >= 7) { 
            formattedPhone += phone.substring(4, 7) + "-"; 
          } else if (phone.length > 4) { 
              formattedPhone += phone.substring(4, phone.length); 
          } 
          if (phone.length >= 9) { 
            formattedPhone += phone.substring(7, 9) + "-"; 
          } else if (phone.length > 7) { 
              formattedPhone += phone.substring(7, phone.length) ; 
          } 
          if (phone.length >= 11) { 
            formattedPhone += phone.substring(9, 11); 
          } else if (phone.length > 9) { 
              formattedPhone += phone.substring(9, phone.length); 
          } 
        $(this).val(formattedPhone); 
      }); 
    });
function b()
{
  window.location.href = 'file:///C:/lab2/reg/reg.html';
}