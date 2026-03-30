const API_URL = "http://localhost:3000";

async function loadUsers() {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(API_URL + "/auth", {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Failed to fetch users");

        const users = await res.json();
        const list = document.getElementById("userList");
        list.innerHTML = "";

        users.forEach(user => {
            const row = document.createElement("tr");

            const userJson = JSON.stringify(user).replace(/"/g, '&quot;');

            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <button class="edit-btn" onclick="openEditModal('${userJson}')">Edit</button>
                    <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
                </td>
            `;
            list.appendChild(row);
        });
    } catch (err) {
        console.error("Load users error:", err);
    }
}

function openEditModal(userStr) {
    const user = JSON.parse(userStr.replace(/&quot;/g, '"'));

    document.getElementById('editUserId').value = user.id;
    document.getElementById('editUsername').value = user.username;
    document.getElementById('editEmail').value = user.email;
    document.getElementById('editRole').value = user.role;

    document.getElementById('editModal').style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('editModal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('editPassword').value = "";
    }
}

window.onclick = function (event) {
    const modal = document.getElementById('editModal');
    if (event.target == modal) {
        closeModal();
    }
}

async function saveEdit() {
    const id = document.getElementById('editUserId').value;
    const token = localStorage.getItem('token');
    const newPassword = document.getElementById('editPassword').value;

    const updatedData = {
        username: document.getElementById('editUsername').value,
        email: document.getElementById('editEmail').value,
        role: document.getElementById('editRole').value
    };

    if (newPassword.trim() !== "") {
        updatedData.password = newPassword;
    }

    try {
        const res = await fetch(`${API_URL}/auth/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedData)
        });

        if (res.ok) {
            document.getElementById('editPassword').value = ""; 
            closeModal();
            loadUsers();
        } else {
            const error = await res.json();
            alert("Error: " + error.message);
        }
    } catch (err) {
        console.error("Save error:", err);
    }
}

async function deleteUser(id) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${API_URL}/auth/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
            loadUsers();
        } else {
            alert("Could not delete user.");
        }
    } catch (err) {
        console.error("Delete error:", err);
    }
}

loadUsers();