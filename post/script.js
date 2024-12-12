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
const pageInput = document.getElementById('page');
const sizeInput = document.getElementById('size');

const loginButton = document.getElementById('in');
const profileButton = document.getElementById('profileButton');
const logoutButton = document.getElementById('logoutButton');
const userMenu = document.getElementById('userMenu');
let userMenuListenerAttached = false;

let currentPage = 1; 
let pageSize = 5; 
let currentFilters = {}; 
let currentSorting = ''; 

let selected = [];

function like(container, counter) {
  const authToken = localStorage.getItem('token');
  if(container.src=="https://sun9-6.userapi.com/impg/zl2ZrpkSFaffSLnDMJ2hgkrBwW8Q_IFHp1K9SQ/hg019m1fCik.jpg?size=512x512&quality=95&sign=138593f04c7f535c97dfebd6c1bf7374&type=album"){
    console.log("repeat");
    fetch(`https://blog.kreosoft.space/api/post/${container.alt}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
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
      // Handle the error appropriately (e.g., display an error message)
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
    .then(() => { // This runs after successful fetch
      counter.textContent = parseInt(counter.textContent) - 1;
      container.src = "https://sun9-6.userapi.com/impg/zl2ZrpkSFaffSLnDMJ2hgkrBwW8Q_IFHp1K9SQ/hg019m1fCik.jpg?size=512x512&quality=95&sign=138593f04c7f535c97dfebd6c1bf7374&type=album";
    })
    .catch(error => {
      console.error("Error unliking post:", error);
      // Handle the error appropriately
    });
  }
};

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
      option.addEventListener("click", ()=>{SelectedTagIds(option)});
      topicSelector.appendChild(option);
    });
  });
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
});

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

applyFilterButton.addEventListener('click', () => {
    const postContainer = document.getElementById('post-container');
    postContainer.innerHTML = '';
    params={};
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

    if (false)//pageInput.value.trim() !== '') {
     {   params.page = parseInt(pageInput.value, 10) || 1;
    } else {params.page = 1;}
    if (false)//sizeInput.value.trim() !== '') {
        {params.size = parseInt(sizeInput.value, 10) || 5;
    } else {params.size = 5;}

    url = new URL('https://blog.kreosoft.space/api/post');
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

    if (params.size <=0 || params.page <= 0) {
        alert("Размер страницы и номер страницы должны быть положительными числами")
        return;
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
        const posts = data.posts;
        posts.forEach(post => {
            const postBlock = postTemplate.content.cloneNode(true);

            if(post.communityName==null){
              postBlock.querySelector('.author-info').textContent = textContent = `${post.author} - ${formatDate(post.createTime)}`;
            } else{ postBlock.querySelector('.author-info').textContent = textContent = `${post.author} - ${formatDate(post.createTime)} в сообществе "${post.communityName}"`}
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
              }
            if (post.image) {
                postBlock.querySelector('.img img').src = post.image;
                postBlock.querySelector('.img img').alt = post.title;
            }
            postContainer.appendChild(postBlock); 
          });
        
    });
})

function newpost()
{
    window.location.href = "C:/lab2/newPost/creater.html"
}
