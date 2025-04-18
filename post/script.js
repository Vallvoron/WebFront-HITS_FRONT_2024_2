const postContainer = document.getElementById('post-container'); 
const postTemplate = document.getElementById('post-template');
const paginationContainer = document.getElementById('pagination'); 
const authorFilter = document.getElementById('author-filter'); 
const sortingSelect = document.getElementById('sorting-select'); 
const applyFilterButton = document.getElementById('filter-button'); 

const topicSelector = document.getElementById('topicSelector');
const authorInput = document.getElementById('author-search');
const authorMinInput = document.getElementById('authorMin');
const authorMaxInput = document.getElementById('authorMax');
const sortingInput = document.getElementById('sort-by');
const onlyMyCommunitiesInput = document.getElementById('my-groups-only');
const PaginachionContainer = document.getElementById('PaginachionContainer');

const loginButton = document.getElementById('in');
const profileButton = document.getElementById('profileButton');
const logoutButton = document.getElementById('logoutButton');
const userMenu = document.getElementById('userMenu');
let userMenuListenerAttached = false;

let currentPage = 1; 
let pageSize = 5; 
let pagecount;
let currentFilters = {}; 
let currentSorting = ''; 

let selected = [];

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
        window.location.href = "file:///C:/lab2/log/login.html"
      });
      userMenuListenerAttached = true;
    }
}


function like(container, counter) { 
  const authToken = localStorage.getItem('token'); 
  if(container.src=="https://sun9-6.userapi.com/impg/zl2ZrpkSFaffSLnDMJ2hgkrBwW8Q_IFHp1K9SQ/hg019m1fCik.jpg?size=512x512&quality=95&sign=138593f04c7f535c97dfebd6c1bf7374&type=album"){ 
    console.log("repeat"); 
    fetch(`https://blog.kreosoft.space/api/post/${container.alt}/like`, { 
      method: 'POST', 
      headers: { 
        'Content-Type': 'application/json', 
        Authorization: `Bearer ${authToken} `
      }, 
    }) 
    .then(response => { 
      console.log(response); 
      if (!response.ok) { 
        throw new Error(`HTTP error! status: ${response.status}`); 
      } 
      return response; 
    }) 
    .then(() => { 
      counter.textContent = parseInt(counter.textContent) + 1; 
      container.src = "https://sun9-73.userapi.com/impg/HEprHP_e8TtM2WI4li0Ww4FRp8xYarw9-YQqNA/2y2ssPm0Kig.jpg?size=512x512&quality=95&sign=234bc5483d706e9d318749fceadaaee7&type=album"; 
    }) 
    .catch(error => { 
      console.error("Error liking post:", error); 
    }); 
  } 
  else{ 
    console.log("again"); 
    fetch(`https://blog.kreosoft.space/api/post/${container.alt}/like`, { 
      method: 'DELETE', 
      headers: { 
        'Content-Type': 'application/json', 
        Authorization: `Bearer ${authToken}`
      }, 
    }) 
    .then(response => { 
      if (!response.ok) { 
        throw new Error(`HTTP error! status: ${response.status}`); 
      } 
      console.log(response); 
      return response; 
    }) 
    .then(() => { 
      counter.textContent = parseInt(counter.textContent) - 1; 
      container.src = "https://sun9-6.userapi.com/impg/zl2ZrpkSFaffSLnDMJ2hgkrBwW8Q_IFHp1K9SQ/hg019m1fCik.jpg?size=512x512&quality=95&sign=138593f04c7f535c97dfebd6c1bf7374&type=album"; 
    }) 
    .catch(error => { 
      console.error("Error unliking post:", error); 
    }); 
  } 
};

