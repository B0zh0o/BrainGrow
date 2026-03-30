const input = document.getElementById('confirmInput');
const btn = document.getElementById('finalDeleteBtn');
const SECRET_PHRASE = "I_CONFIRM_MY_CHOICE";

input.addEventListener('input', (e) => {
    if (e.target.value === SECRET_PHRASE) {
        btn.disabled = false;
        btn.style.cursor = "pointer";
        btn.style.opacity = "1";
    } else {
        btn.disabled = true;
        btn.style.cursor = "not-allowed";
        btn.style.opacity = "0.5";
    }
});

btn.onclick = async () => {
    const response = await fetch('http://localhost:3000/auth/delete-me', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (response.ok) {
        alert("Акаунтът е успешно изтрит.");
        localStorage.clear();
        window.location.href = "./register.html";
    } else {
        alert("Нещо се обърка.");
    }
};