const postContainer = document.getElementById('post-container'); 
const postTemplate = document.getElementById('post-template');
const paginationContainer = document.getElementById('pagination'); 
const authorFilter = document.getElementById('author-filter'); 
const sortingSelect = document.getElementById('sorting-select'); 
const applyFilterButton = document.getElementById('apply-filter'); 
 
let currentPage = 1; 
let pageSize = 5; 
let currentFilters = {}; 
let currentSorting = ''; 

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${day}.${month}.${year}`;
}

window.addEventListener('load', () => {
    const postContainer = document.getElementById('post-container');

    fetch('https://blog.kreosoft.space/api/post', { 
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
/*
function displayPosts(posts) { 
    postsContainer.innerHTML = ''; 
    posts.forEach(post => { 
        const postDiv = document.createElement('div'); 
        postDiv.classList.add('post'); 
        postDiv.innerHTML = ` 
            <h3>${post.title}</h3> 
            <div class="post-content">${post.content.substring(0, 100)}...</div> 
            <button class="show-more" data-post-id="${post.id}">Показать полностью</button> 
            <p>Автор: ${post.author}</p> 
            <p>Время чтения: ${post.read_time} мин.</p> 
            <div class="likes">Лайки: ${post.likes}</div> 
        `; 
        postsContainer.appendChild(postDiv); 
 
        const showMoreButton = postDiv.querySelector('.show-more'); 
        showMoreButton.addEventListener('click', () => { 
            const contentDiv = postDiv.querySelector('.post-content'); 
            contentDiv.classList.toggle('expanded'); 
            if (contentDiv.classList.contains('expanded')) { 
                showMoreButton.textContent = 'Скрыть'; 
            } else { 
                showMoreButton.textContent = 'Показать полностью'; 
            } 
        }); 
 
    }); 
} */
 
function displayPagination(totalPages, totalCount) { 
    paginationContainer.innerHTML = ''; 
    for (let i = 1; i <= totalPages; i++) { 
        const pageLink = document.createElement('a'); 
        pageLink.href = '#'; 
        pageLink.textContent = i; 
        pageLink.addEventListener('click', () => { 
            currentPage = i; 
            fetchPosts(currentPage, pageSize, currentFilters, currentSorting); 
        }); 
        paginationContainer.appendChild(pageLink); 
    } 
}