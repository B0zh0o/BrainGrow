document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Регистрацията е успешна! Сега се впиши.');
            window.location.href = 'login.html';
        } else {
            alert(data.message || 'Възникна грешка при регистрация');
        }
    } catch (err) {
        console.error('Грешка:', err);
        alert('Няма връзка със сървъра. Провери дали бекендът работи.');
    }
});