const topicSelector = document.getElementById('topicSelector');
const groupSelector = document.getElementById('group');
const buttonsContainer = document.getElementById('buttonsContainer');
let selected = [];

function increaseSelectedTagIds(option) {
  selected.push(option.value);
  option.removeEventListener('click',null); 
  option.addEventListener("click", ()=>{decreaseSelectedTagIds(option)});
  console.log(selected);
}

function decreaseSelectedTagIds(option) {
  selected = selected.filter(value => value !== option.value);
  option.removeEventListener('click',null); 
  option.addEventListener("click", ()=>{increaseSelectedTagIds(option)});
  console.log(selected);
}

result="";
async function fetchAndDisplayButtons(parentId,lastObjectGuid) {
  buttonsContainer.innerHTML = '';
  const url = `https://blog.kreosoft.space/api/address/search${parentId ? '?parentObjectId=' + parentId : ''}`;
  console.log(url);
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (Array.isArray(data)) {
          if (data.length > 0) {
              data.forEach(item => {
                  const button = document.createElement('button');
                  button.textContent = item.text;
                  button.onclick = () => fetchAndDisplayButtons(item.objectId, item.objectGuid);
                  buttonsContainer.appendChild(button);
              });
          } else {
              // Обработка случая, когда нет дочерних элементов
              console.log("Last objectId:", lastObjectGuid);
              buttonsContainer.innerHTML = `<p>No more children. Last objectId: ${lastObjectGuid}</p>`;
          }
      } else {
          // Обработка случая, если ответ не является массивом
          console.error("Unexpected response format:", data);
          buttonsContainer.innerHTML = "<p>Error: Unexpected response format</p>";
      }
  } catch (error) {
      console.error('Error fetching data:', error);
      buttonsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}


function getGroups()
{
  fetch('https://blog.kreosoft.space/api/community/my', { 
    method: 'GET', 
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }, 
  }) 
  .then(response => { 
    if (!response.ok) { 
       
      return response.text().then(text => { throw new Error(text) }); 
    } 
    return response.json();
  }) 
  .then(data => { 
    groupSelector.innerHTML = '';
    const without = document.createElement('option');
    without.value = "";
    without.text = "Без группы";
    groupSelector.appendChild(without);
    data.forEach(group => {
      if(group.role=="Administrator"){
        fetch(`https://blog.kreosoft.space/api/community/${group.communityId}`, { 
          method: 'GET', 
          headers: { 
            'Content-Type': 'application/json',
          }, 
        })
        .then(response => { 
          if (!response.ok) { 
             
            return response.text().then(text => { throw new Error(text) }); 
          } 
          return response.json();
        }) 
        .then(data=>{
          console.log(data.name);
          const option = document.createElement('option');
          option.value = group.communityId;
          option.text = data.name;
          groupSelector.appendChild(option);
        });
      }
    });
  });
}

function getTags()
{
  fetch('https://blog.kreosoft.space/api/tag', { 
    method: 'GET', 
    headers: { 
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
    topicSelector.innerHTML = ''; // Clear existing options
    data.forEach(tag => {
      const option = document.createElement('option');
      option.value = tag.id; // Use the ID as the value
      option.text = tag.name; // Use the name as the displayed text
      option.addEventListener("click", ()=>{increaseSelectedTagIds(option)});
      topicSelector.appendChild(option);
    });
  });
}

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
    getTags();
    getGroups();
    fetchAndDisplayButtons(null);
    console.log(result);
});


async function createPost() {

  const title = document.getElementById('title').value;
  var image = document.getElementById('image').value;
  const text = document.getElementById('text').value;
  var addressId = document.getElementById('address').value;
  if(addressId.trim() == ''){
  addressId = null}
  if(image.trim() == ''){
    image = null}
  const readingTime = document.getElementById('readingTime').value;

  const data = {
    title: title,
    description: text,
    readingTime: parseInt(readingTime),
    image: image,
    addressId: addressId,
    tags: selected,
  };

  try {
    var response=null;
    if(groupSelector.value!==""){
      console.log(JSON.stringify(data));
      response = await fetch(`https://blog.kreosoft.space/api/community/${groupSelector.value}/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(data)
      });
    }else{
      response = await fetch('https://blog.kreosoft.space/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(data)
      });
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || response.statusText}`);
    }

    const responseData = await response.json();
    console.log('Post created successfully:', responseData);
  } catch (error) {
    console.error('Error creating post:', error);
  }
}