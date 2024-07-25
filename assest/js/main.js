import API_URL from "./constant/api.js";
import * as utils from './utils/index.js';

const sendLogin = async (data) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

const sendRegister = async (data) => {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

const getValueOfForm = (event) => {
    return event && Object.fromEntries([...new FormData(event.target)]);
}

const showNotification = (action) => {
    let notification;

    if (action === 'success') {
        notification = document.getElementById('notification-success');
    } else {
        notification = document.getElementById('notification');
    }
    notification.classList.add('show');

    notification.addEventListener('animationend', function () {
        notification.classList.remove('show');
    }, { once: true });
}

const loading = (id) => {
    const button = document.getElementById(id);
    button.disabled = true;
    button.innerHTML = `
        Loading
        <div class="spinner-border spinner-border-sm" role="status">
        </div>
    `;
}

const removeLoading = (id) => {
    const button = document.getElementById(id);
    button.disabled = false;
    button.innerHTML = "Submit";
}

const addEventListeners = () => {
    const formLogin = document.getElementById("form-login");
    const formRegister = document.getElementById("form-register");
    const swapRegister = document.getElementById("swap-register");
    const swapLogin = document.getElementById("swap-login");

    if (formLogin) {
        formLogin.addEventListener('submit', async (event) => {
            event.preventDefault();
            const { email, password } = getValueOfForm(event);

            loading('btn-login');
            const response = await sendLogin({ email, password });
            removeLoading('btn-login');

            if (response && response.code === 400) {
                document.getElementById("noti-err").innerText = response.message;
                showNotification('error');
            }
            if (response && response.code === 200) {
                document.getElementById("noti-success").innerText = response.message;
                showNotification('success');
                document.getElementById('form-register').reset();
                localStorage.setItem('accessToken', response.data.accessToken);
                render();
            }
        });
    }

    if (formRegister) {
        formRegister.addEventListener('submit', async (event) => {
            event.preventDefault();
            const { email, password } = getValueOfForm(event);
            const name = email.split("@")[0];

            loading('btn-register');
            const response = await sendRegister({ email, password, name });
            removeLoading('btn-register');

            if (response && response.code === 400) {
                document.getElementById("noti-err").innerText = response.message;
                showNotification('error');
            }
            if (response && response.code === 201) {
                document.getElementById("noti-success").innerText = response.message;
                showNotification('success');
                document.getElementById('form-register').reset();
            }
        });
    }

    if (swapRegister) {
        swapRegister.addEventListener('click', () => {
            document.querySelectorAll('.layout-page')[0].classList.add("d-none");
            document.querySelectorAll('.layout-page')[1].classList.remove("d-none");
        });
    }

    if (swapLogin) {
        swapLogin.addEventListener('click', () => {
            document.querySelectorAll('.layout-page')[0].classList.remove("d-none");
            document.querySelectorAll('.layout-page')[1].classList.add("d-none");
        });
    }
}

const getUser = async (accessToken) => {
    const response = await fetch(`${API_URL}/users/profile`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        }
    });
    return response.json();
}

const getBlogs = async () => {
    const response = await fetch(`${API_URL}/blogs`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });
    return response.json();
}

