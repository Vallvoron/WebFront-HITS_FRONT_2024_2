const postContainer = document.getElementById('post-container'); 
const postTemplate = document.getElementById('post-template');
const paginationContainer = document.getElementById('pagination'); 
const authorFilter = document.getElementById('author-filter'); 
const sortingSelect = document.getElementById('sorting-select'); 
const applyFilterButton = document.getElementById('filter-button'); 

const tagListInput = document.getElementById('tag-search');
const authorInput = document.getElementById('author-search');
const authorMinInput = document.getElementById('authorMin');
const authorMaxInput = document.getElementById('authorMax');
const sortingInput = document.getElementById('sort-by');
const onlyMyCommunitiesInput = document.getElementById('my-groups-only');
const pageInput = document.getElementById('page');
const sizeInput = document.getElementById('size');

 
let currentPage = 1; 
let pageSize = 5; 
let currentFilters = {}; 
let currentSorting = ''; 

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
    const params = {};
    if (tagListInput.value.trim() !== '') {
        params.tags = tagListInput.value.split(',').map(s => s.trim());
    }
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
        params.onlyMyCommunities = onlyMyCommunitiesInput.checked; // Булево значение всегда передаётся

    if (false)//pageInput.value.trim() !== '') {
     {   params.page = parseInt(pageInput.value, 10) || 1;
    } else {params.page = 1;}
    if (false)//sizeInput.value.trim() !== '') {
        {params.size = parseInt(sizeInput.value, 10) || 5;
    } else {params.size = 5;}

    const url = new URL('https://blog.kreosoft.space/api/post');

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

    if (params.size <=0 || params.page <= 0) {
        alert("Размер страницы и номер страницы должны быть положительными числами")
        return;
    }

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

            postBlock.querySelector('.author-info').textContent = textContent = `${post.author} - ${formatDate(post.createTime)} в сообществе "${post.communityName}"`;
            postBlock.querySelector('.title').textContent =  post.title;
            postBlock.querySelector('.description').textContent =  post.description;
            postBlock.querySelector('.timeRied').textContent = `Время чтения: ${post.readingTime} мин`;
            postBlock.querySelector('.tags').textContent = `${post.tags.map(tag => '#'+tag.name).join(' ')}`;
            postBlock.querySelector('.status .comments .commentscount').textContent = post.commentsCount;
            postBlock.querySelector('.status .like .likescount').textContent = post.likes;
            if(post.hasLike==true){
                postBlock.querySelector('.status .like img').src = "https://sun9-73.userapi.com/impg/HEprHP_e8TtM2WI4li0Ww4FRp8xYarw9-YQqNA/2y2ssPm0Kig.jpg?size=512x512&quality=95&sign=234bc5483d706e9d318749fceadaaee7&type=album";
            }else{
                postBlock.querySelector('.status .like img').src = "https://sun9-6.userapi.com/impg/zl2ZrpkSFaffSLnDMJ2hgkrBwW8Q_IFHp1K9SQ/hg019m1fCik.jpg?size=512x512&quality=95&sign=138593f04c7f535c97dfebd6c1bf7374&type=album";}
            if (post.image) {
                postBlock.querySelector('.img img').src = post.image;
                postBlock.querySelector('.img img').alt = post.title;
            }
            postContainer.appendChild(postBlock); 
          });
        
    });
})