function SelectedTagIds(option) {
  console.log(option.value) 
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

function goLeft(flag){
  if(flag == 0){
    currentPage = 1;
    applyFilterButton.click(); 
  }else if (currentPage - flag > 0){
    currentPage -= flag;
    applyFilterButton.click(); 
  }
}
function goRight(flag){
  if(flag == 0){
    currentPage = pagecount;
    applyFilterButton.click(); 
  }else if (currentPage + flag <= pagecount){
    currentPage += flag;
    applyFilterButton.click(); 
  }
  
}

function paginationBTN(){
  const button1 = document.createElement('button');
  button1.textContent = '<<';
  button1.id = 'button1';
  button1.addEventListener("click", ()=>{goLeft(0)});
  const button2 = document.createElement('button');
  button2.textContent = currentPage - 2;
  button2.id = 'button2';
  button2.addEventListener("click", ()=>{goLeft(2)});
  const button3 = document.createElement('button');
  button3.textContent = currentPage - 1;
  button3.id = 'button3';
  button3.addEventListener("click", ()=>{goLeft(1)});
  const button4 = document.createElement('button');
  button4.textContent = currentPage;
  button4.id = 'button4';
  const button5 = document.createElement('button');
  button5.textContent = currentPage +1;
  button5.id = 'button5';
  button5.addEventListener("click", ()=>{goRight(1)});
  const button6 = document.createElement('button');
  button6.textContent = currentPage + 2;
  button6.id = 'button6';
  button6.addEventListener("click", ()=>{goRight(2)});
  const button7 = document.createElement('button');
  button7.textContent = '>>';
  button7.id = 'button7';
  button7.addEventListener("click", ()=>{goRight(0)});
  PaginachionContainer.appendChild(button1);
  PaginachionContainer.appendChild(button2);
  PaginachionContainer.appendChild(button3);
  PaginachionContainer.appendChild(button4);
  PaginachionContainer.appendChild(button5);
  PaginachionContainer.appendChild(button6);
  PaginachionContainer.appendChild(button7);
}

function editPaginationBTN(){
  if (currentPage + 1 < pagecount){
    document.getElementById('button6').textContent=currentPage + 2; 
    document.getElementById('button6').style.display = 'inline-block';
  }else{
    document.getElementById('button6').style.display='none';
  }
  if (currentPage < pagecount){
    document.getElementById('button5').textContent=currentPage + 1; 
    document.getElementById('button5').style.display = 'inline-block';
  }else{
    document.getElementById('button5').style.display='none';
  }
  document.getElementById('button4').textContent=currentPage; 
  if (currentPage > 1){
    document.getElementById('button3').textContent=currentPage - 1; 
    document.getElementById('button3').style.display = 'inline-block';
  }else{
    document.getElementById('button3').style.display='none';
  }
  if (currentPage > 2){
    document.getElementById('button2').textContent=currentPage - 2; 
    document.getElementById('button2').style.display = 'inline-block';
  }else{
    document.getElementById('button2').style.display='none';
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
  const authorName = localStorage.getItem('selectedAuthor'); 
  if (authorName) { 
    document.getElementById('author-search').value = authorName; 
    applyFilterButton.click(); 
    localStorage.removeItem('selectedAuthor'); 
  } 
  getTags(); 
  paginationBTN();
  editPaginationBTN();
});

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${day}.${month}.${year}`;
}

applyFilterButton.addEventListener('click', () => {
    postContainer.innerHTML = '';
    const params = {};
    pageSize = document.getElementById('postcount').value;

    
    if (authorInput.value.trim() !== '') {
        params.author = authorInput.value;
    }
    if (authorMinInput.value.trim() !== '') {
        params.min = parseInt(authorMinInput.value, 10);
    }
    if (authorMaxInput.value.trim() !== '') {
        params.max = parseInt(authorMaxInput.value, 10);
    }
    if (sortingInput.value.trim() !== '') {
        params.sorting = sortingInput.value;
    }
        params.onlyMyCommunities = onlyMyCommunitiesInput.checked; 
    if (currentPage != 1){
      params.page =currentPage;
    } else {
      params.page = 1;
    }
    if (pageSize != 5 && pageSize > 0){
      params.size = pageSize;
    } else {
      params.size = 5;
    }

    let url = new URL('https://blog.kreosoft.space/api/post');

    for (const key in params) {
        if (params.hasOwnProperty(key)) {
          let value = params[key];
          if (Array.isArray(value)) {
            value = value.join(',');
          } else if (typeof value === 'number' && isNaN(value)) {
            continue;
          }
    
          url.searchParams.append(key, value);
        }
    }

    if (topicSelector.value.trim() !== '') {
      selected.forEach(tag => {
        url+="&tags="+tag;
      });
      params.tags = selected.map(s => s.trim());
    }
  
    console.log(url);
    fetch(url, { 
        method: 'GET', 
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json' 
        }, 
    })
    .then(response => {
        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
      pagecount = data.pagination.count;
        const posts = data.posts;
        posts.forEach(post => {
          const postBlock = postTemplate.content.cloneNode(true);
          if(post.communityName==null){
            postBlock.querySelector('.author-info').textContent = textContent = `${post.author} - ${formatDate(post.createTime)}`;
          }else{
            postBlock.querySelector('.author-info').textContent = textContent = `${post.author} - ${formatDate(post.createTime)} в сообществе "${post.communityName}"`;
          }
          postBlock.querySelector('.title').textContent =  post.title;
          postBlock.querySelector('.description').textContent =  post.description;
          postBlock.querySelector('.timeRied').textContent = `Время чтения: ${post.readingTime} мин`;
          postBlock.querySelector('.tags').textContent = `${post.tags.map(tag => '#'+tag.name).join(' ')}`;
          postBlock.querySelector('.status .comments .commentscount').textContent = post.commentsCount;
          postBlock.querySelector('.status .like .likescount').textContent = post.likes;
          if(post.hasLike==true){ 
            postBlock.querySelector('.status .like img').src = "https://sun9-73.userapi.com/impg/HEprHP_e8TtM2WI4li0Ww4FRp8xYarw9-YQqNA/2y2ssPm0Kig.jpg?size=512x512&quality=95&sign=234bc5483d706e9d318749fceadaaee7&type=album"; 
            postBlock.querySelector('.status .like img').alt = post.id; 
            const block=(postBlock.querySelector('.status .like img')); 
            const likes=postBlock.querySelector('.status .like .likescount'); 
            postBlock.querySelector('.status .like img').addEventListener('click', () => { 
              like(block,likes); 
            }); 
          } 
          else{ 
            postBlock.querySelector('.status .like img').src = "https://sun9-6.userapi.com/impg/zl2ZrpkSFaffSLnDMJ2hgkrBwW8Q_IFHp1K9SQ/hg019m1fCik.jpg?size=512x512&quality=95&sign=138593f04c7f535c97dfebd6c1bf7374&type=album"; 
            postBlock.querySelector('.status .like img').alt = post.id; 
            const block=(postBlock.querySelector('.status .like img')); 
            const likes=postBlock.querySelector('.status .like .likescount'); 
            postBlock.querySelector('.status .like img').addEventListener('click', () => { 
              like(block,likes); 
            }); 
          }if (post.image) {
            postBlock.querySelector('.img img').src = post.image;
            postBlock.querySelector('.img img').alt = post.title;
          }
            postContainer.appendChild(postBlock);     
            editPaginationBTN();
          });
    });
})

function newpost(){
  window.location.href = "file:///C:/lab2/newPost/creater.html"
}
