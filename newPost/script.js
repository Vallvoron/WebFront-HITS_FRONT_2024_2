const topicSelector = document.getElementById('topicSelector');
const groupSelector = document.getElementById('group');
const RegionContainer = document.getElementById('Region');
const AreaContainer = document.getElementById('Area');
const CityContainer = document.getElementById('City');
const RoadContainer = document.getElementById('Road');
const BuildingContainer = document.getElementById('Building');

let curentaddress = null;
let selected = [];

function SelectedTagIds(option) {
  if(selected.includes(option.value))
  {
    selected = selected.filter(value => value !== option.value);
    console.log(selected);
  }
  else{
    selected.push(option.value);
    console.log(selected);
  }
}

result="";
async function fetchAndDisplayButtons(parentId,lastObjectGuid) {
  buttonsContainer.innerHTML = '';
  let url = `https://blog.kreosoft.space/api/address/search`;
  console.log(parentId);
  if (parentId!= '' && parentId!= null){
    url+= `${'?parentObjectId=' + parentId }`;
  }
  else{
    deletechild(RegionContainer);
    deletechild(AreaContainer);
    deletechild(CityContainer);
    deletechild(RoadContainer);
    deletechild(BuildingContainer);
    hideelement(0);
  }
  curentaddress = lastObjectGuid;
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      let count = 0;
      const data = await response.json();
      //console.log(data);
      if (Array.isArray(data)) {
          if (data.length > 0) {
              data.forEach(item => {
      
                const option = document.createElement('option');
                
                option.dataset.objectid =item.objectId;
                option.dataset.objectguid = item.objectGuid;
                option.textContent = item.text;


                if(item.objectLevel == "Region"){
                  RegionContainer.appendChild(option);
                  count = count || 0;
                }
                else if (item.objectLevel == "AdministrativeArea"){
                  AreaContainer.appendChild(option);
                  count = count || 1;
                }
                else if (item.objectLevel == "City" || item.objectLevel == "Locality" || item.objectLevel == "ElementOfPlanningStructure"){
                  CityContainer.appendChild(option);
                  count = count || 2;
                }
                else if (item.objectLevel == "ElementOfRoadNetwork"){
                  RoadContainer.appendChild(option);
                  count = count || 3;
                }
                else if (item.objectLevel == "Building"){
                  BuildingContainer.appendChild(option);
                  count = 4;
                }else{
                  console.log(item.objectLevel);
                }
                console.log(count);
                hideelement(count);
              });

          } else {
              //buttonsContainer.innerHTML = `<p>No more children. Last objectId: ${lastObjectGuid}</p>`;
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

function deletechild(selectElement){
  while (selectElement.firstChild) {
    selectElement.removeChild(selectElement.firstChild);
  }
  const option = document.createElement('option');
  option.dataset.objectid = '';
  option.dataset.objectguid = '';
  option.textContent = "Не выбран";
  selectElement.appendChild(option);
}

function hideelement(flag){
  if(flag>0){document.getElementById('AreaAddressId').style.display = 'block';}
  else{document.getElementById('AreaAddressId').style.display = 'none';}
  if(flag>1){document.getElementById('CityAddressId').style.display = 'block';}
  else{document.getElementById('CityAddressId').style.display = 'none';}
  if(flag>2){document.getElementById('RoadAddressId').style.display = 'block';}
  else{document.getElementById('RoadAddressId').style.display = 'none';}
  if(flag>3){document.getElementById('BuildingAddressId').style.display = 'block';}
  else{document.getElementById('BuildingAddressId').style.display = 'none';}
}

RegionContainer.addEventListener("change", function() { 
  const selectedOption = this.options[this.selectedIndex]; 
  if (selectedOption.hasAttribute("data-objectid") && selectedOption.hasAttribute("data-objectguid")) { 
    deletechild(AreaContainer);
    deletechild(CityContainer);
    deletechild(RoadContainer);
    deletechild(BuildingContainer);
    fetchAndDisplayButtons(selectedOption.dataset.objectid, selectedOption.dataset.objectguid);
  } else { 
    console.error("У выбранного option отсутствуют необходимые параметры."); 
  } 
});

AreaContainer.addEventListener("change", function() { 
  const selectedOption = this.options[this.selectedIndex]; 
  if (selectedOption.hasAttribute("data-objectid") && selectedOption.hasAttribute("data-objectguid")) { 
    deletechild(CityContainer);
    deletechild(RoadContainer);
    deletechild(BuildingContainer);
    fetchAndDisplayButtons(selectedOption.dataset.objectid, selectedOption.dataset.objectguid);
  } else { 
    console.error("У выбранного option отсутствуют необходимые параметры."); 
  } 
});
CityContainer.addEventListener("change", function() { 
  const selectedOption = this.options[this.selectedIndex]; 
  if (selectedOption.hasAttribute("data-objectid") && selectedOption.hasAttribute("data-objectguid")) { 
    deletechild(RoadContainer);
    deletechild(BuildingContainer);
    fetchAndDisplayButtons(selectedOption.dataset.objectid, selectedOption.dataset.objectguid);
  } else { 
    console.error("У выбранного option отсутствуют необходимые параметры."); 
  } 
});
RoadContainer.addEventListener("change", function() { 
  const selectedOption = this.options[this.selectedIndex]; 
  if (selectedOption.hasAttribute("data-objectid") && selectedOption.hasAttribute("data-objectguid")) { 
    deletechild(BuildingContainer);
    fetchAndDisplayButtons(selectedOption.dataset.objectid, selectedOption.dataset.objectguid);
  } else { 
    console.error("У выбранного option отсутствуют необходимые параметры."); 
  } 
});
BuildingContainer.addEventListener("change", function() { 
  const selectedOption = this.options[this.selectedIndex]; 
  if (selectedOption.hasAttribute("data-objectid") && selectedOption.hasAttribute("data-objectguid")) { 
    fetchAndDisplayButtons(selectedOption.dataset.objectid, selectedOption.dataset.objectguid);
  } else { 
    console.error("У выбранного option отсутствуют необходимые параметры."); 
  } 
});


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
      //---------------------------------------------------------------------------------------------------------------------
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

function handleSelectChange(option) {
  if(selected.includes(option.value)){
    option.style.backgroundColor = 'gray'; 
  } else {
    option.style.backgroundColor = '';
  }
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
    topicSelector.innerHTML = ''; 
    data.forEach(tag => { 
      const option = document.createElement('option'); 
      option.value = tag.id; 
      option.text = tag.name;
      option.addEventListener("click", ()=>{SelectedTagIds(option); handleSelectChange(option)}); 
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
    });

    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('token');
        window.location.reload();
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
    deletechild(RegionContainer);
    fetchAndDisplayButtons(null);
    console.log(result);
});


async function createPost() {

  const title = document.getElementById('title').value;
  var image = document.getElementById('image').value;
  const text = document.getElementById('text').value;
  var addressId = curentaddress;
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
      console.log(curentaddress);
      console.log(JSON.stringify(data));
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || response.statusText}`);

    }

    const responseData = await response.json();
    console.log('Post created successfully:', responseData);
  } catch (error) {
    console.error('Error creating post:', error);
  }
}