const API_URL = "http://localhost:3000";

async function loadUsers() {
    const token = localStorage.getItem('token');
    const res = await fetch(API_URL + "/auth", { 
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const users = await res.json();

    const list = document.getElementById("userList");
    list.innerHTML = "";

    users.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
            </td>
        `;
        list.appendChild(row);
    });
}

async function deleteUser(id) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    const token = localStorage.getItem('token');
    await fetch(API_URL + `/auth/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    loadUsers(); 
}

loadUsers();