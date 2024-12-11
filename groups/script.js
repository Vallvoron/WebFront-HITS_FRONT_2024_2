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
      loginButton.addEventListener('click', ()=>{
        window.location.href = 'file:///C:/lab2/log/login.html'
      })
    }

    loadGroups();
});

async function loadGroups() {
    const errorMessage = document.getElementById("errorMessage");
    const groupsContainer = document.getElementById("groups-container");
    groupsContainer.innerHTML = "";

    const token = localStorage.getItem("token");
    if (!token) {
        errorMessage.textContent = 'Вы не авторизованы. Для просмотра групп необходимо зарегестрироваться';
        errorMessage.style.color = 'red';
        return;
    }

    try {
        const allGroupsResponse = await fetch("https://blog.kreosoft.space/api/community");
        const allGroups = await allGroupsResponse.json();

        const myGroupsResponse = await fetch("https://blog.kreosoft.space/api/community/my", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        const myGroups = await myGroupsResponse.json();

        allGroups.forEach((group) => {
            const groupElement = document.createElement("div");
            groupElement.className = "group";

            const titleButton = document.createElement("button");
            titleButton.className = "groupTitel";
            titleButton.textContent = group.name;
            titleButton.onclick = () => {
                localStorage.setItem("selectedGroupId", group.id);
                window.location.href = "file:///C:/lab2/group/group.html";
            };
            groupElement.appendChild(titleButton);

            const userSubscription = myGroups.find((myGroup) => myGroup.communityId === group.id);

            if (userSubscription) {
                if (userSubscription.role === "Subscriber") {
                    const unsubscribeButton = document.createElement("button");
                    unsubscribeButton.className = "unsubscribeButton";
                    unsubscribeButton.id="subBtn";
                    unsubscribeButton.textContent = "Отписаться";
                    unsubscribeButton.addEventListener("click", async () => {
                        try {
                            fetch(`https://blog.kreosoft.space/api/community/${group.id}/unsubscribe`, {
                                method: "DELETE",
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            });
                        } catch (error) {
                            console.error("Ошибка при отписке:", error);
                            errorMessage.textContent = `Ошибка при отписке: ${error}`;
                            errorMessage.style.color = 'red';
                        }
                        location.reload();
                    });
                    groupElement.appendChild(unsubscribeButton);
                } else if (userSubscription.role === "Administrator") {

                }
            } else {
                const subscribeButton = document.createElement("button");
                subscribeButton.className = "subscribeButton";
                subscribeButton.id="subBtn";
                subscribeButton.textContent = "Подписаться";
                subscribeButton.addEventListener("click", async () => {
                    try {
                        fetch(`https://blog.kreosoft.space/api/community/${group.id}/subscribe`, {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                    } catch (error) {
                        console.error("Ошибка при подписке:", error);
                        errorMessage.textContent = `Ошибка при подписке: ${error}`;
                        errorMessage.style.color = 'red';
                    }
                    location.reload();
                });
                groupElement.appendChild(subscribeButton);
            }

            groupsContainer.appendChild(groupElement);
        });
    } catch (error) {
        console.error("Ошибка при загрузке групп:", error);
        errorMessage.textContent = `Произошла ошибка: ${error.message}`;
        errorMessage.style.color = 'red';
    }
}


function redirectToProfile() {
    window.location.href = "file:///C:/lab2/prof/profile.html";
} 

function refreshPage() {
    location.reload();
}