const extractVideoId = (url) => {
    const regex = /v=([^&%\s]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

const postBlog = async (accessToken, content) => {
    try {
        const response = await fetch(`${API_URL}/blogs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(content)
        });
        return response.json();
    } catch (error) {
        console.log(error);
    }
}

const logout = () => {
    localStorage.removeItem('accessToken');
    window.location.reload();
}

/**
 * RENDER FUNCTION
 */
const render = async () => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
        document.getElementsByTagName('body')[0].innerHTML = `
            <div id="notification">
                <div style="display: flex; align-items: center; gap: 20px;">
                    <img src="https://fullstack-nodejs.fullstack.edu.vn/assets/f8_icon.png" alt="logo-f8">
                    <span id="noti-err" style="font-weight: bold; color: black;"></span>
                </div>
            </div>

            <div id="notification-success">
                <div style="display: flex; align-items: center; gap: 20px;">
                    <img src="https://fullstack-nodejs.fullstack.edu.vn/assets/f8_icon.png" alt="logo-f8">
                    <span id="noti-success" style="font-weight: bold; color: black;"></span>
                </div>
            </div>
            <div class="layout-page">
                <form id="form-login" style="width: 350px;">
                    <div style="text-align: center;">
                        <h3>Login</h3>
                    </div>
                    <div class="mb-3 w-100">
                        <label for="exampleInputEmail1" class="form-label">Email address</label>
                        <input name="email" type="email" class="form-control w-100" id="exampleInputEmail1"
                            aria-describedby="emailHelp">
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputPassword1" class="form-label">Password</label>
                        <input name="password" type="password" class="form-control w-100" id="exampleInputPassword1">
                    </div>
                    <button id="btn-login" type="submit" class="btn btn-primary w-100">Submit
                    </button>

                    <div class="mt-3" id="swap-register">
                        Don't have account? <span
                            style="text-decoration: underline; color: royalblue; cursor: pointer;">Register</span>
                    </div>
                </form>
            </div>

            <div class="layout-page d-none">
                <div id="register-page">
                    <form id="form-register" style="width: 350px;">
                        <div style="text-align: center;">
                            <h3>Register</h3>
                        </div>
                        <div class="mb-3 w-100">
                            <label for="exampleInputEmail1" class="form-label">Email address</label>
                            <input name="email" type="email" class="form-control w-100" id="exampleInputEmailRegister"
                                aria-describedby="emailHelp">
                        </div>
                        <div class="mb-3">
                            <label for="exampleInputPassword1" class="form-label">Password</label>
                            <input name="password" type="password" class="form-control w-100" id="exampleInputPasswordRegister">
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Submit</button>

                        <div class="mt-3" id="swap-login">
                            Already have account? <span
                                style="text-decoration: underline; color: royalblue; cursor: pointer;">Login</span>
                        </div>
                    </form>
                </div>
            </div>
        `;
        addEventListeners(); // Add event listeners after rendering the DOM
    } else {
        const res = await getUser(accessToken);

        if (res.code === 401) {
            logout();
            return;
        }
        const user = res.data;
        const avatarDefault = 'https://th.bing.com/th/id/OIP.52T8HHBWh6b0dwrG6tSpVQHaFe?rs=1&pid=ImgDetMain';

        let post = `
        <div class="header">
            <div id="logo" style="cursor: pointer;">
                <img src="https://fullstack-nodejs.fullstack.edu.vn/assets/f8_icon.png" alt="logo-f8">
            </div>
            <h3>
                welcome to your blog
            </h3>
            <div class="dropdown">
                <div style="cursor: pointer;" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="${user.avatar ? user.avatar : avatarDefault}" alt="avatar">
                </div>
                <ul class="dropdown-menu">
                    <li><span style="cursor: pointer" class="dropdown-item" id="btn-logout">Đăng xuất</span></li>
                </ul>
            </div>
        </div>

        <div class="container">
            <div class="status">
                <img style="object-fit: cover; width: 35px; height: 35px; border-radius: 50%;"
                    src="${user.avatar ? user.avatar : avatarDefault}" alt="avatar">
                    <div class="post-status" id="user-input" data-bs-toggle="modal" data-bs-target="#statusPopup">
                        <span>${user.name} ơi, bạn đang nghĩ gì vậy ?</span>
                    </div>

                    <!-- Modal -->
                    <div class="modal fade" id="statusPopup" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                        aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Tạo bài viết</h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <span class="label-post">Tiêu đề</span>
                                    <div contenteditable="" class="create-title">

                                    </div>

                                    <span class="label-post">Nội dung</span>
                                    <div contenteditable="" class="create-post">

                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                    <button type="button" id="btn-post" class="btn btn-primary">Tạo</button>
                                </div>
                            </div>
                        </div>
                    </div>
                <!-- END Modal -->
            </div>
            
        `;

        const resGetBlogs = await getBlogs();
        const blogs = resGetBlogs.data;

        blogs.map((blog) => {
            post += `
                <div class="post">
                    <div style="padding: 10px;">
                        <div class="user-info-post-top">
                            <div class="user-info-post">
                                <img style="width: 25px; height: 25px; border-radius: 50%; object-fit: cover;"
                                    src="${avatarDefault}" alt="logo-f8">
                                <span style="font-size: 17px;">${blog.userId.name}</span>
                            </div>
                            <span class="time-ago" style="color: #5585b5">
                                ${utils.timeAgo(blog.createdAt)}
                            </span>
                        </div>
                        <div class="user-content-post">
                            <h4>${blog.title}</h4>
                            <p>${blog.content}</p>
                ${extractVideoId(blog.content) ?
                    `<div>
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/${extractVideoId(blog.content)}" frameborder="0" allowfullscreen></iframe>
                    </div>` : ''
                }
                        </div>
                    </div>
                    <div style="margin: 0 10px 10px 0; text-align: end; color: #5585b5">
                        ${utils.getDMY(blog.createdAt)}
                    </div>
                </div>
            `;
        });
        post += `</div>`;

        document.getElementsByTagName('body')[0].innerHTML = post;

        const logo = document.getElementById('logo');
        const btnPost = document.getElementById("btn-post");
        const userPostInput = document.querySelector('.create-post');
        const userTitleInput = document.querySelector('.create-title');
        const btnLogout = document.getElementById('btn-logout');

        if (logo) {
            logo.addEventListener('click', () => {
                window.location.reload();
            });
        }

        if (btnLogout) {
            btnLogout.addEventListener('click', () => {
                logout();
            });
        }

        if (btnPost) {
            btnPost.addEventListener('click', async () => {
                const content = userPostInput.innerText;
                const title = userTitleInput.innerText;

                if (!content || !title) {
                    alert('Content and title are required');
                    return;
                }

                loading('btn-post');
                const response = await postBlog(accessToken, { title, content });
                removeLoading('btn-post');

                if (response && response.code === 200) {
                    window.location.reload();
                }
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', render);
